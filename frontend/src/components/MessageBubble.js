import { motion } from "framer-motion";

function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      } mb-3`}
    >
      {/* 🤖 AI ICON */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
          🤖
        </div>
      )}

      {/* MESSAGE */}
      <div
        className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
          isUser
            ? "bg-primary text-black"
            : "bg-white/80 text-black backdrop-blur"
        }`}
      >
        {message}
      </div>

      {/* 👤 USER ICON */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black text-sm">
          👤
        </div>
      )}
    </motion.div>
  );
}

export default MessageBubble;