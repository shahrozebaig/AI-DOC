import { motion } from "framer-motion";
import { Zap, Shield, Target, Brain, FolderOpen } from "lucide-react";

const features = [
  { icon: Zap,        title: "Instant Retrieval",   desc: "Get answers from massive documents instantly with AI-powered semantic indexing.", accent: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/20" },
  { icon: Shield,     title: "Secure & Private",    desc: "Your files are encrypted end-to-end. We never use your data for model training.", accent: "text-blue-400",   bg: "bg-blue-400/10",    border: "border-blue-400/20"   },
  { icon: Target,     title: "Highly Accurate",     desc: "AI answers are grounded in your data, providing precise references every time.",  accent: "text-emerald-400",bg: "bg-emerald-400/10", border: "border-emerald-400/20"},
  { icon: Brain,      title: "Smart Context",       desc: "Our AI understands complex relationships and multi-step logic within documents.", accent: "text-violet-400", bg: "bg-violet-400/10",  border: "border-violet-400/20" },
  { icon: FolderOpen, title: "Multi-Doc Support",   desc: "Search across hundreds of files simultaneously to find hidden connections.",     accent: "text-pink-400",   bg: "bg-pink-400/10",    border: "border-pink-400/20"   },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

function Features() {
  return (
    <section id="features" className="relative py-28 px-6 bg-[#09090b] overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/8 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/8 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400 mb-3 block">Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DocuMind AI?</span>
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Cutting-edge AI meets an intuitive interface to redefine how you interact with your documents.
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} variants={item} whileHover={{ y: -4 }}
                className="group bg-[#0f0f11] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-300">
                <div className={`inline-flex w-10 h-10 rounded-xl ${f.bg} border ${f.border} items-center justify-center mb-4`}>
                  <Icon size={17} className={f.accent} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;