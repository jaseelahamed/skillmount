const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/employees', protect, employeeController.getDashboard);
router.get('/employees/:id', protect, employeeController.getEmployee);
router.post('/employees', protect, employeeController.addEmployee);
router.put('/employees/:id', protect, employeeController.updateEmployee);
router.delete('/employees/:id', protect, employeeController.deleteEmployee);

module.exports = router;
