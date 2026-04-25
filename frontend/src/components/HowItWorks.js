import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Upload Document",
    description: "Securely upload your PDF or document into your workspace in seconds. Our system processes high-volume data with lightning speed.",
    image: "/Upload.jpeg",
    accent: "text-violet-400",
    border: "border-violet-400/20",
    glow: "bg-violet-500/10",
  },
  {
    num: "02",
    title: "Ask Questions",
    description: "Chat naturally with the AI like talking to a human expert. Get instant clarifications on complex topics within your documents.",
    image: "/Ask.jpeg",
    accent: "text-blue-400",
    border: "border-blue-400/20",
    glow: "bg-blue-500/10",
  },
  {
    num: "03",
    title: "Get Smart Answers",
    description: "The AI responds with precise insights backed by references to your original content — every answer is grounded in your data.",
    image: "/Answer.jpeg",
    accent: "text-emerald-400",
    border: "border-emerald-400/20",
    glow: "bg-emerald-500/10",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="py-28 px-6 bg-[#09090b] relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400 mb-3 block">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Three steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">smarter docs</span>
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto">Experience AI-driven document analysis in three simple steps.</p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-20`}>

              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative group rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0f0f11]">
                  <img src={step.image} alt={step.title} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className={`inline-flex items-center gap-2 ${step.glow} border ${step.border} px-3 py-1 rounded-full`}>
                  <span className={`text-xs font-bold tracking-widest uppercase ${step.accent}`}>Step {step.num}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-md">{step.description}</p>
                <div className={`h-0.5 w-16 ${step.glow} rounded-full mt-2`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;