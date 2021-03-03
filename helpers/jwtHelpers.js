const jwt = require('jsonwebtoken');
const createError = require('http-errors');

let refreshTokens = [];

// Function returning promise
exports.signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' },
      (err, token) => {
        if (err) {
          return reject(createError.InternalServerError());
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return resolve({ token, exp: decoded.exp });
      }
    );
  });
};

// Function returning promise
exports.signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1y' },
      (err, token) => {
        if (err) {
          return reject(createError.InternalServerError());
        }
        refreshTokens.push(token);
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return resolve({ token, exp: decoded.exp });
      }
    );
  });
};

// Middleware
exports.verifyAccessToken = (req, res, next) => {
  if (!req.headers['authorization']) return next(createError.Unauthorized());
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === 'TokenExpiredError' ? 'Unauthorized' : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

// Function returning promise
exports.verifyRefreshToken = (refreshToken) => {
  console.log('current refreshToken: ' + refreshToken);
  console.log('refreshTokens: ' + refreshTokens);
  // Exists in array?
  if (!refreshToken || !refreshTokens.includes(refreshToken))
    throw createError.Unauthorized();
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createError.InternalServerError());
        return resolve(payload.userId);
      }
    );
  });
};

// Controller
exports.refreshTokens = async (req, res) => {
  try {
    // let self = module.exports;
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    // const userId = await this.verifyRefreshToken(refreshToken);
    const userId = await this.verifyRefreshToken(refreshToken);
    const accessTokenData = await this.signAccessToken(userId);
    const refreshTokenData = await this.signRefreshToken(userId);
    res.send({ accessTokenData, refreshTokenData });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// Controller
exports.deleteRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter((token) => token != refreshToken);
    res.sendStatus(204);
  } catch {
    console.log(error);
    res.send(error);
  }
};
