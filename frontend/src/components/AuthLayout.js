import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
function AuthLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-black relative z-10 flex flex-col">
      <div className="fixed top-0 left-0 right-0 p-8 z-50 pointer-events-none">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.3em] text-gray-500 hover:text-white transition-all bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 pointer-events-auto"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to site
        </button>
      </div>
      <div className="flex justify-center items-center min-h-screen pt-20 pb-20">
        {children}
      </div>
    </div>
  );
}
export default AuthLayout;