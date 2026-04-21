import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { X, Camera, Scan, CheckCircle2, AlertCircle, Loader2, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const FaceAuthModal = ({ isOpen, onClose, mode = 'login', userEmail = '', userId = '', onSuccess }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (isOpen) {
      console.log(`FaceAuthModal Mounted: mode=${mode}, userEmail=${userEmail}, userId=${userId}`);
    }
  }, [isOpen, mode, userEmail, userId]);
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setLoading(true);
    setError(null);
    const endpoint = mode === 'register' ? '/face/register' : '/face/login';
    const payload = mode === 'register'
      ? { user_id: userId, email: userEmail, image: imageSrc }
      : { email: userEmail, image: imageSrc };
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${baseUrl}${endpoint}`, payload);
      setLoading(false);
      setSuccess(true);
      if (onSuccess) {
        onSuccess(response.data);
      }
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail || "Verification failed. Please ensure proper lighting and try again.");
    }
  }, [webcamRef, mode, userEmail, userId, onSuccess, onClose]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#080808]/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0c0c0c] border border-white/[0.08] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] w-full max-w-md rounded-[32px] overflow-hidden relative"
      >
        {/* TOP GLOW */}
        <div className="absolute top-0 left-0 right-0 h-[100px] bg-emerald-500/5 blur-[60px] pointer-events-none" />

        <div className="p-8 relative">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <Fingerprint size={12} className="text-emerald-500" />
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-emerald-500">Biometric Secure</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {mode === 'register' ? 'Register Face' : 'Neural Unlock'}
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                {mode === 'register' ? 'Map your face for instant access' : 'Authentication scan required'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-600 hover:text-white border border-transparent hover:border-white/10"
            >
              <X size={20} />
            </button>
          </div>
          {/* VIEWPORT */}
          <div className="relative aspect-square bg-[#111111] rounded-[28px] overflow-hidden mb-8 border border-white/[0.05] shadow-inner group shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]">
            {!success ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
                videoConstraints={{ facingMode: "user" }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500 text-white z-20"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-xl border border-white/20">
                  <CheckCircle2 size={40} />
                </div>
                <p className="text-xl font-bold tracking-tighter">Authorized</p>
              </motion.div>
            )}
            {/* SCANNING OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="w-full h-full border-[20px] border-[#0c0c0c]/40" />
              <div className="absolute inset-[20px] border border-white/10 rounded-2xl" />
              {/* Scan Line Animation */}
              {!success && !loading && (
                <motion.div
                  animate={{ top: ["20px", "calc(100% - 20px)", "20px"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-[20px] right-[20px] h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-20"
                />
              )}
            </div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                  <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Syncing Neural Data...</span>
                </div>
              </div>
            )}
          </div>
          {/* ERROR DISPLAY */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs flex items-start gap-3"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {/* ACTIONS */}
          <div className="flex flex-col gap-4">
            <button
              onClick={capture}
              disabled={loading || success}
              className={`w-full py-4.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl group ${loading || success
                  ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200 shadow-white/5'
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : mode === 'register' ? (
                <>
                  <Camera size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Map Face Identity</span>
                </>
              ) : (
                <>
                  <Scan size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Begin Secure Scan</span>
                </>
              )}
            </button>
            <p className="text-center text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">
              End-to-End Encrypted Biometrics
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default FaceAuthModal;