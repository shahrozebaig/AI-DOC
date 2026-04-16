import React from 'react';

const Toast = ({ message, type, onClose }) => {
    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 min-w-[300px] ${
                type === 'error' 
                    ? 'bg-red-500/90 border-red-500/20 text-white shadow-red-500/20' 
                    : 'bg-emerald-500/90 border-emerald-500/20 text-white shadow-emerald-500/20'
            }`}>
                {type === 'error' ? (
                    <div className="p-1.5 bg-white/20 rounded-lg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                ) : (
                    <div className="p-1.5 bg-white/20 rounded-lg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                )}
                <span className="font-bold text-sm tracking-tight flex-1">{message}</span>
                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-all active:scale-90">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;
