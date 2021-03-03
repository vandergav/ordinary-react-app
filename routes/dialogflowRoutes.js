const express = require('express');
const router = express.Router();

const { verifyAccessToken } = require('../helpers/jwtHelpers');

const { textQuery } = require('../controllers/dialogflowControllers');

router.post('/df_text_query', verifyAccessToken, textQuery);

module.exports = router;
