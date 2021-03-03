const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authControllers');
const {
  refreshTokens,
  verifyAccessToken,
  deleteRefreshToken,
} = require('../helpers/jwtHelpers');

router.post('/login', login);
router.post('/refresh-tokens', verifyAccessToken, refreshTokens);
router.post('/delete-refresh-token', verifyAccessToken, deleteRefreshToken);

module.exports = router;
