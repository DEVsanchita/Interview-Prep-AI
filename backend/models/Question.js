const { Session, Type } = require("@google/genai");
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        Session: {type: mongoose.Schema.Types.ObjectId, ref: "Session"},
        question: String,
        answer: String,
        note: String,
        isPinned: {type: Boolean, default: false},
    }, {timestamps: true}
);

module.exports = mongoose.model("Question", questionSchema);