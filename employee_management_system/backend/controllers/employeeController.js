const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const newEmployee = await Employee.create({ name, email, role });
    res.status(201).json({ message: 'Employee created successfully.', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Error creating employee.' });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employees.' });
  }
};

// Get an employee by ID
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employee.' });
  }
};

// Update an employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    await employee.save();
    res.status(200).json({ message: 'Employee updated successfully.', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating employee.' });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    await employee.destroy();
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting employee.' });
  }
};