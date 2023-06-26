const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;

const auth = (req, res, next) => {
  const token = req.header("Authentication") || req.query.token || req.body.token;
  if (!token) {
    return res.status(401).json({ 
      msg: "No token, authorization denied" 
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_TOKEN);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(400).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;