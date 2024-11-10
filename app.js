const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/index");
const userRouter = require("./routes/authRoutes");
const coreOptions = require("./cors");
const multer = require("multer");
const path = require("path");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

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
;
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});
app.post("/trimite-mail", async function (req, res, next) {
  const { destinatar, subiect, mesaj } = req.body;
  try {
    if (!destinatar || !subiect || !mesaj) {
      return res.status(400).json({ error: "Toate campurile trebuie completate!" });
    }
    const response = await mg.messages.create(
      "sandbox49647d84044f43b2bda8589a0068a842.mailgun.org",
      {
        from: "Nahut Adriana Ingrid <mailgun@sandbox49647d84044f43b2bda8589a0068a842.mailgun.org>",
        to: [destinatar],
        subject: subiect,
        text: mesaj,
        html: `"<h1>${mesaj}</h1>"`,
      }
    );
    res.status(200).json({ message: "Email trimis cu succes!", data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Eroare la trimiterea emailului!" });
  }
});


app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
