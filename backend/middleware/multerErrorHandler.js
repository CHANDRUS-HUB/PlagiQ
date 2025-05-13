function multerErrorHandler(err, req, res, next) {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds the 1 MB limit.' });
    }
    if (err.message === 'Unsupported file type') {
      return res.status(400).json({ message: 'Unsupported file type. Allowed types: txt, pdf, docx.' });
    }
    return res.status(500).json({ message: 'File upload error', error: err.message });
  }
  next();
}

module.exports = multerErrorHandler;
