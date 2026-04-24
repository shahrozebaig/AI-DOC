import { motion } from "framer-motion";
import { User, Sparkles, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({ message, isUser, isError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-4 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* ICON WRAPPER */}
      <div className="shrink-0 mt-1">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${isUser
              ? "bg-white/5 border border-white/10 text-white shadow-lg"
              : isError
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-emerald-500/5 shadow-xl"
            }`}
        >
          {isUser ? <User size={18} /> : isError ? <AlertCircle size={18} /> : <Sparkles size={18} />}
        </div>
      </div>
      {/* MESSAGE TEXT */}
      <div className={`flex flex-col min-w-0 w-full md:max-w-[85%] space-y-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`w-full max-w-full rounded-[22px] px-7 py-5 text-[14.5px] leading-[1.65] shadow-sm transition-all duration-300 overflow-hidden ${isUser
              ? "bg-white text-black font-medium rounded-tr-none"
              : isError
                ? "bg-red-950/20 text-red-200 border border-red-500/20 rounded-tl-none font-medium"
                : "bg-[#111111] border border-white/5 text-gray-200 rounded-tl-none hover:bg-white/[0.07]"
            }`}
        >
          <div className="markdown-content space-y-4">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message}</p>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0 leading-relaxed" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc ml-6 mb-4 space-y-2" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal ml-6 mb-4 space-y-2" />,
                  li: ({node, ...props}) => <li {...props} className="text-gray-300" />,
                  table: ({node, ...props}) => (
                    <div className="block w-full overflow-x-auto hide-scrollbar my-6 rounded-xl border border-white/10 bg-white/[0.02]" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
                      <table {...props} className="min-w-[500px] w-full border-collapse divide-y divide-white/5" />
                    </div>
                  ),
                  th: ({node, ...props}) => <th {...props} className="bg-white/5 px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider" />,
                  td: ({node, ...props}) => <td {...props} className="px-4 py-3 text-xs text-gray-400 border-t border-white/5" />
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