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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: [{
    type: { type: String }, // e.g., 'aadhaar', 'salary_slip'
    data: String // Base64 data
  }],
  fraudScore: {
    type: Number,
    default: 0
  },
  fraudFlags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Loan', loanSchema);
