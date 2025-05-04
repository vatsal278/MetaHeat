import { motion } from "framer-motion";

export const HowItWorksSection = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            How It <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Works</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mt-4"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Layer 1 */}
          <motion.div 
            className="bg-background/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full flex flex-col"
            variants={item}
          >
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-primary font-bold font-display text-xl">1</span>
            </div>
            <h3 className="text-xl font-bold font-display mb-3 text-foreground">Solana-wide Context</h3>
            <p className="text-foreground/70 mb-4 flex-grow">Analyzes the broader Solana ecosystem to detect narrative flows and market trends that could impact meme coin performance.</p>
            <div className="bg-card/50 p-3 rounded-md text-xs font-mono">
              <span className="text-secondary">Detection:</span> Narrative shifts, volume patterns, whale movements
            </div>
          </motion.div>
          
          {/* Layer 2 */}
          <motion.div 
            className="bg-background/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full flex flex-col"
            variants={item}
          >
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
              <span className="text-secondary font-bold font-display text-xl">2</span>
            </div>
            <h3 className="text-xl font-bold font-display mb-3 text-foreground">Token Scoring</h3>
            <p className="text-foreground/70 mb-4 flex-grow">Each token is analyzed using AI judgment to provide a comprehensive Meta Heat Score based on multiple factors.</p>
            <div className="bg-card/50 p-3 rounded-md text-xs font-mono">
              <span className="text-secondary">Analysis:</span> Social signals, trading volume, wallet distributions, narrative fit
            </div>
          </motion.div>
          
          {/* Layer 3 */}
          <motion.div 
            className="bg-background/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full flex flex-col"
            variants={item}
          >
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <span className="text-accent font-bold font-display text-xl">3</span>
            </div>
            <h3 className="text-xl font-bold font-display mb-3 text-foreground">Narrative Dashboard</h3>
            <p className="text-foreground/70 mb-4 flex-grow">Visualizes the current and emerging narratives with sniper-tier insights for strategic trading decisions.</p>
            <div className="bg-card/50 p-3 rounded-md text-xs font-mono">
              <span className="text-secondary">Features:</span> Real-time updates, trading signals, narrative forecasting
            </div>
          </motion.div>
          
          {/* Bonus Layer */}
          <motion.div 
            className="bg-background/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full flex flex-col"
            variants={item}
          >
            <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
              <span className="text-warning font-bold font-display text-xl">+</span>
            </div>
            <h3 className="text-xl font-bold font-display mb-3 text-foreground">Capital Compression</h3>
            <p className="text-foreground/70 mb-4 flex-grow">Tracks capital flow between tokens and identifies compression events that signal imminent breakouts.</p>
            <div className="bg-card/50 p-3 rounded-md text-xs font-mono">
              <span className="text-secondary">Utility:</span> Heat radar, capital flow visualization, compression alerts
            </div>
          </motion.div>
        </motion.div>
        
        {/* Additional info */}
        <motion.div 
          className="mt-16 bg-background/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold font-display text-foreground">Why This Matters</h3>
          </div>
          
          <p className="text-foreground/80 text-lg max-w-3xl mx-auto text-center">
            Right now, degens are manually hunting metas across Twitter, DEXs, and chatrooms. Our platform automates that entire process and reveals where capital is flowing, what's about to break out, and how to act like a whale — before anyone else sees it.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
