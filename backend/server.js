const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config();

// Event emitter limit increase
require("events").EventEmitter.defaultMaxListeners = 20;

// Express app setup
const app = express();
const port = process.env.PORT || 7000;

// Import routes and middleware
const userRoutes = require("./router/userRoute");
const plagiarismRoute = require("./router/plagarismRoute");
const multerErrorHandler = require("./middleware/multerErrorHandler");

// Database connection
const sequelize = require("./config/db");

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api", plagiarismRoute);
app.use("/", userRoutes);

// Multer error handler middleware
app.use(multerErrorHandler);

// Serve frontend static files
const buildPath = path.join(__dirname, "../Frontend/build");
app.use(express.static(buildPath));

// Catch-all route to handle React SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving frontend:", err);
      res.status(500).send("Server error");
    }
  });
});

// Sync Sequelize DB and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database & tables synced!");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error(" Database sync error:", err);
  });
