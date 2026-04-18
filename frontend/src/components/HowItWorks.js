import { motion } from "framer-motion";

const steps = [
  {
    title: "Upload Document",
    description: "Securely upload your massive PDF or document into your workspace in seconds. Our system processes high-volume data with lightning speed and precision.",
    image: "/Upload.jpeg",
    icon: "📤",
    color: "from-purple-500 to-indigo-600",
    glow: "rgba(168,85,247,0.4)"
  },
  {
    title: "Ask Questions",
    description: "Chat naturally with the AI like you're talking directly to a human expert. Get instant clarifications on complex topics within your documents.",
    image: "/Ask.jpeg",
    icon: "💬",
    color: "from-blue-500 to-cyan-500",
    glow: "rgba(59,130,246,0.4)"
  },
  {
    title: "Get Smart Answers",
    description: "The AI engine reads your context entirely and responds with precise insights instantly. Every answer is backed by references to your original content.",
    image: "/Answer.jpeg",
    icon: "✨",
    color: "from-green-500 to-emerald-500",
    glow: "rgba(34,197,94,0.4)"
  }
];

function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6 relative overflow-hidden bg-[#0A0A0F]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the power of Al-driven document analysis in three simple steps.
          </p>
        </motion.div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 md:gap-24`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="relative group">
                  <div 
                    className={`absolute -inset-4 bg-gradient-to-r ${step.color} rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                  />
                  <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className={`absolute -bottom-6 ${index % 2 === 0 ? "-right-6" : "-left-6"} w-24 h-24 bg-gradient-to-br ${step.color} rounded-full blur-3xl opacity-30 animate-pulse`} />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} p-[1px]`}>
                    <div className="w-full h-full bg-[#0A0A0F] rounded-2xl flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                  </div>
                  <span className="text-sm font-bold tracking-widest uppercase text-gray-500">Step {index + 1}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  {step.description}
                </p>

                <div className="pt-4">
                  <div className={`h-1 w-20 bg-gradient-to-r ${step.color} rounded-full`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;