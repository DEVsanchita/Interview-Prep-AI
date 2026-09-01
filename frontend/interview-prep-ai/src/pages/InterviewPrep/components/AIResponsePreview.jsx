import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LuCheck, LuCode, LuCopy } from "react-icons/lu";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";

const AIResponsePreview = ({ content }) => (
  <div className="prose prose-slate max-w-none text-xs leading-6">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        if (!inline && match) return <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} />;
        return <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]" {...props}>{children}</code>;
      },
      p: ({ children }) => <p className="mb-3 leading-6">{children}</p>,
      ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-5">{children}</ul>,
      ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-5">{children}</ol>,
      blockquote: ({ children }) => <blockquote className="my-3 border-l-4 border-orange-300 pl-4 italic text-slate-500">{children}</blockquote>,
      h2: ({ children }) => <h2 className="mb-2 mt-5 text-base font-black text-slate-900">{children}</h2>,
      h3: ({ children }) => <h3 className="mb-2 mt-4 text-sm font-black text-slate-900">{children}</h3>,
      a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">{children}</a>,
      table: ({ children }) => <div className="my-4 overflow-x-auto"><table className="min-w-full border border-slate-200">{children}</table></div>,
      th: ({ children }) => <th className="border border-slate-200 bg-slate-100 px-3 py-2 text-left text-[10px] font-bold">{children}</th>,
      td: ({ children }) => <td className="border border-slate-200 px-3 py-2 text-[11px]">{children}</td>,
    }}>{content || ""}</ReactMarkdown>
  </div>
);

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (error) { console.error("Copy failed", error); } };
  return <div className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2"><span className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500"><LuCode size={13}/> {language}</span><button onClick={copy} className="text-slate-400 hover:text-slate-700">{copied ? <LuCheck size={14}/> : <LuCopy size={14}/>}</button></div><SyntaxHighlighterComponent language={language} style={oneLight} customStyle={{ margin: 0, fontSize: 12, background: "#fff", padding: "14px" }}>{code}</SyntaxHighlighterComponent></div>;
}
export default AIResponsePreview;
