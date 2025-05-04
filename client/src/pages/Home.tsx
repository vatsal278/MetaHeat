import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { WhatItIsSection } from "@/components/WhatItIsSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { WhoItsForSection } from "@/components/WhoItsForSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { Footer } from "@/components/Footer";
import { EmailCollectionDialog } from "@/components/EmailCollectionDialog";
import { useWallet } from "@/hooks/use-wallet";

const Home = () => {
  const { isConnected, connect, publicKey } = useWallet();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [hasShownEmailDialog, setHasShownEmailDialog] = useState(false);

  // Initialize specialized connect function that will show email dialog after wallet connection
  const handleConnect = async () => {
    // Call the original connect function
    await connect();
    
    // We'll show the email dialog after the wallet is connected
    // The useEffect below will handle this
  };

  // Check when the wallet becomes connected to show the email dialog
  useEffect(() => {
    if (isConnected && !hasShownEmailDialog) {
      // Short delay to make sure the connection toast has time to show
      const timer = setTimeout(() => {
        setShowEmailDialog(true);
        setHasShownEmailDialog(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, hasShownEmailDialog]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onConnect={handleConnect} />
      <main className="flex-grow">
        <HeroSection isConnected={isConnected} onConnect={handleConnect} />
        <WhatItIsSection />
        <HowItWorksSection />
        <WhoItsForSection isConnected={isConnected} onConnect={handleConnect} />
        <RoadmapSection isConnected={isConnected} onConnect={handleConnect} />
        
        {/* Email Collection Dialog */}
        <EmailCollectionDialog
          walletAddress={publicKey}
          isOpen={showEmailDialog}
          onClose={() => setShowEmailDialog(false)}
          onComplete={() => setShowEmailDialog(false)}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
