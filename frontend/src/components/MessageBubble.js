import { motion } from "framer-motion";
function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
          isUser
            ? "bg-primary text-black"
            : "bg-white/80 text-black backdrop-blur"
        }`}
      >
        {message}
      </div>
    </motion.div>
  );
}
export default MessageBubble;