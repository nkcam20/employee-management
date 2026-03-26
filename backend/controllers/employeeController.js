const Employee = require('../models/Employee');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ employees });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { fname, lname, email, dept, position, role, status, salary } = req.body;
    if (!fname || !lname || !email || !dept || !position)
      return res.status(400).json({ message: 'Missing required fields.' });

    const employee = await Employee.create({ fname, lname, email, dept, position, role, status, salary });
    res.status(201).json({ message: 'Employee added.', employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { fname, lname, email, dept, position, role, status, salary } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { fname, lname, email, dept, position, role, status, salary },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });
    res.json({ message: 'Employee updated.', employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
