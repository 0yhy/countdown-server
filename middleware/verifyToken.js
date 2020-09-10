const jwt = require("jsonwebtoken");
const { tokenSecret } = require("../keys/token");

function verifyToken(req, res, next) {
  const authorization = req.get("Authorization");
  // 去掉Authorization中的Bearer, 得到token
  jwt.verify(authorization.split(" ")[1], tokenSecret, function (err, decoded) {
    if (err) {
      return res.json({ code: 1, msg: err });
    }
    req.payload = decoded;
    next();
  });
}
module.exports = {
  verifyToken,
};
