// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Create employee
router.post('/employees', employeeController.createEmployee);

// Get all employees
router.get('/employees', employeeController.getEmployees);

// Get employee by ID
router.get('/employees/:id', employeeController.getEmployeeById);

// Update employee
router.put('/employees/:id', employeeController.updateEmployee);

// Delete employee
router.delete('/employees/:id', employeeController.deleteEmployee);

// Dashboard stats
router.get('/dashboard/stats', employeeController.dashboardStats);

module.exports = router;
