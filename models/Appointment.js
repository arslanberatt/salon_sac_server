const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['bekliyor', 'tamamlandi', 'iptal'],
    default: 'bekliyor',
  },
  totalPrice: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
