const axios = require("axios");
const express = require("express");
const jwt = require("jsonwebtoken");
const { tokenSecret } = require("../keys/token");
const { AppId, AppSecret } = require("../keys/config");
const { verifyToken } = require("../middleware/verifyToken");

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
          const payload = { openid: token_res.data.open_id };
          const token = jwt.sign(payload, tokenSecret, { expiresIn: "3 days" });
          res.send({ code: 0, data: { token: token, expire: new Date().getTime() / 1000 + 3 * 24 * 60 * 60 } });
        });
      })
      .catch((err) => console.log(err));
  }
});

// 获取用户的所有倒计时
router.get("/countdown", verifyToken, function (req, res, next) {
  console.log(req.payload);
});

module.exports = router;
