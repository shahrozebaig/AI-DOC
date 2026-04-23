import { useState } from "react";
import { uploadFiles } from "../services/chat";
import { useToast } from "../context/ToastContext";
import { Upload, FileCheck, Loader2 } from "lucide-react";
function FileUpload({ isCollapsed }) {
  const { showToast } = useToast();
  const [fileCount, setFileCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    setFileCount(fileList.length);
    setLoading(true);
    try {
      const res = await uploadFiles(fileList);
      if (res && res.error) {
        showToast(res.message || "Intelligence processing failed. Please retry upload.", "error");
        setFileCount(0);
      } else {
        showToast(`${fileList.length} document(s) successfully processed and indexed.`, "success");
      }
    } catch (err) {
      showToast("Intelligence processing failed. Please retry upload.", "error");
      setFileCount(0);
    }
    setLoading(false);
  };
  const handleUploadClick = (e) => {
    processFiles(e.target.files);
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
      processFiles(e.dataTransfer.files);
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
          onChange={handleUploadClick}
          className="hidden"
          disabled={loading}
          multiple
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
      {/* FILE STATUS (Minimal) */}
      {fileCount > 0 && !loading && !isCollapsed && (
        <div className="mt-3 flex items-center gap-2 px-2 py-1.5 bg-emerald-500/5 rounded-lg border border-emerald-500/10 animate-in fade-in">
          <FileCheck size={12} className="text-emerald-500" />
          <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-wider">
            {fileCount} Linked Documents
          </p>
        </div>
      )}
    </div>
  );
}
export default FileUpload;