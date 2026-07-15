import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body text-xs text-slate-300 leading-relaxed prose prose-sm prose-invert max-w-full min-w-0 break-words whitespace-normal overflow-hidden ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-white mt-5 mb-2 first:mt-0 font-display">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-white mt-4 mb-2 first:mt-0 font-display">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold text-white mt-3.5 mb-1.5 first:mt-0 font-display uppercase tracking-wider">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-slate-200 mt-3 mb-1 first:mt-0 uppercase font-mono">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 text-slate-300 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-4 space-y-1.5 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-0.5 text-slate-300">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-blue-400">
              {children}
            </strong>
          ),
          code: ({ children, className }) => {
            const isInline = !className || !className.includes("language-");
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-pink-400 font-medium">
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 my-3 overflow-x-auto rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 leading-normal">
                <code>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-blue-500 bg-blue-950/10 px-3 py-2 rounded-r-md my-3 text-slate-400 italic text-[11px]">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-slate-800/80 rounded-xl bg-slate-950/20 shadow-sm">
              <table className="w-full text-left text-[11px] border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-950 text-[10px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-800/80">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-900/60">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-900/30 transition-colors odd:bg-slate-950/10">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="p-3 font-semibold text-slate-300 font-mono">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 text-slate-300 leading-relaxed">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
