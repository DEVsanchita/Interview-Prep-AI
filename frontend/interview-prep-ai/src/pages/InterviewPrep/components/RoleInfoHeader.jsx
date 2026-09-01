import React from "react";
import { LuBriefcaseBusiness, LuCircleDot, LuClock3, LuLayers3 } from "react-icons/lu";

const RoleInfoHeader = ({ role, topicsToFocus, experience, questions, description, lastUpdated, difficulty }) => (
  <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
    <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,.22),transparent_55%)]"/>
    <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-200"><LuBriefcaseBusiness/> Interview session</div><h1 className="text-3xl font-black tracking-tight md:text-4xl">{role || "Interview Prep"}</h1><p className="mt-2 text-sm text-slate-300">{topicsToFocus || "Personalized practice"}</p>{description && <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-400">{description}</p>}</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[ [LuLayers3, `${questions || 0}`, "Questions"], [LuCircleDot, difficulty || "Medium", "Difficulty"], [LuClock3, `${experience || 0} yr`, "Experience"], [LuClock3, lastUpdated || "—", "Updated"] ].map(([Icon,value,label]) => <div key={label} className="min-w-[90px] rounded-xl border border-white/10 bg-white/5 p-3">{React.createElement(Icon, { size: 14, className: "text-orange-300" })}<p className="mt-2 text-xs font-bold">{value}</p><p className="text-[9px] text-slate-400">{label}</p></div>)}
        </div>
      </div>
    </div>
  </section>
);
export default RoleInfoHeader;
