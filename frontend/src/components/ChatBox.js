import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chat";
import MessageBubble from "./MessageBubble";

function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false); // 🔥 typing state
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  // 🔥 VOICE COMMAND
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    
    // Some browsers fire onend when speech stops, we also flip state here just in case
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0].transcript)
        .join("");
      
      setMessage(transcript);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    // ✅ Add user message
    setChat((prev) => [
      ...prev,
      { text: userMessage, isUser: true },
    ]);

    setLoading(true); // 🔥 show typing

    try {
      const res = await sendMessage(userMessage);

      setChat((prev) => [
        ...prev,
        { text: res.response, isUser: false },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { text: "Error getting response", isUser: false },
      ]);
    }

    setLoading(false);
  };

  // 🔥 ENTER KEY SEND
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <div className="flex flex-col h-[500px]">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-2">

        {chat.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}

        {/* 🔥 AI TYPING */}
        {loading && (
          <MessageBubble message="Typing..." isUser={false} />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex bg-white rounded shadow-sm">
        <button
          onClick={startListening}
          className={`px-4 focus:outline-none transition-colors ${
            isListening ? "text-red-500 animate-pulse" : "text-gray-500 hover:text-primary"
          }`}
          title="Voice Command"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} // 🔥 ENTER SEND
          placeholder={isListening ? "Listening... Speak now." : "Ask something about your document..."}
          className="flex-1 p-3 bg-transparent text-black outline-none placeholder-gray-400"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-primary text-black font-medium px-6 rounded-r hover:brightness-110 disabled:opacity-80 transition-all font-sora"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default ChatBox;