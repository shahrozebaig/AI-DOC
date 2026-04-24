import { useState, useEffect, useRef, useContext } from "react";
import { sendMessage, getMessagesBySession } from "../services/chat";
import MessageBubble from "./MessageBubble";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import { Mic, Sparkles, Loader2, ArrowUp } from "lucide-react";

function ChatBox({ sessionId, onSessionCreated }) {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (sessionId) {
        setLoading(true);
        try {
          const history = await getMessagesBySession(sessionId);
          setChat(history.map(m => ({ text: m.content, isUser: m.role === "user" })));
        } catch {
          showToast("Failed to load chat history");
        } finally {
          setLoading(false);
        }
      } else {
        setChat([]);
      }
    };
    loadHistory();
  }, [sessionId, showToast]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + "px";
    }
  }, [message]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { showToast("Speech not supported", "error"); return; }
    if (isListening) { recognitionRef.current?.stop(); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setMessage(t);
    };
    try { recognition.start(); recognitionRef.current = recognition; } catch { setIsListening(false); }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    if (isListening) recognitionRef.current?.stop();
    const msg = message;
    setMessage("");
    setChat(prev => [...prev, { text: msg, isUser: true }]);
    setLoading(true);
    try {
      const res = await sendMessage(msg, user.id, sessionId);
      if (!sessionId && res.session_id) onSessionCreated(res.session_id);
      setChat(prev => [...prev, { text: res.response, isUser: false }]);
    } catch (err) {
      const detail = err.response?.data?.detail || "";
      if (detail.includes("No documents indexed yet")) {
        showToast("Please re-upload your documents.", "error");
        setChat(prev => [...prev, { text: "Server was restarted. Please re-upload your files using the sidebar.", isUser: false, isError: true }]);
      } else {
        setChat(prev => [...prev, { text: "Something went wrong. Please try again.", isUser: false, isError: true }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <div className="flex flex-col h-full w-full">

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-6 py-6 scroll-smooth">
        {chat.length === 0 && !loading ? (
          /* Empty state */
          <div className="h-full flex flex-col items-center justify-center text-center gap-5 pb-20">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white mb-1.5">How can I help you?</h2>
              <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                Upload a document in the sidebar, then ask me anything about it.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {["Summarize this document", "Find key insights", "Explain the main points"].map(hint => (
                <button
                  key={hint}
                  onClick={() => setMessage(hint)}
                  className="text-xs text-zinc-400 border border-white/[0.08] rounded-full px-3.5 py-1.5 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 pb-6">
            {chat.map((msg, i) => (
              <MessageBubble key={i} message={msg.text} isUser={msg.isUser} isError={msg.isError} />
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Loader2 size={14} className="text-emerald-400 animate-spin" />
                </div>
                <div className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── INPUT AREA ── */}
      <div className="shrink-0 px-4 md:px-6 pb-5 pt-2">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex flex-col bg-[#18181b] border border-white/[0.09] rounded-2xl shadow-2xl focus-within:border-white/[0.15] transition-all duration-200 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Assistant…"
              rows={1}
              className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none leading-relaxed hide-scrollbar"
              style={{ minHeight: "52px", maxHeight: "180px" }}
            />
            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <button
                onClick={toggleListening}
                className={`p-1.5 rounded-lg transition-all ${
                  isListening
                    ? "text-red-400 bg-red-500/10 animate-pulse"
                    : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                }`}
                title="Voice input"
              >
                <Mic size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-95 ${
                  !message.trim() || loading
                    ? "bg-white/5 text-zinc-600 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25"
                }`}
                title="Send"
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
          <p className="text-center text-[11px] text-zinc-700 mt-2">
            AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>

      <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default ChatBox;