import React from "react";
import { LuArrowUpRight, LuClock3, LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({ colors, role, topicsToFocus, experience, questions, description, lastUpdated, difficulty = "Medium", onSelect, onDelete }) => (
  <article onClick={onSelect} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="rounded-[14px] p-5" style={{ background: colors?.bgcolor || "#fff7ed" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/90 text-base font-extrabold text-slate-900 shadow-sm">{getInitials(role)}</div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{role}</h2>
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-600">{topicsToFocus}</p>
          </div>
        </div>
        <LuArrowUpRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-slate-700">{difficulty}</span>
        <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-slate-700">{questions} Q&A</span>
        <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-slate-700">{experience} yr{Number(experience) === 1 ? "" : "s"}</span>
      </div>
    </div>
    <div className="px-4 pb-4 pt-3">
      <p className="line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{description || "Personalized interview preparation session."}</p>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400"><LuClock3 /> Updated {lastUpdated || "recently"}</span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500" aria-label="Delete session"><LuTrash2 size={16} /></button>
      </div>
    </div>
  </article>
);
export default SummaryCard;
