import { Link } from "react-router-dom";
import SplineBackground from "./SplineBackground";

function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center text-center overflow-hidden bg-hero">
      
      {/* 3D Background */}
      <SplineBackground />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 pointer-events-none">

        {/* TITLE */}
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold uppercase animate-fade-up animate-gradient-text">
          DocuMind AI
        </h1>

        {/* 🔥 NEW TAGLINE */}
        <p className="mt-4 text-lg text-gray-200 animate-fade-up">
          Turn your documents into intelligent conversations.
        </p>

        {/* DESCRIPTION */}
        <p className="mt-2 text-gray-400 animate-fade-up">
          Upload PDFs, ask questions, and get precise answers instantly using AI-powered retrieval.
        </p>

        {/* 🔥 FEATURES */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-300 animate-fade-up">
          <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur">
            ⚡ Instant Answers
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur">
            📄 Smart PDF Analysis
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full backdrop-blur">
            🤖 AI-Powered Search
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mt-8 pointer-events-auto animate-fade-up">
          <Link
            to="/login"
            className="bg-primary text-black px-6 py-3 rounded hover:brightness-110 font-semibold"
          >
            Get Started Free
          </Link>

          <button className="bg-white text-black px-6 py-3 rounded hover:brightness-90 font-semibold">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;