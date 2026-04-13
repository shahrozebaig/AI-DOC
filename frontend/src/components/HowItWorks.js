import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function HowItWorks() {
  return (
    <section
      id="how"
      className="py-28 px-6 text-center relative overflow-hidden"
    >

      {/* 🌈 MOVING GRADIENT BACKGROUND */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 blur-3xl opacity-40 pointer-events-none" />

      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-20 relative z-10"
      >
        How It Works
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto relative z-10"
      >

        {/* STEP 1 */}
        <motion.div
          variants={item}
          whileHover={{ y: -10, scale: 1.05 }}
          className="relative bg-white/5 backdrop-blur-xl p-8 pt-10 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full md:w-1/3 hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)] transition-all duration-300 group"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-[1px] shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all">
            <div className="w-full h-full bg-[#13111C] rounded-2xl flex items-center justify-center font-bold text-purple-400 text-xl">
              1
            </div>
          </div>

          <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20 text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          </div>

          <h3 className="font-bold text-xl text-white tracking-tight">
            Upload Document
          </h3>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Securely upload your massive PDF or document into your workspace in seconds.
          </p>
        </motion.div>

        {/* ✨ GLOW LINE */}
        <div className="hidden md:block w-20 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-transparent opacity-50 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

        {/* STEP 2 */}
        <motion.div
          variants={item}
          whileHover={{ y: -10, scale: 1.05 }}
          className="relative bg-white/5 backdrop-blur-xl p-8 pt-10 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full md:w-1/3 hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] transition-all duration-300 group"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all">
             <div className="w-full h-full bg-[#11141C] rounded-2xl flex items-center justify-center font-bold text-blue-400 text-xl">
               2
             </div>
          </div>

          <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20 text-blue-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>

          <h3 className="font-bold text-xl text-white tracking-tight">
            Ask Questions
          </h3>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Chat naturally with the AI like you're talking directly to a human expert.
          </p>
        </motion.div>

        {/* ✨ GLOW LINE */}
        <div className="hidden md:block w-20 h-[2px] bg-gradient-to-r from-blue-500 via-green-500 to-transparent opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

        {/* STEP 3 */}
        <motion.div
          variants={item}
          whileHover={{ y: -10, scale: 1.05 }}
          className="relative bg-white/5 backdrop-blur-xl p-8 pt-10 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full md:w-1/3 hover:border-green-500/50 hover:shadow-[0_8px_30px_rgba(34,197,94,0.2)] transition-all duration-300 group"
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-[1px] shadow-[0_0_20px_rgba(34,197,94,0.5)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all">
             <div className="w-full h-full bg-[#111C15] rounded-2xl flex items-center justify-center font-bold text-green-400 text-xl">
               3
             </div>
          </div>

          <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20 text-green-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>

          <h3 className="font-bold text-xl text-white tracking-tight">
            Get Smart Answers
          </h3>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            The AI engine reads your context entirely and responds with precise insights instantly.
          </p>
        </motion.div>

      </motion.div>

      {/* 🔥 EXTRA GLOW ORB */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/20 blur-3xl opacity-30 pointer-events-none" />

    </section>
  );
}

export default HowItWorks;