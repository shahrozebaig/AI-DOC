import { useState, useEffect, useRef, useContext } from "react";
import { sendMessage, getMessagesBySession } from "../services/chat";
import MessageBubble from "./MessageBubble";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import {
  Send,
  Mic,
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
        onSessionCreated(res.session_id);
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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 scroll-smooth hide-scrollbar z-10">
        {chat.length === 0 && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 opacity-30 pointer-events-none">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
              <Sparkles size={40} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">How can I help you today?</h3>
            </div>
          </div>
        )}
        <div className="min-h-full flex flex-col gap-10 pb-20">
            {chat.map((msg, i) => (
            <MessageBubble key={i} message={msg.text} isUser={msg.isUser} isError={msg.isError} />
            ))}
            {loading && (
            <div className="flex justify-start items-center gap-3 mt-10">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 shadow-lg">
                <RefreshCw size={14} className="animate-spin" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Processing...</p>
            </div>
            )}
            <div ref={chatEndRef} className="h-10" />
        </div>
      </div>
      {/* INPUT AREA */}
      <div className="p-4 md:p-6 w-full max-w-4xl mx-auto mb-4">
        <div className="relative flex items-center bg-[#1e1e1e] border border-white/10 rounded-[32px] px-4 py-2 shadow-2xl focus-within:border-white/20 transition-all">
          {/* Text Field */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            rows={1}
            className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-200 outline-none placeholder-gray-500 resize-none leading-relaxed hide-scrollbar"
            style={{ minHeight: '44px' }}
          />

          <div className="flex items-center gap-1">
            {/* Voice Tool */}
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all ${isListening
                  ? "text-red-500 animate-pulse"
                  : "text-gray-500 hover:text-white"
                }`}
            >
              <Mic size={20} />
            </button>
            {/* Send Tool */}
            <button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className={`p-2 rounded-full transition-all ${!message.trim() || loading
                  ? "text-gray-700 cursor-not-allowed"
                  : "text-white bg-emerald-600 hover:bg-emerald-500"
                }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

    </div>
  );
}
export default ChatBox;