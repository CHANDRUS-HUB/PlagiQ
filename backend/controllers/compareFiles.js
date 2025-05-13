const axios = require("axios");
const FormData = require("form-data");
const { PlagiarismHistory, UserLog } = require("../models");

const compareFiles = async (req, res) => {

  const fileA = req.files?.fileA?.[0];
  const fileB = req.files?.fileB?.[0];
  const userId = req.body?.userId || req.user?.id;
  if (!fileA || !fileB || !userId) {
    return res.status(400).json({ message: "Both files and userId are required." });
  }

  try {
    const form = new FormData();
    form.append("fileA", fileA.buffer, fileA.originalname);
    form.append("fileB", fileB.buffer, fileB.originalname);

    const API_URL = process.env.FASTAPI_URL || "http://localhost:8000";

    const response = await axios.post(`${API_URL}/compare`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,

    });

    // 4. Validate FastAPI response
    const similarity = response.data?.similarity;
    if (typeof similarity !== "number") {
      return res.status(502).json({ message: "Invalid response from comparison service." });
    }

    // 5. Save PlagiarismHistory record
    const record = await PlagiarismHistory.create({
      userId:req.user.id,
      fileName: `${fileA.originalname} vs ${fileB.originalname}`,
      plagiarismPercentage: similarity,
      createdAt: new Date(),
    });

    // 6. Log the user action
    await UserLog.create({
      userId: req.user.id,
      action: "file_check",
      metadata: { historyId: record.id },
    });

    // 7. Return the result
    return res.status(200).json({
      fileA: fileA.originalname,
      fileB: fileB.originalname,
      similarity,
      checkedAt: record.createdAt,
    });

  } catch (err) {
    console.error("❌ compareFiles error:", err);

    if (err.response) {
      console.error("→ FastAPI status:", err.response.status);
      console.error("→ FastAPI data:", err.response.data);
    } else if (err.request) {
      console.error("→ No response from FastAPI:", err.request);
    }

    return res.status(500).json({
      message: "Error during file comparison",
      error: err.response?.data || err.message,
    });
  }
};

module.exports = { compareFiles };
