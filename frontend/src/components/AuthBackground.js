function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover [transform:scaleY(-1)]"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
          type="video/mp4"
        />
      </video>
      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

    </div>
  );
}
export default AuthBackground;