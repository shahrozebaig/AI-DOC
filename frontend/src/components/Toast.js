import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const config = {
  success: {
    icon: CheckCircle2,
    iconCls: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    bar: "bg-emerald-400",
    border: "border-emerald-400/20",
    label: "Success",
    labelCls: "text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    iconCls: "text-red-400",
    iconBg: "bg-red-400/10",
    bar: "bg-red-400",
    border: "border-red-400/20",
    label: "Error",
    labelCls: "text-red-400",
  },
  default: {
    icon: Info,
    iconCls: "text-zinc-400",
    iconBg: "bg-white/[0.06]",
    bar: "bg-zinc-500",
    border: "border-white/[0.08]",
    label: "Notice",
    labelCls: "text-zinc-400",
  },
};

const Toast = ({ message, type, onClose }) => {
  const c = config[type] || config.default;
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed top-5 right-5 z-[10000] w-full max-w-[340px]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className={`relative overflow-hidden bg-[#0f0f11] border ${c.border} rounded-2xl shadow-2xl shadow-black/60`}>

        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${c.bar}`} />

        {/* Body */}
        <div className="flex items-start gap-3 px-4 pt-5 pb-4">
          {/* Icon */}
          <div className={`shrink-0 w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center mt-0.5`}>
            <Icon size={15} className={c.iconCls} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${c.labelCls}`}>{c.label}</p>
            <p className="text-sm text-zinc-200 leading-snug break-words">{message}</p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="shrink-0 text-zinc-600 hover:text-zinc-300 transition-colors mt-0.5"
          >
            <X size={15} />
          </button>
        </div>

        {/* Auto-drain progress bar */}
        <motion.div
          className={`h-[2px] ${c.bar} opacity-30`}
          initial={{ scaleX: 1, originX: 0 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;