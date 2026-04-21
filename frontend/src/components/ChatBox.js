import { useState, useEffect, useRef, useContext } from "react";
import { sendMessage, getMessagesBySession } from "../services/chat";
import MessageBubble from "./MessageBubble";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import {
  Send,
  Mic,
  CornerDownLeft,
  Sparkles,
  RefreshCw
} from "lucide-react";
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
          const formattedChat = history.map(m => ({
            text: m.content,
            isUser: m.role === 'user'
          }));
          setChat(formattedChat);
        } catch (err) {
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
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [message]);
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Speech recognition not supported in this browser", "error");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setMessage(fullTranscript);
    };
    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setIsListening(false);
    }
  };
  const handleSend = async () => {
    if (!message.trim() || loading) return;
    if (isListening) recognitionRef.current?.stop();
    const currentMsg = message;
    setMessage("");
    setChat(prev => [...prev, { text: currentMsg, isUser: true }]);
    setLoading(true);
    try {
      const res = await sendMessage(currentMsg, user.id, sessionId);
      if (!sessionId && res.session_id) {
        onSessionCreated();
      }
      setChat(prev => [...prev, { text: res.response, isUser: false }]);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "";
      if (errorMsg.includes("No documents indexed yet")) {
        showToast("Server reloaded. Please re-upload your documents to continue.", "error");
        setChat(prev => [...prev, { text: "Server was restarted. Please re-upload your files using the sidebar to start chatting again.", isUser: false, isError: true }]);
      } else {
        setChat(prev => [...prev, { text: "System connection error. Please try again.", isUser: false, isError: true }]);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar scroll-smooth">
        {chat.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 animate-in fade-in duration-1000">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
              <Sparkles size={40} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">How can I help you today?</h3>
            </div>
          </div>
        )}
        {chat.map((msg, i) => (
          <MessageBubble key={i} message={msg.text} isUser={msg.isUser} isError={msg.isError} />
        ))}
        {loading && (
          <div className="flex justify-start items-center gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 shadow-lg">
              <RefreshCw size={14} className="animate-spin" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Processing...</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* INPUT AREA */}
      <div className="p-6 pt-2">
        <div className="relative group transition-all duration-300">
          {/* Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[28px] blur opacity-0 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#111111] border border-white/10 rounded-[24px] shadow-2xl focus-within:border-white/20 transition-all">
            <div className="flex items-end gap-2 px-6 py-2">
              {/* Text Field */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Message AI Assistant..."}
                rows={1}
                className="flex-1 max-h-[200px] bg-transparent py-4 text-sm text-gray-200 outline-none placeholder-gray-600 resize-none leading-relaxed custom-scrollbar"
              />
              <div className="flex items-center gap-1 mb-1">
                {/* Voice Tool */}
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all ${isListening
                      ? "bg-red-500/20 text-red-500 animate-pulse"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    }`}
                >
                  <Mic size={20} />
                </button>
                {/* Send Tool */}
                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className={`p-3 rounded-xl transition-all ${!message.trim() || loading
                      ? "text-gray-700 cursor-not-allowed"
                      : "bg-white text-black hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                    }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            {/* Status bar */}
            <div className="flex items-center justify-end px-6 py-2 border-t border-white/[0.03] text-[9px] uppercase font-bold tracking-[0.2em] text-gray-600">
              <div className="flex items-center gap-1">
                <CornerDownLeft size={10} />
                <span>Enter to Send</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
export default ChatBox;