import { motion } from "framer-motion";

const features = [
  { 
    icon: "⚡", 
    title: "Instant Retrieval", 
    desc: "Get answers instantly from your massive documents with AI-powered indexing.",
    color: "from-purple-400 to-blue-500"
  },
  { 
    icon: "🔒", 
    title: "Secure & Private", 
    desc: "Your files are encrypted and private. We never use your data for training.",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    icon: "🎯", 
    title: "Highly Accurate", 
    desc: "AI answers are grounded in your data, providing precise references every time.",
    color: "from-green-500 to-emerald-500"
  },
  { 
    icon: "🧠", 
    title: "Smart Context", 
    desc: "Our AI understands complex relationships and logic within your documents.",
    color: "from-orange-400 to-red-500"
  },
  { 
    icon: "📂", 
    title: "Multi-Doc Support", 
    desc: "Search across hundreds of files simultaneously to find the hidden connections.",
    color: "from-pink-500 to-rose-600"
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Features() {
  return (
    <section id="features" className="relative py-32 px-6 overflow-hidden bg-[#0A0A0F]">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase mb-4 block">Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why use <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DocuMind AI?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with an intuitive interface to redefine how you interact with information.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card Glow */}
              <div className={`absolute -inset-[1px] bg-gradient-to-r ${f.color} rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm`} />
              
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl group-hover:border-white/20 transition-colors duration-300 shadow-2xl">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} p-[1px] mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
                  <div className="w-full h-full bg-[#0A0A0F] rounded-2xl flex items-center justify-center text-2xl">
                    {f.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">
                  {f.title}
                </h3>

                <p className="text-gray-400 leading-relaxed text-sm">
                  {f.desc}
                </p>

                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className={`w-12 h-[2px] bg-gradient-to-r ${f.color} rounded-full`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;