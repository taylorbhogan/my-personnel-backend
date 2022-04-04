const jwt = require("jsonwebtoken");
const bearerToken = require("express-bearer-token");
const { jwtConfig } = require("./config");
const employeeModel = require("./models/employee");

const { secret, expiresIn } = jwtConfig;

const getUserToken = (user) => {
  const userDataForToken = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(
    { data: userDataForToken },
    secret,
    // env vars stored as strings; strings are interpreted by jwt as milliseconds, not seconds
    { expiresIn: parseInt(expiresIn, 10) }
  );

  return token;
};

const restoreUser = (req, res, next) => {
  const { token } = req;

  if (!token) {
    return res.set("WWW-Authenticate", "Bearer").status(401).end();
  }

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      err.status = 401;
      return next(err);
    }

    const { id } = jwtPayload.data;

    try {
      req.user = await employeeModel.findOne({ _id: id });
    } catch (e) {
      e.status = 401;
      return next(e);
    }

    if (!req.user) {
      return res.set("WWW-Authenticate", "Bearer").status(401).end();
    }

    return next();
  });
};

const requireAuth = [bearerToken(), restoreUser];

module.exports = {
  getUserToken,
  requireAuth,
};
