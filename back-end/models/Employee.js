const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    min: [1, 'Salary must be greater than 0']
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);