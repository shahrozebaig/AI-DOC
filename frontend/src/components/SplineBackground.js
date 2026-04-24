import { Suspense, lazy, useState, useEffect } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

function SplineBackground() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile: skip heavy 3D WebGL scene — use a pure-CSS background
  if (isMobile) {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 85%, rgba(139,92,246,0.13) 0%, transparent 70%), #080808",
          }}
        />
        {/* Subtle pulsing orbs — CSS animation only, zero JS cost */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "8%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "mobileOrb 7s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            right: "6%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "mobileOrb 9s ease-in-out infinite reverse",
          }}
        />
        <style>{`
          @keyframes mobileOrb {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  // Desktop: load the full Spline 3D scene
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Suspense fallback={<div className="absolute inset-0 bg-[#080808]" />}>
        <Spline
          scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
          className="w-full h-full pointer-events-none"
        />
      </Suspense>
    </div>
  );
}

export default SplineBackground;