import { motion } from "framer-motion";
import { User, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({ message, isUser, isError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold border ${
            isUser
              ? "bg-white/[0.07] border-white/10 text-white"
              : isError
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          {isUser ? <User size={13} /> : isError ? <AlertCircle size={13} /> : <Sparkles size={13} />}
        </div>
      </div>

      {/* Bubble */}
      <div className={`flex flex-col min-w-0 max-w-[82%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-white text-black font-medium rounded-tr-sm"
              : isError
              ? "bg-red-950/30 text-red-300 border border-red-500/15 rounded-tl-sm"
              : "bg-[#18181b] border border-white/[0.07] text-zinc-200 rounded-tl-sm"
          }`}
        >
          <div className="markdown-content">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p {...props} className="mb-3 last:mb-0 leading-relaxed" />,
                  ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-5 mb-3 space-y-1.5" />,
                  ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-5 mb-3 space-y-1.5" />,
                  li: ({ node, ...props }) => <li {...props} className="text-zinc-300 text-sm" />,
                  strong: ({ node, ...props }) => <strong {...props} className="text-white font-semibold" />,
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code {...props} className="bg-white/5 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono" />
                    ) : (
                      <code {...props} className="block bg-black/40 text-emerald-300 p-3 rounded-lg text-xs font-mono my-2 overflow-x-auto" />
                    ),
                  table: ({ node, ...props }) => (
                    <div className="block w-full overflow-x-auto hide-scrollbar my-4 rounded-xl border border-white/[0.08]" style={{ WebkitOverflowScrolling: "touch" }}>
                      <table {...props} className="min-w-[480px] w-full border-collapse" />
                    </div>
                  ),
                  th: ({ node, ...props }) => <th {...props} className="bg-white/[0.04] px-4 py-2.5 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-white/[0.08]" />,
                  td: ({ node, ...props }) => <td {...props} className="px-4 py-2.5 text-xs text-zinc-400 border-t border-white/[0.05]" />,
                }}
              >
                {message}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;