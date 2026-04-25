import { Link } from "react-router-dom";
import SplineBackground from "./SplineBackground";

function Hero() {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center text-center overflow-hidden bg-[#09090b]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <SplineBackground />
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      <div className="relative z-10 max-w-4xl px-6 pointer-events-none">

        {/* Animated multicolor title */}
        <style>{`
          @keyframes gradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-title {
            background: linear-gradient(270deg, #34d399, #22d3ee, #818cf8, #f472b6, #fb923c, #34d399);
            background-size: 400% 400%;
            animation: gradientShift 5s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>

        <h1 className="animated-title text-7xl md:text-9xl font-bold leading-[1.0] tracking-tight mb-8">
          DocuMind AI
        </h1>

        <p className="text-base md:text-lg text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto">
          Turn your documents into intelligent conversations. Upload PDFs, ask questions, and get precise answers instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pointer-events-auto">
          <Link to="/signup"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/30">
            Get Started Free
          </Link>
          <button onClick={() => scroll("how")}
            className="bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-zinc-200 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95">
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;