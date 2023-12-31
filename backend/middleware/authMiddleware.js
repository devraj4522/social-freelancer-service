const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send(`Unauthorized`);
    }

    const { userId, isSeller } = jwt.verify(req.headers.authorization, process.env.jwtSecret);
    req.userId = userId;
    req.isSeller = isSeller;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send(`Unauthorized`);
  }
};
