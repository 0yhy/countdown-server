const axios = require("axios");
const express = require("express");
const jwt = require("jsonwebtoken");

const { tokenSecret } = require("../keys/token");
const { AppId, AppSecret } = require("../keys/config");
const { verifyToken } = require("../middleware/verifyToken");
const { CountdownModel, AdviceSchema } = require("../db/models");
const { calcDateDiff } = require("../utils/calcDateDiff");

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 获取token
router.post("/token", function (req, res, next) {
  console.log(req.body.code);
  if (req.body.code) {
    const app_access_options = {
      method: "post",
      url: "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/",
      data: { app_id: AppId, app_secret: AppSecret },
    };
    axios(app_access_options)
      .then((app_access_token_res) => {
        axios({
          method: "post",
          url: "https://open.feishu.cn/open-apis/mina/v2/tokenLoginValidate",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${app_access_token_res.data.app_access_token}`,
          },
          data: {
            code: req.body.code,
          },
        }).then((token_res) => {
          const exp = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;
          const payload = { openid: token_res.data.data.open_id, exp: exp };
          const token = jwt.sign(payload, tokenSecret);
          res.send({ code: 0, data: { token: token, expire: exp } });
        });
      })
      .catch((err) => console.log(err));
  }
});

// 获取用户的所有倒计时
router.get("/countdown", verifyToken, function (req, res, next) {
  const { openid } = req.payload;
  CountdownModel.find({ openid: openid }, { __v: 0 }, function (err, countdowns) {
    console.log(countdowns);
    if (err) {
      res.send({ code: 1, data: err });
    } else {
      res.send({ code: 0, data: countdowns });
    }
  });
});
// 新增倒计时
router.post("/countdown", verifyToken, function (req, res, next) {
  const { openid } = req.payload;
  const { title, tip, start_date, end_date } = req.body;
  const total = calcDateDiff(start_date, end_date);
  const newCountdown = {
    openid: openid,
    title: title,
    tip: tip,
    start_date: start_date,
    end_date: end_date,
    total: total,
  };
  console.log(newCountdown);
  new CountdownModel(newCountdown).save((err, doc) => {
    if (err) {
      res.send({ code: 1, data: err });
    } else {
      res.send({ code: 0, data: null });
    }
  });
});
// 修改倒计时
router.put("/countdown", verifyToken, function (req, res, next) {
  const modifiedData = req.body;
  const { start_date, end_date } = modifiedData;
  modifiedData.total = calcDateDiff(start_date, end_date);
  CountdownModel.updateOne({ _id: modifiedData._id }, modifiedData, (err, doc) => {
    if (err) {
      res.send({ code: 1, data: err });
    } else {
      res.send({ code: 0, data: null });
    }
  });
});
// 删除倒计时
router.delete("/countdown", verifyToken, function (req, res, next) {
  const { _id } = req.body;
  CountdownModel.deleteOne({ _id: _id }, (err, doc) => {
    if (err) {
      res.send({ code: 1, data: err });
    } else {
      res.send({ code: 0, data: null });
    }
  });
});
// 反馈与意见
router.post("/advice", verifyToken, function (req, res, next) {
  const { openid } = req.payload;
  const { advice } = req.body;
  const newAdvice = { openid: openid, advice: advice };
  new AdviceSchema(newAdvice).save((err, doc) => {
    if (err) {
      res.send({ code: 1, data: err });
    } else {
      res.send({ code: 0, data: null });
    }
  });
});

module.exports = router;
