import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";
const Toast = ({ message, type, onClose }) => {
    const isError = type === 'error';
    const isSuccess = type === 'success';
    return (
        <motion.div
            initial={{ opacity: 0, x: 20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 right-8 z-[10000]"
        >
            <div className={`
                relative overflow-hidden
                flex items-center gap-4 pl-4 pr-5 py-3.5 rounded-[18px] 
                bg-[#0c0c0c] border backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]
                ${isError
                    ? 'border-red-500/30'
                    : isSuccess
                        ? 'border-emerald-500/30'
                        : 'border-white/10'}
            `}>
                {/* Glow Background */}
                <div className={`
                    absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 blur-2xl opacity-20
                    ${isError ? 'bg-red-500' : isSuccess ? 'bg-emerald-500' : 'bg-white'}
                `} />
                {/* ICON */}
                <div className={`
                    shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                    ${isError
                        ? 'bg-red-500/10 text-red-500'
                        : isSuccess
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-white/5 text-white'}
                `}>
                    {isError ? <AlertCircle size={16} /> : isSuccess ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                </div>
                {/* CONTENT */}
                <div className="flex flex-col min-w-[180px] max-w-[300px]">
                    <span className="text-[12px] font-bold text-gray-200 leading-tight tracking-tight">
                        {message}
                    </span>
                </div>
                {/* SEPARATOR */}
                <div className="w-[1px] h-6 bg-white/[0.05]" />
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="p-1 px-2 text-gray-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                    Dismiss
                </button>
                {/* TOP BORDER ACCENT */}
                <div className={`
                    absolute top-0 left-0 right-0 h-[1.5px]
                    ${isError ? 'bg-red-500' : isSuccess ? 'bg-emerald-500' : 'bg-white/20'}
                `} />
            </div>
        </motion.div>
    );
};
export default Toast;