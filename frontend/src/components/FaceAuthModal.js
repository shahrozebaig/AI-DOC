import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceAuthModal = ({ isOpen, onClose, mode, userEmail, userId, onSuccess }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      // Note: adjust the base URL as needed (e.g. backend URL from .env)
      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
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
      setError(err.response?.data?.detail || "An error occurred during verification.");
    }
  }, [webcamRef, mode, userEmail, userId, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {mode === 'register' ? 'Face Registration' : 'Face ID Login'}
              </h3>
              <p className="text-sm text-gray-500">
                {mode === 'register' ? 'Set up your biometric profile' : 'Scan to unlock your account'}
              </p>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="relative aspect-video bg-gray-900 rounded-[24px] overflow-hidden mb-8 border-8 border-gray-50 shadow-inner group">
            {!success ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                videoConstraints={{ facingMode: "user" }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500 text-white animate-in slide-in-from-bottom duration-500">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p className="text-xl font-bold tracking-tight">Identity Verified</p>
              </div>
            )}
            
            <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-[24px]"></div>
            
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={capture}
              disabled={loading || success}
              className={`w-full py-4.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${
                loading || success ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20'
              }`}
            >
              {mode === 'register' ? (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  Register Biometrics
                </>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                  Scan Face Now
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Securely encrypted & processed locally
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceAuthModal;
