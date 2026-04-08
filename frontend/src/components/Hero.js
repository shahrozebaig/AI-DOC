import { Link } from "react-router-dom";
import SplineBackground from "./SplineBackground";
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-hero">
      {/* 3D Background */}
      <SplineBackground />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 pointer-events-none">
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold uppercase animate-fade-up">
          DocuMind <span className="text-primary">AI</span>
        </h1>
        <p className="mt-4 text-gray-300 animate-fade-up">
          Ask questions from your documents instantly using AI.
        </p>
        <p className="mt-2 text-gray-400 animate-fade-up">
          Upload PDFs, query them, and get accurate answers powered by RAG.
        </p>
        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6 pointer-events-auto animate-fade-up">
          <Link
            to="/signup"
            className="bg-primary text-black px-6 py-3 rounded hover:brightness-110"
          >
            Get Started Free
          </Link>
          <button className="bg-white text-black px-6 py-3 rounded hover:brightness-90">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
export default Hero;