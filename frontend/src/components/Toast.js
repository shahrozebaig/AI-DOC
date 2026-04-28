import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const config = {
  success: {
    icon: CheckCircle2,
    iconCls: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  error: {
    icon: AlertCircle,
    iconCls: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "shadow-red-500/10",
  },
  default: {
    icon: Info,
    iconCls: "text-zinc-400",
    bg: "bg-white/[0.03]",
    border: "border-white/[0.08]",
    glow: "shadow-black/20",
  },
};

const Toast = ({ message, type, onClose }) => {
  const c = config[type] || config.default;
  const Icon = c.icon;

  return (
    <div className="fixed top-8 left-0 right-0 z-[10000] flex justify-center pointer-events-none px-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 350
        }}
        className="pointer-events-auto"
      >
        <div className={`
          relative overflow-hidden 
          bg-[#0a0a0c]/90 backdrop-blur-xl 
          border ${c.border} rounded-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${c.glow}
          flex items-center gap-3.5 pl-4 pr-3 py-3
          min-w-[280px] max-w-[420px]
        `}>
          {/* Icon */}
          <div className={`shrink-0 w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center`}>
            <Icon size={16} className={c.iconCls} />
          </div>

          {/* Text */}
          <p className="flex-1 text-[13.5px] font-medium text-zinc-100 leading-tight">
            {message}
          </p>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-0.5" />

          {/* Close */}
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            <X size={15} />
          </button>

          {/* Progress Indicator (Thin line at bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.02]">
            <motion.div
              className={`h-full ${c.iconCls.replace("text-", "bg-")} opacity-30`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Toast;