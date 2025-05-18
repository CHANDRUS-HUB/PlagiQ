const axios = require("axios");
const FormData = require("form-data");
const { PlagiarismHistory, UserLog } = require("../models");

const extractTextFromBuffer = async (file) => {
  const fileType = file.mimetype;
  const buffer = file.buffer;

  const pdfParse = require("pdf-parse");
  const mammoth = require("mammoth");

  if (fileType === "text/plain") {
    return buffer.toString("utf-8");
  } else if (fileType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error("Unsupported file type");
};

const isQuestionBank = (text) => {
  const indicators = ["What", "Why", "How", "Q:", "Q.", "?", "A.", "B.", "C.", "D:"];
  return indicators.some((word) => text.includes(word));
};

const compareFiles = async (req, res) => {
  const fileA = req.files?.fileA?.[0];
  const fileB = req.files?.fileB?.[0];
  const userId = req.body?.userId || req.user?.id;

  if (!fileA || !fileB || !userId) {
    return res.status(400).json({ message: "Both files and userId are required." });
  }

  try {
    // ✅ Validate both files for question bank content
    const contentA = await extractTextFromBuffer(fileA);
    const contentB = await extractTextFromBuffer(fileB);

    if (!isQuestionBank(contentA) || !isQuestionBank(contentB)) {
      return res.status(400).json({
        message: "Both uploaded files must be question banks (contain identifiable question structures).",
      });
    }

    const form = new FormData();
    form.append("fileA", fileA.buffer, fileA.originalname);
    form.append("fileB", fileB.buffer, fileB.originalname);

    const API_URL = process.env.FASTAPI_URL || "http://localhost:8000";

    const response = await axios.post(`${API_URL}/compare`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const similarity = response.data?.similarity;
    if (typeof similarity !== "number") {
      return res.status(502).json({ message: "Invalid response from comparison service." });
    }

    const record = await PlagiarismHistory.create({
      userId: req.user.id,
      fileName: `${fileA.originalname} vs ${fileB.originalname}`,
      plagiarismPercentage: similarity,
      createdAt: new Date(),
    });

    await UserLog.create({
      userId: req.user.id,
      action: "file_check",
      metadata: { historyId: record.id },
    });

    return res.status(200).json({
      fileA: fileA.originalname,
      fileB: fileB.originalname,
      similarity,
      checkedAt: record.createdAt,
    });

  } catch (err) {
    console.error("❌ compareFiles error:", err);

    return res.status(500).json({
      message: "Error during file comparison",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = { compareFiles };
