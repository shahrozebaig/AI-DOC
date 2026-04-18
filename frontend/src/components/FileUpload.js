import { useState } from "react";
import { uploadFile } from "../services/chat";
import { useToast } from "../context/ToastContext";

function FileUpload() {
  const { showToast } = useToast();
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      await uploadFile(file);
      showToast("File uploaded successfully!", "success");
    } catch (err) {
      showToast("Upload failed. Please try again.", "error");
      setFileName("");
    }

    setLoading(false);
  };

  const handleUploadClick = (e) => {
    processFile(e.target.files[0]);
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
      processFile(e.dataTransfer.files[0]);
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
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Tailwind CSS Spinner */}
            <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-foreground animate-pulse font-medium">Analyzing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <span className={`text-4xl mb-4 transition-transform duration-300 ${isDragOver ? "scale-125" : ""}`}>📤</span>
            <p className="text-foreground text-lg">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400">Supported formats: PDF, TXT, DOCX</p>
          </div>
        )}
      </label>

      {/* FILE STATUS */}
      <div className="text-sm">
        {fileName ? (
          <p className="text-primary flex items-center gap-2">
            <span className="text-lg">✅</span>
            Ready: {fileName}
          </p>
        ) : (
          <p className="text-gray-500">Upload your document to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default FileUpload;