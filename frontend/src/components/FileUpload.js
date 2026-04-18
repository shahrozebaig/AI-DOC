import { useState } from "react";
import { uploadFiles } from "../services/chat";
import { useToast } from "../context/ToastContext";

function FileUpload() {
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
      await uploadFiles(fileList);
      showToast(`${fileList.length} file(s) uploaded and indexed!`, "success");
    } catch (err) {
      showToast("Upload failed. Please try again.", "error");
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
    <div className="w-full flex flex-col items-start gap-4">
      {/* DRAG AND DROP ZONE */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-xl border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
          ${isDragOver ? "border-primary bg-primary/10 scale-[1.02]" : "border-border bg-muted/30 hover:bg-muted/50"}
          ${loading ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          onChange={handleUploadClick}
          className="hidden"
          disabled={loading}
          multiple // 🔥 ALLOW MULTIPLE FILES
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-foreground animate-pulse font-medium">Processing {fileCount} document(s)...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <span className={`text-4xl mb-4 transition-transform duration-300 ${isDragOver ? "scale-125" : ""}`}>📤</span>
            <p className="text-foreground text-lg">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400">Supported formats: PDF, TXT, DOCX (Multiple files supported)</p>
          </div>
        )}
      </label>

      {/* FILE STATUS */}
      <div className="text-sm">
        {fileCount > 0 ? (
          <p className="text-primary flex items-center gap-2">
            <span className="text-lg">✅</span>
            {fileCount} document(s) active in chat
          </p>
        ) : (
          <p className="text-gray-500">Upload documents to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;