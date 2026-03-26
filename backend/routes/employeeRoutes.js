const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// All employee routes require a valid JWT
router.get('/', auth, employeeController.getEmployees);
router.post('/', auth, employeeController.addEmployee);
router.put('/:id', auth, employeeController.updateEmployee);
router.delete('/:id', auth, employeeController.deleteEmployee);

module.exports = router;
