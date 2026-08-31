const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.postLogin);
router.post('/refresh', authController.postRefresh);
router.post('/logout', authController.logout);

module.exports = router;
