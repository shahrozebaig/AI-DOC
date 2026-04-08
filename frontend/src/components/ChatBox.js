import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chat";
import MessageBubble from "./MessageBubble";
function ChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = message;
    setMessage("");
    setChat((prev) => [
      ...prev,
      { text: userMessage, isUser: true },
    ]);
    const res = await sendMessage(userMessage);
    setChat((prev) => [
      ...prev,
      { text: res.response, isUser: false },
    ]);
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  return (
    <div className="flex flex-col h-[500px]">
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {chat.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* INPUT */}
      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about your document..."
          className="flex-1 p-3 rounded-l bg-white text-black outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-black px-6 rounded-r hover:brightness-110"
        >
          Send
        </button>
      </div>

    </div>
  );
}
export default ChatBox;