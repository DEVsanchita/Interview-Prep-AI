import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuBrainCircuit, LuLayoutDashboard } from "react-icons/lu";
import ProfileInfoCard from "../Cards/ProfileInfoCard";

const Navbar = () => {
  const { pathname } = useLocation();
  return <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
      <Link to="/dashboard" className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-orange-400 shadow-sm"><LuBrainCircuit size={19}/></span>
        <div><p className="text-sm font-black tracking-tight text-slate-900">Interview Prep <span className="text-orange-500">AI</span></p><p className="hidden text-[9px] font-semibold text-slate-400 sm:block">Practice smarter. Interview better.</p></div>
      </Link>
      <div className="flex items-center gap-4"><Link to="/dashboard" className={`hidden items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold sm:flex ${pathname === "/dashboard" ? "bg-orange-50 text-orange-600" : "text-slate-500 hover:bg-slate-50"}`}><LuLayoutDashboard/> Dashboard</Link><ProfileInfoCard /></div>
    </div>
  </header>;
};
export default Navbar;
