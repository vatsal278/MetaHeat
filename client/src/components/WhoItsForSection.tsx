import { motion } from "framer-motion";
import { TrendingUp, Building2, Lightbulb, ShieldCheck } from "lucide-react";
import { WalletConnectButton } from "./WalletConnectButton";

interface WhoItsForSectionProps {
  isConnected: boolean;
  onConnect: () => void;
}

export const WhoItsForSection = ({ isConnected, onConnect }: WhoItsForSectionProps) => {
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
    <section id="who-its-for" className="py-16 md:py-24 bg-gradient-to-b from-card/40 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Who It's <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">For</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div 
            className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full"
            variants={item}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold font-display mb-2 text-foreground">Solana Meme Coin Traders</h3>
                <p className="text-foreground/70">Traders who want to front-run meta rotations and position themselves for maximum gains before the crowd arrives.</p>
                
                <div className="mt-4 flex items-center text-sm text-secondary">
                  <span className="font-mono">Benefit:</span>
                  <span className="ml-2 text-foreground/80">Early positioning in trending narratives before price explosion</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full"
            variants={item}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-secondary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold font-display mb-2 text-foreground">Token Builders & Launchers</h3>
                <p className="text-foreground/70">Project creators looking for optimal timing and themes to launch their tokens for maximum impact and adoption.</p>
                
                <div className="mt-4 flex items-center text-sm text-secondary">
                  <span className="font-mono">Benefit:</span>
                  <span className="ml-2 text-foreground/80">Strategic timing and alignment with emerging narratives</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full"
            variants={item}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-accent" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold font-display mb-2 text-foreground">Researchers & Alpha Hunters</h3>
                <p className="text-foreground/70">Market researchers and crypto Twitter (CT) alpha hunters seeking quantifiable data to support their analysis and calls.</p>
                
                <div className="mt-4 flex items-center text-sm text-secondary">
                  <span className="font-mono">Benefit:</span>
                  <span className="ml-2 text-foreground/80">Data-driven insights to validate theories and gain edge</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-6 neon-border h-full"
            variants={item}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-warning" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold font-display mb-2 text-foreground">Smart Money & Anti-Exit Liquidity</h3>
                <p className="text-foreground/70">Anyone tired of being exit liquidity in pump and dumps. Smart money that wants to be ahead of retail and safely positioned.</p>
                
                <div className="mt-4 flex items-center text-sm text-secondary">
                  <span className="font-mono">Benefit:</span>
                  <span className="ml-2 text-foreground/80">Early warning system for exit traps and declining narratives</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Early access  */}
        <motion.div 
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 bg-card/20 rounded-lg p-8 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full md:w-1/3 max-w-xs">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent blur-md opacity-70 animate-glow rounded-lg"></div>
              <div className="relative aspect-square rounded-lg overflow-hidden border border-primary/40">
                <div className="absolute inset-0 bg-card/40 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-foreground/60 font-mono">EARLY ACCESS</div>
                    <div className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">META<br/>HUNTER<br/></div>
                    <div className="mt-4 text-xs font-mono text-foreground/60">#0001</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 md:max-w-lg text-center md:text-left">
            <h3 className="text-2xl font-bold font-display text-foreground mb-4">Get Early Access </h3>
            <p className="text-foreground/80 mb-6">Connect your wallet to secure priority access to the MetaHeat Engine. Early supporters receive exclusive features and benefits when we launch.</p>
            <WalletConnectButton 
              id="-wallet-connect"
              isConnected={isConnected}
              onConnect={onConnect}
              variant="accent"
              label="Claim Early Access"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
