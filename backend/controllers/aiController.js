const { GoogleGenAI } = require("@google/genai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");

const getAI = () => {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey: key });
};

const parseJson = (text) => {
  const cleaned = String(text || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions = 10 } = req.body;
    if (!role || experience === undefined || !topicsToFocus) {
      return res.status(400).json({ message: "Role, experience and topics are required" });
    }

    const count = Math.min(Math.max(Number(numberOfQuestions) || 10, 1), 20);
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: questionAnswerPrompt(role, experience, topicsToFocus, count),
    });
    const data = parseJson(response.text);
    if (!Array.isArray(data)) throw new Error("AI returned an invalid question list");
    res.status(200).json(data.slice(0, count));
  } catch (error) {
    console.error("generateInterviewQuestions:", error);
    res.status(500).json({ message: "Failed to generate questions", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: "Question is required" });

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      contents: conceptExplainPrompt(question),
    });
    res.status(200).json(parseJson(response.text));
  } catch (error) {
    console.error("generateConceptExplanation:", error);
    res.status(500).json({ message: "Failed to generate explanation", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
