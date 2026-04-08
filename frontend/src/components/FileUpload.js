import { uploadFile } from "../services/chat";
function FileUpload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file);
    alert("File uploaded successfully!");
  };
  return (
    <div className="flex items-center gap-4">
      <label className="cursor-pointer bg-primary text-black px-4 py-2 rounded hover:brightness-110">
        Upload PDF
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
      <p className="text-gray-400 text-sm">
        Upload your document to start chatting
      </p>
    </div>
  );
}
export default FileUpload;