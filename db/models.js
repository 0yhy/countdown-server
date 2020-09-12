const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/countdown";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (!err) {
    console.log("succeeded in connecting with mongodb");
  }
});

const countdownSchema = mongoose.Schema({
  title: { type: String, required: true },
  tip: { type: String, required: false },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  total: { type: Number, required: true },
  openid: { type: String, required: true },
});
const adviceSchema = mongoose.Schema({
  openid: { type: String, required: true },
  advice: { type: String, required: true },
});

const CountdownModel = mongoose.model("countdown", countdownSchema);
const AdviceSchema = mongoose.model("advice", adviceSchema);

module.exports = {
  CountdownModel,
  AdviceSchema,
};
