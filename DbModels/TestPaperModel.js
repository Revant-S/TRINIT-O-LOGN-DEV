const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [{ type: String, required: true }],
  correctAnswer: {
    type: Number,
    required: true,
  },
  image: String,
});

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  access: {
    type: String,
    enum: ["Private", "Public"],
    default: "Private",
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  testTime: {
    type: Number,
    required: true,
  },
  comments: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
      },
    ],
    default: "",
  },
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
