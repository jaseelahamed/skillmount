const Employee = require('../models/Employee');

exports.getDashboard = async (req, res) => {
  try {
    const role = req.user.role;
const { search } = req.query;
    if (role === 'admin') {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      const employees = await Employee.find(query).sort({ createdAt: -1 });
      res.json({
        success: true,
        role: 'admin',
        employees: employees
      });
    } else if (role === 'employee') {
      const employee = await Employee.findById(req.user.id);
      res.json({
        success: true,
        role: 'employee',
        employees: employee ? [employee] : []
      });
    } else {
      res.status(403).json({ success: false, error: 'Access denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to retrieve employee data' });
  }
};

exports.addEmployee = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized action' });
  }

  const { name, username, password, email, department, role, mobile,salary } = req.body;

  try {
    const existingEmployee = await Employee.findOne({ username });
    if (existingEmployee) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    const newEmployee = new Employee({
      name,
      username,
      password,
      email,
      department,
      role,
      mobile,
      salary
    });

    await newEmployee.save();
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: newEmployee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add employee' });
  }
};

exports.deleteEmployee = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized action' });
  }

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete employee' });
  }
};

exports.updateEmployee = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized action' });
  }

  const { name, username, password, email, department, role, mobile,salary } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    if (username && username !== employee.username) {
      const existingEmployee = await Employee.findOne({ username });
      if (existingEmployee) {
        return res.status(400).json({ success: false, error: 'Username already exists' });
      }
      employee.username = username;
    }

    if (name) employee.name = name;
    if (password) employee.password = password;
    if (email) employee.email = email;
    if (department) employee.department = department;
    if (role) employee.role = role;
    if (mobile) employee.mobile = mobile;
    if (salary !== undefined) employee.salary = salary;

    await employee.save();

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update employee' });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.json({ success: true, employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to retrieve employee' });
  }
};

