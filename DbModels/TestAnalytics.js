const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  marksScored: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  totalTimeTaken: {
    type: Number, //  in minutes
    required: true
  },
  totalTimeAllocated: {
    type: Number, 
    required: true
  },
  numQuestionsAttempted: {
    type: Number,
    required: true
  },
  unattemptedQuestions: {
    type: Number,
    required: true
  },
  incorrectAttempts: {
    type: Number,
    required: true
  },
  correctAttempts: {
    type: Number,
    required: true
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
