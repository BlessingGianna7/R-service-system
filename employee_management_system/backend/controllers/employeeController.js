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


exports.getEmployees = async (req, res) => {
  try {
    // Parse query params
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Fetch with count
    const { count, rows } = await Employee.findAndCountAll({
      limit,
      offset,
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      employees: rows
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
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

// Dashboard stats
exports.dashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();
    // If you have a status field, you can count active employees. For now, count all as active.
    const activeEmployees = totalEmployees; // Adjust if you add a status field
    // Recently added employees (last 5 by id)
    const recentlyAdded = await Employee.findAll({
      order: [['id', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json({
      totalEmployees,
      activeEmployees,
      recentlyAdded
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats.' });
  }
};