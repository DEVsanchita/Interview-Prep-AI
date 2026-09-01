import React, { useEffect, useMemo, useState } from "react";
import { LuBrainCircuit, LuHistory, LuPlus, LuSearch, LuTarget, LuTrophy } from "react-icons/lu";
import toast from "react-hot-toast";
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SummaryCard from "../../components/Cards/SummaryCard";
import Modal from "../../components/Modal";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import CreateSessionForm from "./CreateSessionForm";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CARD_BG } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try { setLoading(true); const { data } = await axiosInstance.get(API_PATHS.SESSION.GET_ALL); setSessions(Array.isArray(data) ? data : []); }
    catch (error) { toast.error(error.response?.data?.message || "Unable to load sessions"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchSessions(); }, []);

  const filteredSessions = useMemo(() => sessions.filter((s) => {
    const text = `${s.role} ${s.topicsToFocus} ${s.description}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (difficulty === "All" || s.difficulty === difficulty);
  }), [sessions, query, difficulty]);

  const totalQuestions = sessions.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
  const recent = sessions[0]?.updatedAt ? moment(sessions[0].updatedAt).fromNow() : "No sessions yet";

  const deleteSession = async () => {
    try { await axiosInstance.delete(API_PATHS.SESSION.DELETE(deleteData._id)); toast.success("Session deleted"); setDeleteData(null); fetchSessions(); }
    catch (error) { toast.error(error.response?.data?.message || "Failed to delete session"); }
  };

  return <DashboardLayout>
    <main className="min-h-[calc(100vh-64px)] bg-[#faf9f7]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-60 w-60 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Your interview command center</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Ready to level up, {user?.name?.split(" ")[0] || "there"}?</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Create focused AI interview sessions, revisit your weak areas, and turn every practice round into measurable progress.</p>
            </div>
            <button onClick={() => setOpenCreateModal(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-400"><LuPlus /> New Interview</button>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [LuHistory, "Sessions", sessions.length, "practice rounds"],
            [LuBrainCircuit, "Questions", totalQuestions, "AI-generated"],
            [LuTarget, "Focus", sessions.length ? `${Math.round(totalQuestions / sessions.length)}` : "0", "questions / session"],
            [LuTrophy, "Recent", recent, "latest activity"],
          ].map(([Icon, label, value, caption]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{React.createElement(Icon, { className: "text-orange-500", size: 19 })}<p className="mt-3 text-xl font-black text-slate-900">{value}</p><p className="text-xs font-bold text-slate-700">{label}</p><p className="mt-0.5 text-[10px] text-slate-400">{caption}</p></div>)}
        </section>

        <section className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-xl font-black text-slate-900">Your interview sessions</h2><p className="mt-1 text-xs text-slate-500">Search, filter, and jump back into practice.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"><LuSearch className="text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role or topic..." className="w-full bg-transparent text-xs outline-none sm:w-48"/></div>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none"><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
          </div>
        </section>

        {loading ? <div className="mt-5 grid gap-5 md:grid-cols-3">{[1,2,3].map((n) => <div key={n} className="h-52 animate-pulse rounded-2xl bg-white border border-slate-100" />)}</div> : filteredSessions.length ? <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredSessions.map((data, index) => <SummaryCard key={data._id} colors={CARD_BG[index % CARD_BG.length]} role={data.role} topicsToFocus={data.topicsToFocus} experience={data.experience} questions={data.questions?.length || 0} description={data.description} difficulty={data.difficulty} lastUpdated={moment(data.updatedAt).fromNow()} onSelect={() => window.location.assign(`/interview-prep/${data._id}`)} onDelete={() => setDeleteData(data)} />)}</div> : <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><LuBrainCircuit className="mx-auto text-orange-400" size={32}/><h3 className="mt-3 font-bold text-slate-900">No matching sessions</h3><p className="mt-1 text-xs text-slate-500">Create a new interview session to start practicing.</p></div>}
      </div>
    </main>

    <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader><CreateSessionForm onCreated={() => { setOpenCreateModal(false); fetchSessions(); }} /></Modal>
    <Modal isOpen={!!deleteData} onClose={() => setDeleteData(null)} title="Delete interview?"><DeleteAlertContent content="This will permanently delete the session and its questions." onDelete={deleteSession} /></Modal>
  </DashboardLayout>;
};
export default Dashboard;
