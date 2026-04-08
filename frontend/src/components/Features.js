import { motion } from "framer-motion";
import BackgroundVideo from "../components/BackgroundVideo";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const features = [
  { icon: "⚡", title: "Fast", desc: "Get answers instantly from your documents." },
  { icon: "🔒", title: "Secure", desc: "Your files are private and protected." },
  { icon: "🎯", title: "Accurate", desc: "AI answers based on your data." },
  { icon: "🧠", title: "Smart AI", desc: "Understands context, not just keywords." },
  { icon: "📂", title: "Multi-doc", desc: "Upload and search across multiple files." },
  { icon: "☁️", title: "Cloud ready", desc: "Access your documents anytime, anywhere." },
];

function Features() {
  return (
    <section
      id="features"
      className="relative py-24 px-6 text-center overflow-hidden"
    >

      {/* 🎥 VIDEO BACKGROUND */}
      <BackgroundVideo />

      {/* 🔥 OVERLAY (adjust if needed) */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      {/* CONTENT */}
      <div className="relative z-10">

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-medium mb-12 text-white"
        >
          Why use this tool?
        </motion.h2>

        {/* GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 text-left"
            >
              <span className="text-xl block mb-3">{f.icon}</span>

              <h3 className="font-medium text-base mb-1 text-white">
                {f.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Features;