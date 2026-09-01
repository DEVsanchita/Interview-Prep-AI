const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, trim: true },
    experience: { type: String, required: true },
    topicsToFocus: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    numberOfQuestions: { type: Number, min: 1, max: 30, default: 10 },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
