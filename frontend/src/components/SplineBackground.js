import { Suspense, lazy } from "react";
const Spline = lazy(() => import("@splinetool/react-spline"));

function SplineBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Suspense fallback={<div className="absolute inset-0 bg-[#080808] bg-hero"></div>}>
        <Spline
          scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
          className="w-full h-full pointer-events-none"
        />
      </Suspense>
    </div>
  );
}

export default SplineBackground;