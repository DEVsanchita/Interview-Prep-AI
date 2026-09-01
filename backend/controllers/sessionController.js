const Session = require("../models/Session");
const Question = require("../models/Question");

exports.createSession = async (req, res) => {
  try {
    const {
      role,
      experience,
      topicsToFocus,
      description = "",
      difficulty = "Medium",
      numberOfQuestions = 10,
      questions = [],
    } = req.body;

    if (!role?.trim() || experience === undefined || !topicsToFocus?.trim()) {
      return res.status(400).json({ success: false, message: "Role, experience and topics are required" });
    }

    const session = await Session.create({
      user: req.user._id,
      role: role.trim(),
      experience: String(experience),
      topicsToFocus: topicsToFocus.trim(),
      description: description.trim(),
      difficulty,
      numberOfQuestions: Number(numberOfQuestions) || questions.length || 10,
    });

    const validQuestions = Array.isArray(questions) ? questions.filter((q) => q?.question) : [];
    if (validQuestions.length) {
      const questionDocs = await Question.insertMany(
        validQuestions.map((q) => ({
          session: session._id,
          question: q.question,
          answer: q.answer || "",
        }))
      );
      session.questions = questionDocs.map((q) => q._id);
      await session.save();
    }

    const populated = await Session.findById(session._id).populate("questions");
    res.status(201).json({ success: true, session: populated });
  } catch (error) {
    console.error("createSession:", error);
    res.status(500).json({ success: false, message: "Unable to create interview session" });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions");
    res.status(200).json(sessions);
  } catch (error) {
    console.error("getMySessions:", error);
    res.status(500).json({ success: false, message: "Unable to load interview sessions" });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id }).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) return res.status(404).json({ success: false, message: "Interview session not found" });
    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("getSessionById:", error);
    res.status(500).json({ success: false, message: "Unable to load interview session" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: "Interview session not found" });

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();
    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("deleteSession:", error);
    res.status(500).json({ success: false, message: "Unable to delete session" });
  }
};
