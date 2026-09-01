import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuBrainCircuit, LuCircleCheckBig, LuSparkles, LuTarget, LuTrendingUp, LuZap } from "react-icons/lu";
import HERO_IMG from "../assets/banner.png";
import APP_FEATURES from "../utils/data";
import Modal from "../components/Modal";
import Login from "../pages/Auth/login";
import SignUp from "../pages/Auth/SignUp";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import { UserContext } from "../context/userContext";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const handleCTA = () => user ? navigate("/dashboard") : setOpenAuthModal(true);

  return <div className="min-h-screen overflow-hidden bg-[#faf9f7] text-slate-900">
    <div className="absolute left-[-160px] top-[-180px] h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-4 pb-16 md:px-8">
      <header className="flex items-center justify-between py-6"><div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-orange-400"><LuBrainCircuit/></span><div><p className="font-black">Interview Prep <span className="text-orange-500">AI</span></p><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Your interview copilot</p></div></div>{user ? <ProfileInfoCard/> : <button onClick={() => setOpenAuthModal(true)} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold shadow-sm hover:border-orange-300">Login / Sign Up</button>}</header>
      <section className="grid items-center gap-10 pb-12 pt-10 md:grid-cols-2 md:pt-16">
        <div><div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700"><LuSparkles/> AI-powered preparation</div><h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-0.04em] md:text-7xl">Turn practice into <span className="text-orange-500">confidence.</span></h1><p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 md:text-base">Generate role-specific interview questions, master concepts with AI explanations, and build a preparation library you can return to before every interview.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={handleCTA} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-orange-500">Start practicing <LuArrowRight/></button><a href="#features" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700">Explore features</a></div><div className="mt-8 flex flex-wrap gap-5 text-[11px] font-semibold text-slate-500">{["Personalized questions","AI concept explanations","Saved progress"].map((x) => <span key={x} className="flex items-center gap-1.5"><LuCircleCheckBig className="text-orange-500"/>{x}</span>)}</div></div>
        <div className="relative"><div className="absolute inset-4 rounded-[2rem] bg-orange-200/30 blur-2xl"/><img src={HERO_IMG} alt="Interview Prep dashboard preview" className="relative w-full rounded-[1.75rem] border border-white shadow-2xl"/></div>
      </section>
    </div>
    <section id="features" className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-16 md:px-8"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-black uppercase tracking-[.2em] text-orange-500">Built for focused practice</p><h2 className="mt-2 text-3xl font-black tracking-tight">Everything you need before interview day.</h2><p className="mt-3 text-sm leading-6 text-slate-500">A simple workflow that keeps preparation structured instead of overwhelming.</p></div><div className="mt-10 grid gap-4 md:grid-cols-3">{APP_FEATURES.slice(0, 3).map((feature, i) => { const Icon = [LuTarget, LuZap, LuTrendingUp][i]; return <div key={feature.title} className="group rounded-2xl border border-slate-200 bg-[#faf9f7] p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600"><Icon/></span><h3 className="mt-5 font-black">{feature.title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{feature.description}</p></div>})}</div></div></section>
    <section className="bg-slate-950 text-white"><div className="mx-auto max-w-7xl px-4 py-14 text-center md:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-orange-300">Ready when you are</p><h2 className="mt-3 text-3xl font-black">Your next interview deserves better practice.</h2><button onClick={handleCTA} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold hover:bg-orange-400">Create your first session <LuArrowRight/></button></div></section>
    <footer className="bg-white py-6 text-center text-[10px] font-semibold text-slate-400">Made with ❤️ for better interview preparation · Interview Prep AI</footer>
    <Modal isOpen={openAuthModal} onClose={() => { setOpenAuthModal(false); setCurrentPage("login"); }} hideHeader>{currentPage === "login" ? <Login setCurrentPage={setCurrentPage}/> : <SignUp setCurrentPage={setCurrentPage}/>}</Modal>
  </div>;
};
export default LandingPage;
