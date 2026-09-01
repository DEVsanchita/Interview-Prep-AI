const Question = require("../models/Question");
const Session = require("../models/Session");

const ownsQuestion = async (questionId, userId) => {
  return Question.findOne({ _id: questionId }).populate({
    path: "session",
    match: { user: userId },
  });
};

exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;
    if (!sessionId || !Array.isArray(questions) || !questions.length) {
      return res.status(400).json({ success: false, message: "A session and at least one question are required" });
    }

    const session = await Session.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    const createdQuestions = await Question.insertMany(
      questions.filter((q) => q?.question).map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();
    res.status(201).json(createdQuestions);
  } catch (error) {
    console.error("addQuestionsToSession:", error);
    res.status(500).json({ success: false, message: "Unable to add questions" });
  }
};

exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await ownsQuestion(req.params.id, req.user._id);
    if (!question || !question.session) return res.status(404).json({ success: false, message: "Question not found" });

    question.isPinned = !question.isPinned;
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("togglePinQuestion:", error);
    res.status(500).json({ success: false, message: "Unable to update question" });
  }
};

exports.updateQuestionNote = async (req, res) => {
  try {
    const { note = "" } = req.body;
    const question = await ownsQuestion(req.params.id, req.user._id);
    if (!question || !question.session) return res.status(404).json({ success: false, message: "Question not found" });

    question.note = String(note).slice(0, 2000);
    await question.save();
    res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("updateQuestionNote:", error);
    res.status(500).json({ success: false, message: "Unable to save note" });
  }
};
