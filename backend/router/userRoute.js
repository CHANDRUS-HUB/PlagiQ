const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/userController");

const {
  getUserDashboardStats,
  getAdminDashboardStats,
  plagiarismResultHistory,
} = require("../controllers/dashboardController");

// Middlewares
const protectRoute = require("../middleware/protectRoute");
const adminOnly = require("../middleware/adminMiddleware");

// ===================== AUTH ROUTES =====================
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/logout", protectRoute, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/check-auth", checkAuth);

// ===================== USER DASHBOARD =====================
router.get("/stats", protectRoute, getUserDashboardStats);
router.post("/plagiarism-result-history", protectRoute, plagiarismResultHistory);

// ===================== ADMIN DASHBOARD =====================
router.get("/admin/activity", protectRoute, adminOnly, getAdminDashboardStats);

module.exports = router;
