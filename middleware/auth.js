const jwt = require("jsonwebtoken");
require('dotenv').config()

authorization = (req, res, next) => {
    if(!req.headers.authorization) {
      return res.status(403).send({
        success: false,
        message: "No token provided!"
      });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).send({
        success: false,
        message: "No token provided!"
      });
    }

    jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      next();
    });
};

const auth = {
  authorization: authorization
};
module.exports = auth;