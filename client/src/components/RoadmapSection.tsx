import { motion } from "framer-motion";
import { WalletConnectButton } from "./WalletConnectButton";

interface RoadmapSectionProps {
  isConnected: boolean;
  onConnect: () => void;
}

export const RoadmapSection = ({ isConnected, onConnect }: RoadmapSectionProps) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="roadmap" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Development <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Roadmap</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto mt-4"></div>
        </motion.div>
        
        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-card transform -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {/* Phase 1 */}
            <motion.div 
              className="flex flex-col md:flex-row items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 mt-8 md:mt-0">
                <h3 className="text-2xl font-bold font-display text-foreground mb-2">Phase 1: UI Site</h3>
                <p className="text-foreground/70 mb-4">Launch of the landing page and beta access sign-up for early supporters.</p>
                <div className="inline-block bg-success/20 rounded-full px-3 py-1 text-sm font-mono text-success">CURRENT PHASE</div>
              </div>
              
              <div className="md:w-1/2 flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-success flex items-center justify-center z-10 relative">
                    <span className="text-background font-bold">1</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-success/30 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
            
            {/* Phase 2 */}
            <motion.div 
              className="flex flex-col md:flex-row items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="md:w-1/2 flex justify-center order-1">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-card border-2 border-primary flex items-center justify-center z-10 relative">
                    <span className="text-primary font-bold">2</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 md:pl-12 order-2 mt-8 md:mt-0">
                <h3 className="text-2xl font-bold font-display text-foreground mb-2">Phase 2: AI Engine Launch</h3>
                <p className="text-foreground/70 mb-4">Deployment of the core AI engine with Meta Heat Scoring and basic narrative detection.</p>
                <div className="inline-block bg-primary/20 rounded-full px-3 py-1 text-sm font-mono text-primary">COMING SOON</div>
              </div>
            </motion.div>
            
            {/* Phase 3 */}
            <motion.div 
              className="flex flex-col md:flex-row items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 mt-8 md:mt-0">
                <h3 className="text-2xl font-bold font-display text-foreground mb-2">Phase 3: Full Dashboard + Tools</h3>
                <p className="text-foreground/70 mb-4">Complete platform with advanced visualization, predictive tools, and real-time notification system.</p>
                <div className="inline-block bg-card rounded-full px-3 py-1 text-sm font-mono text-foreground/60">IN DEVELOPMENT</div>
              </div>
              
              <div className="md:w-1/2 flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-card border-2 border-foreground/30 flex items-center justify-center z-10 relative">
                    <span className="text-foreground/60 font-bold">3</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Join Beta */}
        <motion.div 
          className="mt-20 max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-6">Ready to Predict the Next Meta?</h3>
          <p className="text-lg text-foreground/80 mb-8">Connect your wallet now to secure your place in our exclusive beta program and gain early access to the most powerful trading tool in the Solana ecosystem.</p>
          
          <WalletConnectButton 
            id="final-wallet-connect"
            isConnected={isConnected} 
            onConnect={onConnect} 
            variant="gradient"
            size="lg"
            label="Get Beta Access Now – Connect Wallet"
            className="text-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};
