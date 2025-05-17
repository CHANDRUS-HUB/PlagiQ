const { spawn } = require('child_process');
const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const { PlagiarismHistory, UserLog } = require('../models');

async function extractTextFromFile(filePath, fileType) {
  if (fileType === 'text/plain') {
    return fs.readFileSync(filePath, 'utf-8');
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (fileType === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    const result = await pdfParse(buffer);
    return result.text;
  }
  throw new Error('Unsupported file type');
}

function simulateSemanticPlagiarismCheck(filePath, fileType, fileContent) {
  return new Promise((resolve, reject) => {
    const py = spawn(
      'python',
      ['./scripts/semantic_match.py', filePath, fileType, fileContent]
    );

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });
    py.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Python exited with code ${code}: ${errorOutput.trim()}`)
        );
      }
      try {
        resolve(JSON.parse(output));
      } catch {
        reject(new Error('Invalid JSON from Python'));
      }
    });
  });
}

const checkPlagiarism = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const { path: filePath, mimetype: fileType, originalname } = req.file;
    const fileContent = await extractTextFromFile(filePath, fileType);
    const result = await simulateSemanticPlagiarismCheck(
      filePath,
      fileType,
      fileContent
    );

    // 1) Save history and capture the returned record
    const record = await PlagiarismHistory.create({
      userId: req.user.id,
      fileName: originalname,
      plagiarismPercentage: result.percentage,
    });

    // 2) Log the action using record.id
    await UserLog.create({
      userId: req.user.id,
      action: 'file_check',
      metadata: { historyId: record.id },
    });

    // 3) Return JSON using record.createdAt
    return res.json({
      fileName: originalname,
      date: record.createdAt,
      percentage: result.percentage,
      duplicates: result.duplicates,
      total_duplicates: result.total_duplicates,
      question_count: result.question_count,
    });
  } catch (err) {
    console.error('Plagiarism check failed:', err);
    return res
      .status(500)
      .json({ message: 'Error during check', error: err.message });
  }
};

const deleteHistoryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await PlagiarismHistory.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'History entry not found.' });
    }
    return res.json({ message: 'History entry deleted successfully.' });
  } catch (err) {
    console.error('Error deleting history entry:', err);
    return res.status(500).json({ error: 'Failed to delete history entry.' });
  }
};

module.exports = { checkPlagiarism, deleteHistoryEntry };
