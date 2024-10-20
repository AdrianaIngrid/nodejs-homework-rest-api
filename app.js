const express = require("express");
const logger = require("morgan");
const cors = require("cors");


const contactsRouter = require("./routes/index");
const coreOptions = require("./cors");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors(coreOptions));
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  res.status(500).json({ message: err.message });
});


module.exports = app;
