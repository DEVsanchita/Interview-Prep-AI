import React, { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";

const QuestionCard = ({ question, answer, onLearnMore, isPinned, onTogglePin, index }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => { setHeight(expanded && contentRef.current ? contentRef.current.scrollHeight + 24 : 0); }, [expanded, answer]);
  return <article className={`group mb-4 overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${isPinned ? "border-orange-200" : "border-slate-200"}`}>
    <div className="flex items-start gap-4 p-5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-black text-white">{String(index + 1).padStart(2, "0")}</span>
      <button className="flex-1 text-left" onClick={() => setExpanded(!expanded)}><h3 className="text-sm font-bold leading-6 text-slate-800">{question}</h3></button>
      <div className="flex shrink-0 items-center gap-1">
        <button aria-label={isPinned ? "Unpin question" : "Pin question"} className={`rounded-lg p-2 ${isPinned ? "bg-orange-50 text-orange-600" : "text-slate-300 hover:bg-slate-50 hover:text-slate-600"}`} onClick={onTogglePin}>{isPinned ? <LuPinOff size={16}/> : <LuPin size={16}/>}</button>
        <button onClick={() => { setExpanded(true); onLearnMore(); }} className="hidden items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-[11px] font-bold text-violet-700 hover:bg-violet-100 sm:flex"><LuSparkles/> Explain</button>
        <button onClick={() => setExpanded(!expanded)} className="rounded-lg p-2 text-slate-400"><LuChevronDown size={18} className={`transition ${expanded ? "rotate-180" : ""}`}/></button>
      </div>
    </div>
    <div style={{ maxHeight: height }} className="overflow-hidden transition-[max-height] duration-300"><div ref={contentRef} className="mx-5 mb-5 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"><AIResponsePreview content={answer || "No answer generated for this question."}/></div></div>
  </article>;
};
export default QuestionCard;
