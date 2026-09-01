import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LuArrowLeft, LuCircleAlert, LuListPlus, LuPin, LuSearch, LuSparkles } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import QuestionCard from "../../components/Cards/QuestionCard";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import RoleInfoHeader from "./components/RoleInfoHeader";
import AIResponsePreview from "./components/AIResponsePreview";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [search, setSearch] = useState("");
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSession = async () => {
    try { setLoading(true); const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId)); setSessionData(data.session); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to load interview"); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (sessionId) fetchSession(); }, [sessionId]);

  const questions = useMemo(() => (sessionData?.questions || []).filter((q) => `${q.question} ${q.answer}`.toLowerCase().includes(search.toLowerCase()) && (!onlyPinned || q.isPinned)), [sessionData, search, onlyPinned]);
  const pinned = sessionData?.questions?.filter((q) => q.isPinned).length || 0;

  const explain = async (question) => {
    try { setDrawerOpen(true); setAiLoading(true); setExplanation(null); setErrorMsg(""); const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question }); setExplanation(data); }
    catch (error) { setErrorMsg(error.response?.data?.message || "Failed to generate explanation. Try again."); }
    finally { setAiLoading(false); }
  };

  const togglePin = async (id) => {
    try { await axiosInstance.post(API_PATHS.QUESTION.PIN(id)); setSessionData((prev) => ({ ...prev, questions: prev.questions.map((q) => q._id === id ? { ...q, isPinned: !q.isPinned } : q) })); }
    catch { toast.error("Could not update pin"); }
  };

  const loadMore = async () => {
    try {
      setMoreLoading(true);
      const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, { role: sessionData.role, experience: sessionData.experience, topicsToFocus: sessionData.topicsToFocus, numberOfQuestions: 5 });
      await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, { sessionId, questions: data });
      toast.success("5 new questions added"); fetchSession();
    } catch (error) { toast.error(error.response?.data?.message || "Unable to add questions"); }
    finally { setMoreLoading(false); }
  };

  if (loading) return <DashboardLayout><div className="mx-auto max-w-7xl p-8"><div className="h-48 animate-pulse rounded-3xl bg-slate-200"/><div className="mt-6 h-24 animate-pulse rounded-2xl bg-slate-100"/></div></DashboardLayout>;

  return <DashboardLayout>
    <RoleInfoHeader role={sessionData?.role} topicsToFocus={sessionData?.topicsToFocus} experience={sessionData?.experience} questions={sessionData?.questions?.length} description={sessionData?.description} difficulty={sessionData?.difficulty} lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).fromNow() : "—"}/>
    <main className="min-h-[calc(100vh-280px)] bg-[#faf9f7]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-orange-600"><LuSparkles/></div><div><p className="text-xs font-black text-slate-900">Practice mode</p><p className="text-[10px] text-slate-400">{pinned} pinned · {sessionData?.questions?.length || 0} total</p></div></div>
          <div className="flex gap-2"><div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><LuSearch className="text-slate-400" size={15}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions" className="w-full bg-transparent text-xs outline-none md:w-48"/></div><button onClick={() => setOnlyPinned(!onlyPinned)} className={`rounded-xl px-3 py-2 text-xs font-bold ${onlyPinned ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600"}`}><LuPin className="inline mr-1"/> Pinned</button></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section><AnimatePresence mode="popLayout">{questions.map((q, index) => <div key={q._id}><QuestionCard index={index} question={q.question} answer={q.answer} isPinned={q.isPinned} onTogglePin={() => togglePin(q._id)} onLearnMore={() => explain(q.question)}/></div>)}</AnimatePresence>
            {!questions.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><LuSearch className="mx-auto text-slate-300" size={30}/><p className="mt-3 text-sm font-bold text-slate-700">No questions found</p><p className="mt-1 text-xs text-slate-400">Try a different search or clear the pinned filter.</p></div>}
            <button disabled={moreLoading} onClick={loadMore} className="mx-auto mt-3 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-orange-500 disabled:opacity-60">{moreLoading ? <SpinnerLoader/> : <LuListPlus/>} {moreLoading ? "Generating..." : "Load 5 more questions"}</button>
          </section>
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black text-slate-900">Interview checklist</p><div className="mt-4 space-y-3">{["Explain your approach before coding", "Mention trade-offs and edge cases", "Use the AI explanation when stuck", "Pin topics you need to revisit"].map((item) => <div key={item} className="flex gap-2 text-xs leading-5 text-slate-500"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400"/>{item}</div>)}</div><button onClick={() => navigate("/dashboard")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"><LuArrowLeft/> Back to dashboard</button></div></aside>
        </div>
      </div>
    </main>
    <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={!aiLoading && explanation?.title}>{errorMsg && <p className="flex gap-2 text-sm text-red-500"><LuCircleAlert/>{errorMsg}</p>}{aiLoading && <SkeletonLoader/>}{!aiLoading && explanation && <AIResponsePreview content={explanation.explanation}/>}</Drawer>
  </DashboardLayout>;
};
export default InterviewPrep;
