import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const WhatItIsSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="what-it-is" className="py-16 md:py-24 bg-gradient-to-b from-background to-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            What Is <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MetaHeat</span> Engine?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <div className="space-y-6">
              <p className="text-lg text-foreground/80">
                A GPT-powered, market-predicting engine for Solana meme coins that detects current and upcoming metas using a combination of real-time data and AI logic inspired by top degens and crypto whales.
              </p>
              
              <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-display font-bold text-foreground">Key Features:</h3>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-secondary">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="ml-3 text-foreground/80">Scores each token by its "Meta Heat Score", showing whether it's an alpha, beta, or exit trap.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-secondary">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="ml-3 text-foreground/80">Applies reverse psychology logic and narrative detection — so users don't just follow volume.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-secondary">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="ml-3 text-foreground/80">Predicts the meta before it breaks, powered by GPT-4 and real-time Solana metrics.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-secondary">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="ml-3 text-foreground/80">Capital compression logic and heat radar to visualize market movements.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 animate-pulse-slow"></div>
              <div className="relative bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-primary/30">
                <div className="text-center mb-4">
                  <div className="inline-block bg-primary/20 rounded-full px-3 py-1 text-sm font-mono text-primary mb-2">AI-POWERED</div>
                  <h3 className="text-2xl font-bold font-display text-foreground">Meta Heat Score</h3>
                </div>
                
                {/* Score card example */}
                <div className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-accent font-bold">B</div>
                      <span className="ml-2 font-mono">$BONK</span>
                    </div>
                    <div className="text-xl font-bold text-accent">92</div>
                  </div>
                  
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full" style={{ width: "92%" }}></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-background p-2 rounded font-mono">
                      <p className="text-foreground/60">Volume</p>
                      <p className="text-secondary font-bold">↑ 28%</p>
                    </div>
                    <div className="bg-background p-2 rounded font-mono">
                      <p className="text-foreground/60">Narrative</p>
                      <p className="text-accent font-bold">STRONG</p>
                    </div>
                    <div className="bg-background p-2 rounded font-mono">
                      <p className="text-foreground/60">Momentum</p>
                      <p className="text-secondary font-bold">↑ HIGH</p>
                    </div>
                  </div>
                  
                  <div className="text-xs font-mono bg-background/50 p-3 rounded border border-primary/20">
                    <p className="text-foreground/70">AI Analysis: <span className="text-secondary">Alpha phase with strong narrative momentum. Current meta is focusing on established meme coins. Expect rotation to derivatives within 48h.</span></p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
