import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuTarget } from "react-icons/lu";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
    difficulty: "Medium",
    numberOfQuestions: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus, numberOfQuestions } = formData;
    if (!role.trim() || experience === "" || !topicsToFocus.trim()) {
      setError("Please complete the required fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: role.trim(),
        experience,
        topicsToFocus: topicsToFocus.trim(),
        numberOfQuestions: Number(numberOfQuestions),
      });
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        numberOfQuestions: Number(numberOfQuestions),
        questions: aiResponse.data,
      });
      if (response.data?.session?._id) {
        onCreated?.();
        navigate(`/interview-prep/${response.data.session._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create the interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[92vw] max-w-xl p-7 md:p-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-100">
          <LuSparkles /> AI Interview Builder
        </div>
        <h3 className="mt-3 text-2xl font-bold text-slate-900">Build your interview</h3>
        <p className="mt-1 text-sm text-slate-500">Tell us your target role and we'll create a focused practice set.</p>
      </div>

      <form onSubmit={handleCreateSession} className="space-y-1">
        <Input value={formData.role} onChange={({ target }) => handleChange("role", target.value)} label="Target Role *" placeholder="e.g. Software Engineer" type="text" />
        <Input value={formData.experience} onChange={({ target }) => handleChange("experience", target.value)} label="Experience (years) *" placeholder="e.g. 0, 1, 2" type="number" />
        <Input value={formData.topicsToFocus} onChange={({ target }) => handleChange("topicsToFocus", target.value)} label="Topics *" placeholder="e.g. React, JavaScript, DSA, SQL" type="text" />
        <Input value={formData.description} onChange={({ target }) => handleChange("description", target.value)} label="Goal / Notes" placeholder="What do you want to improve?" type="text" />

        <div className="grid grid-cols-2 gap-3 pt-2">
          <label className="text-sm font-semibold text-slate-700">Difficulty
            <select value={formData.difficulty} onChange={(e) => handleChange("difficulty", e.target.value)} className="input-box mt-2 w-full cursor-pointer bg-white">
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">Questions
            <select value={formData.numberOfQuestions} onChange={(e) => handleChange("numberOfQuestions", Number(e.target.value))} className="input-box mt-2 w-full cursor-pointer bg-white">
              {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 flex gap-3">
          <LuTarget className="mt-0.5 text-orange-500" />
          <p className="text-xs leading-5 text-slate-500">Tip: choose 2–4 focused topics. Narrower sessions produce more useful AI questions.</p>
        </div>

        {error && <p className="pt-2 text-sm font-medium text-red-500">{error}</p>}
        <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
          {isLoading ? <><SpinnerLoader /> Generating your interview...</> : <><LuSparkles /> Create Interview</>}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
