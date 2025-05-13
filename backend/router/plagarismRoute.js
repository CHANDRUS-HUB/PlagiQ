const express = require('express');
const multer = require('multer');
const path = require('path');
const plagiarismController = require('../controllers/plagarismchecker');
const compareController = require("../controllers/compareFiles");
const  protectRoute  = require('../middleware/protectRoute');
const memoryUpload = multer({ storage: multer.memoryStorage() });
const { plagiarismResultHistory } = require("../controllers/dashboardController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only txt, pdf, docx files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
  fileFilter: fileFilter
});

const router = express.Router();

router.post('/check-plagiarism', protectRoute, upload.single('file'), plagiarismController.checkPlagiarism);
router.post(
  "/compare",protectRoute,
  memoryUpload.fields([
    { name: "fileA", maxCount: 1 },
    { name: "fileB", maxCount: 1 },
  ]),
  compareController.compareFiles
);

router.post(
  '/plagiarism-result-history',
  protectRoute,
  plagiarismResultHistory
);

module.exports = router;
