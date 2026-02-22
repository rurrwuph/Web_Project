const express = require('express');
const router = express.Router();

const { assistUser, clearHistory } = require('../controllers/chatbotController');
const { verifCustomer } = require('../middleware/authMiddleware');

router.post('/assist', verifCustomer, assistUser);
router.delete('/history', verifCustomer, clearHistory);

module.exports = router;
