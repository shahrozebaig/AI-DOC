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
          className="relative bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg w-full md:w-1/3"
        >
          {/* STEP NUMBER */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            1
          </div>

          <h3 className="mt-6 font-semibold text-lg">
            📄 Upload Document
          </h3>
          <p className="text-gray-400 mt-2">
            Securely upload your PDF or document in seconds.
          </p>
        </motion.div>

        {/* ✨ GLOW LINE */}
        <div className="hidden md:block w-24 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-transparent animate-pulse" />

        {/* STEP 2 */}
        <motion.div
          variants={item}
          whileHover={{ y: -10, scale: 1.05 }}
          className="relative bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg w-full md:w-1/3"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            2
          </div>

          <h3 className="mt-6 font-semibold text-lg">
            💬 Ask Questions
          </h3>
          <p className="text-gray-400 mt-2">
            Chat naturally with AI like you're talking to a human.
          </p>
        </motion.div>

        {/* ✨ GLOW LINE */}
        <div className="hidden md:block w-24 h-[2px] bg-gradient-to-r from-blue-500 via-green-500 to-transparent animate-pulse" />

        {/* STEP 3 */}
        <motion.div
          variants={item}
          whileHover={{ y: -10, scale: 1.05 }}
          className="relative bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg w-full md:w-1/3"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-green-500/20 border border-green-400 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.6)]">
            3
          </div>

          <h3 className="mt-6 font-semibold text-lg">
            🤖 Get Smart Answers
          </h3>
          <p className="text-gray-400 mt-2">
            AI reads your document and responds with precise answers instantly.
          </p>
        </motion.div>

      </motion.div>

      {/* 🔥 EXTRA GLOW ORB */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/20 blur-3xl opacity-30 pointer-events-none" />

    </section>
  );
}

export default HowItWorks;