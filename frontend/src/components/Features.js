import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Features() {
  return (
    <section
      id="features"
      className="py-28 px-6 text-center relative overflow-hidden"
    >

      {/* 🌈 MOVING BACKGROUND */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 blur-3xl opacity-30 pointer-events-none" />

      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-16 relative z-10"
      >
        Why Use This Tool?
      </motion.h2>

      {/* GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10"
      >

        {[
          { icon: "⚡", title: "Fast", desc: "Get answers instantly from your documents.", glow: "purple" },
          { icon: "🔒", title: "Secure", desc: "Your files are private and protected.", glow: "blue" },
          { icon: "🎯", title: "Accurate", desc: "AI answers based on your data.", glow: "green" },
          { icon: "🧠", title: "Smart AI", desc: "Understands context, not just keywords.", glow: "pink" },
          { icon: "📂", title: "Multi Docs", desc: "Upload and search across multiple files.", glow: "yellow" },
          { icon: "☁️", title: "Cloud Ready", desc: "Access your documents anytime, anywhere.", glow: "cyan" },
        ].map((f, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -10, scale: 1.05 }}
            className="relative bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg transition"
          >

            {/* 🔥 GLOW */}
            <div className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition blur-xl bg-${f.glow}-500/20`} />

            <div className="relative z-10">
              <h3 className="text-2xl mb-2">{f.icon}</h3>
              <h3 className="font-semibold mb-2 text-lg">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {f.desc}
              </p>
            </div>

          </motion.div>
        ))}

      </motion.div>

      {/* 🔥 BOTTOM GLOW */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500/20 blur-3xl opacity-30 pointer-events-none" />

    </section>
  );
}

export default Features;