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
      <div className={`flex flex-col w-full md:max-w-[85%] space-y-1.5 ${isUser ? "items-end max-w-[85%]" : "items-start max-w-full md:max-w-[85%]"}`}>
        <div
          className={`px-5 py-3.5 rounded-[22px] text-sm leading-relaxed shadow-sm transition-all duration-300 overflow-hidden ${isUser
              ? "bg-white text-black font-medium rounded-tr-none"
              : isError
                ? "bg-red-950/20 text-red-200 border border-red-500/20 rounded-tl-none font-medium"
                : "bg-white/5 border border-white/[0.05] text-gray-200 rounded-tl-none hover:bg-white/[0.07]"
            }`}
        >
          <div className="markdown-content">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message}</p>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => (
                    <div className="block w-full overflow-x-auto custom-scrollbar my-4 rounded-xl border border-white/5 bg-white/[0.02] shadow-inner" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
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