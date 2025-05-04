import { ParticleCanvas } from "./ParticleCanvas";
import { WalletConnectButton } from "./WalletConnectButton";
import { motion } from "framer-motion";

interface HeroSectionProps {
  isConnected: boolean;
  onConnect: () => void;
}

export const HeroSection = ({ isConnected, onConnect }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" id="hero">
      <ParticleCanvas />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
                <span className="text-glitch" data-text="Introducing the">Introducing the</span>
                <div className="mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  MetaHeat Engine
                </div>
              </h1>
              <h2 className="mt-4 text-xl md:text-2xl lg:text-3xl font-display text-foreground/80">
                Predict the Meta, <span className="font-bold text-accent">Don't Follow It</span>
              </h2>
            </div>
            
            <p className="text-lg text-foreground/80 max-w-xl">
              A GPT-powered, market-predicting engine for Solana meme coins that detects current and upcoming metas using AI logic inspired by top degens and crypto whales. Get ahead of the curve, not behind it.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <WalletConnectButton 
                id="hero-wallet-connect"
                isConnected={isConnected} 
                onConnect={onConnect} 
                variant="primary" 
                size="lg"
                label="Get Beta Access Now"
              />
              <a href="#how-it-works" className="neon-border bg-card hover:bg-card/80 text-foreground font-bold py-3 px-6 rounded-md transition duration-200 ease-in-out flex items-center justify-center">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
            
            {isConnected && (
              <motion.div 
                className="p-4 rounded-md bg-card/50 border border-primary/30 backdrop-blur-sm max-w-md"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-mono text-sm text-success">You're on the list ✓</p>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            className="relative w-full h-80 md:h-96 lg:h-[450px] animate-float"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden neon-border p-1">
              <div className="relative h-full bg-card/40 backdrop-blur-md rounded-lg overflow-hidden border border-primary/30">
                {/* Visualizer mockup */}
                <div className="p-4 h-full">
                  <div className="mb-3 flex justify-between items-center">
                    <div className="text-sm font-mono text-foreground/60">MetaHeat Visualizer</div>
                    <div className="text-sm font-mono text-success">LIVE</div>
                  </div>
                  
                  {/* Heat map grid */}
                  <div className="grid grid-cols-4 gap-2 h-[calc(100%-40px)]">
                    {/* Row 1 */}
                    <div className="heat-cell bg-gradient-to-br from-accent/30 to-accent/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$BONK</div>
                      <div className="text-xl font-bold text-accent">92</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-warning/30 to-warning/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$POPCAT</div>
                      <div className="text-xl font-bold text-warning">76</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-primary/30 to-primary/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$SLERF</div>
                      <div className="text-xl font-bold text-primary">65</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-destructive/30 to-destructive/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$PUFF</div>
                      <div className="text-xl font-bold text-destructive">23</div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="heat-cell bg-gradient-to-br from-warning/30 to-warning/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$BOOK</div>
                      <div className="text-xl font-bold text-warning">78</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-primary/30 to-primary/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$COPILOT</div>
                      <div className="text-xl font-bold text-primary">67</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-destructive/30 to-destructive/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$NOPE</div>
                      <div className="text-xl font-bold text-destructive">31</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-secondary/30 to-secondary/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$DOGGO</div>
                      <div className="text-xl font-bold text-secondary">84</div>
                    </div>

                    {/* Row 3 */}
                    <div className="heat-cell bg-gradient-to-br from-secondary/30 to-secondary/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$WIF</div>
                      <div className="text-xl font-bold text-secondary">82</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-accent/30 to-accent/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$MOCHI</div>
                      <div className="text-xl font-bold text-accent">91</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-warning/30 to-warning/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$SIMBA</div>
                      <div className="text-xl font-bold text-warning">74</div>
                    </div>
                    <div className="heat-cell bg-gradient-to-br from-primary/30 to-primary/10 rounded p-2 flex flex-col justify-between">
                      <div className="text-xs font-mono">$MMCC</div>
                      <div className="text-xl font-bold text-primary">63</div>
                    </div>
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
