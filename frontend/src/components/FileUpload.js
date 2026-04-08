import { useState } from "react";
import { uploadFile } from "../services/chat";

function FileUpload() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name); // ✅ show file name
    setLoading(true);

    try {
      await uploadFile(file);
      alert("File uploaded successfully!");
    } catch (err) {
      alert("Upload failed");
      setFileName("");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">

      {/* UPLOAD BUTTON */}
      <label className="cursor-pointer bg-primary text-black px-4 py-2 rounded hover:brightness-110">
        {loading ? "Uploading..." : "Upload PDF"}
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {/* 🔥 FILE STATUS */}
      <p className="text-sm text-gray-400">
        {fileName ? `📄 ${fileName}` : "Upload your document to start chatting"}
      </p>

    </div>
  );
}

export default FileUpload;