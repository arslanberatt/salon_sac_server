const mongoose = require('mongoose');

const SalaryRecordSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  type: {
    type: String,
    enum: ['maas', 'prim', 'avans'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: true, // normalde patron işlemleri direkt approved olur, çalışan avans isteyince false olabilir
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SalaryRecord', SalaryRecordSchema);
