const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/index");
const userRouter = require("./routes/authRoutes");
const coreOptions = require("./cors");
const multer = require("multer");
const path = require("path");

const app = express();
require("./middlewares/passportConfig");
const passport = require("passport");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors(coreOptions));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);
app.use("/public/avatars", express.static("public/avatars"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const publicAvatars = multer({ storage: storage });
app.post("/public", publicAvatars.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ error: "Missing upload file!" });
    }
    const imageURL = `/public/avatars/${req.file.filename}`;
    res.status(200).json({ imageURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
