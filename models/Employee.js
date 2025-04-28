const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ['patron', 'calisan', 'misafir'],
    default: 'misafir',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Geçerli bir email giriniz'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: [isStrongPassword, 'Şifre güçlü olmalı'],
  },
  salary: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 0 },
  advanceBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
