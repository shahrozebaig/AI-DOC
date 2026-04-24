import { useState } from "react";
import { uploadFiles } from "../services/chat";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Upload, FileCheck, Loader2, X, FileText, Zap } from "lucide-react";
function FileUpload({ isCollapsed }) {
  const { showToast } = useToast();
  const { user } = useContext(AuthContext);
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) return;
    setFileCount(selectedFiles.length);
    setLoading(true);
    try {
      const res = await uploadFiles(selectedFiles, user.id);
      if (res && res.error) {
        showToast(res.message || "Intelligence processing failed. Please retry upload.", "error");
        setFileCount(0);
      } else {
        showToast(`${selectedFiles.length} document(s) successfully processed and indexed.`, "success");
        setSelectedFiles([]); // Clear after success
      }
    } catch (err) {
      showToast("Intelligence processing failed. Please retry upload.", "error");
      setFileCount(0);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };
  return (
    <div className="w-full">
      {/* DRAG AND DROP ZONE */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
          ${isCollapsed ? "" : "border border-dashed rounded-xl py-6 px-4"}
          ${isDragOver
            ? "border-emerald-500 bg-emerald-500/5 scale-110"
            : "border-white/10 hover:border-white/20"}
          ${loading ? "opacity-40 pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
          multiple
          accept=".pdf,.txt,.docx"
        />
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 size={isCollapsed ? 20 : 24} className="text-emerald-500 animate-spin" />
            {!isCollapsed && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                Indexing {fileCount} Documents...
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`rounded-lg bg-emerald-500/10 text-emerald-500 transition-transform ${isDragOver ? "scale-110" : ""} ${isCollapsed ? "p-3" : "p-2 mb-1"}`}>
              <Upload size={isCollapsed ? 22 : 18} />
            </div>
            {!isCollapsed && (
              <>
                <p className="text-white text-xs font-semibold">
                  Drop files here
                </p>
                <p className="text-[9px] text-gray-500 font-medium px-2">
                  PDF, TXT, DOCX
                </p>
              </>
            )}
          </div>
        )}
      </label>
      {/* PENDING FILES LIST */}
      {!loading && selectedFiles.length > 0 && !isCollapsed && (
        <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Ready to Index ({selectedFiles.length})
            </p>
            <button 
              onClick={() => setSelectedFiles([])}
              className="text-[9px] font-bold text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Clear All
            </button>
          </div>
          
          <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="group flex items-center justify-between bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-2 transition-all">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={12} className="text-gray-500" />
                  <span className="text-[11px] text-gray-300 truncate font-medium">{file.name}</span>
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  className="p-1 hover:bg-red-500/10 rounded-md text-gray-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={processFiles}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            <Zap size={14} fill="currentColor" />
            Analyze Documents
          </button>
        </div>
      )}

      {/* FILE STATUS (Post-Indexing) */}
      {fileCount > 0 && !loading && !isCollapsed && selectedFiles.length === 0 && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 animate-in fade-in">
          <FileCheck size={14} className="text-emerald-500" />
          <p className="text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider">
            {fileCount} Documents Indexed
          </p>
        </div>
      )}
    </div>
  );
}
export default FileUpload;