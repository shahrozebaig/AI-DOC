import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import FileUpload from "../components/FileUpload";
function Dashboard() {
  return (
    <div className="min-h-screen bg-hero text-white pt-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        {/* Upload Section */}
        <div className="mb-6">
          <FileUpload />
        </div>
        {/* Chat Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <ChatBox />
        </div>

      </div>
    </div>
  );
}
export default Dashboard;