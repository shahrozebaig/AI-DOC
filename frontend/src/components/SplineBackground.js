import { Suspense, lazy } from "react";

// lazy load (performance)
const Spline = lazy(() => import("@splinetool/react-spline"));

function SplineBackground() {
  return (
    <div className="absolute inset-0">
      <Suspense
        fallback={<div className="absolute inset-0 bg-hero"></div>}
      >
        <Spline
          scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}

export default SplineBackground;