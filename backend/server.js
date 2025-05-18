const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
dotenv.config();

require("events").EventEmitter.defaultMaxListeners = 20;

const app = express();
const port = process.env.PORT || 7000;

const userRoutes = require("./router/userRoute");
const plagiarismRoute = require("./router/plagarismRoute");
const multerErrorHandler = require("./middleware/multerErrorHandler");

const sequelize = require("./config/db");

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api", plagiarismRoute);
app.use("/", userRoutes);

app.use(multerErrorHandler);

const buildPath = path.join(__dirname, "../Frontend/build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving frontend:", err);
      res.status(500).send("Server error");
    }
  });
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database & tables synced!");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error(" Database sync error:", err);
  });
