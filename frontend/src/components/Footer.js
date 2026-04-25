function Footer() {
  return (
    <footer className="bg-[#09090b] border-t border-white/[0.06] py-8 px-6"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/Logo.jpeg" alt="DocuMind AI" className="h-8 w-auto rounded-lg" />
          <span className="text-sm font-semibold text-white">DocuMind AI</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-zinc-600">&copy; 2026 DocuMind AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;