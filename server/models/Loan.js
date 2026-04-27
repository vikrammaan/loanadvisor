const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  name: String,
  email: String,
  income: Number,
  employmentStatus: String,
  requestedAmount: Number,
  purpose: String,
  isEligible: Boolean,
  approvedAmount: Number,
  interestRate: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Loan', loanSchema);
