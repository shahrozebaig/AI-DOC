import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chat";
import MessageBubble from "./MessageBubble";
import { useToast } from "../context/ToastContext";

function ChatBox() {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🔥 AUTO-RESIZE
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [message]);

  const handleTextChange = (e) => {
    setMessage(e.target.value);
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Your browser does not support voice recognition. Please try Chrome.", "error");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
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
    if (!message.trim()) return;

    // 🔥 STOP LISTENING WHEN SENDING
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage = message;
    setMessage("");

    setChat((prev) => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const res = await sendMessage(userMessage);
      setChat((prev) => [...prev, { text: res.response, isUser: false }]);
    } catch {
      setChat((prev) => [...prev, { text: "Error getting response", isUser: false }]);
    }
    setLoading(false);
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
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-4">
        {chat.map((msg, i) => (
          <MessageBubble key={i} message={msg.text} isUser={msg.isUser} />
        ))}
        {loading && <MessageBubble message="Typing..." isUser={false} />}
        <div ref={chatEndRef} />
      </div>

      <div className="relative flex items-end bg-white rounded-2xl shadow-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all z-20">
        <button
          onClick={toggleListening}
          className={`p-4 transition-colors mb-[2px] ${isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-primary"
            }`}
          title="Voice Command"
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now." : "Ask something..."}
          rows={1}
          className="flex-1 max-h-[150px] p-4 pl-0 py-4 bg-transparent text-black outline-none placeholder-gray-400 resize-none overflow-y-auto leading-relaxed"
          style={{ minHeight: "56px" }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="p-4 mb-[2px] text-primary hover:text-green-600 disabled:opacity-40 transition-colors flex-shrink-0"
          title="Send message"
        >
          <svg className="w-7 h-7 transform rotate-45 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
