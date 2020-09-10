const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/countdown";
mongoose.connect(url);
const conn = mongoose.connection;
conn.on("connected", () => {
  console.log("succeeded in connecting with mongodb");
});

const countdownSchema = mongoose.Schema({
  title: { type: String, required: true },
  tip: { type: String, required: false },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  total: { type: Number, required: true },
});

const CountdownModel = mongoose.model("countdown", countdownSchema);

module.exports = {
  CountdownModel,
};
