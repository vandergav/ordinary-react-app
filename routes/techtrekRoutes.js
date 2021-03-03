const express = require('express');
const router = express.Router();

const { verifyAccessToken } = require('../helpers/jwtHelpers');

const {
  accountsView,
  transactionView,
  transactionAdd,
  users,
} = require('../controllers/techtrekControllers');

router.post('/accounts/view', verifyAccessToken, accountsView);
router.post('/transaction/view', verifyAccessToken, transactionView);
router.post('/transaction/add', verifyAccessToken, transactionAdd);
router.post('/users', verifyAccessToken, users);

module.exports = router;
