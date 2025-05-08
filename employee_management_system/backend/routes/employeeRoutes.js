const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

// Create employee (only logged-in admin should access)
router.post('/', auth, employeeController.createEmployee);

// Get all employees
router.get('/', auth, employeeController.getEmployees);

// Get employee by ID
router.get('/:id', auth, employeeController.getEmployeeById);

// Update employee
router.put('/:id', auth, employeeController.updateEmployee);

// Delete employee
router.delete('/:id', auth, employeeController.deleteEmployee);

router.get('/dashboard/stats', auth, employeeController.dashboardStats);

module.exports = router;
