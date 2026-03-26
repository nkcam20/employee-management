const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fname:    { type: String, required: true },
  lname:    { type: String, required: true },
  email:    { type: String, required: true },
  dept:     { type: String, required: true },
  position: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'user'], default: 'user' },
  status:   { type: String, enum: ['active', 'inactive'], default: 'active' },
  salary:   { type: Number, default: 0 },
  joined:   { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
