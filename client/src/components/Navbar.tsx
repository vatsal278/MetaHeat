import { useState, useEffect } from "react";
import { Link } from "wouter";
import { WalletConnectButton } from "./WalletConnectButton";
import { useWallet } from "@/hooks/use-wallet";
import { Menu, X, Layers } from "lucide-react";

interface NavbarProps {
  onConnect?: () => Promise<void>;
}

export const Navbar = ({ onConnect }: NavbarProps) => {
  const { isConnected, connect } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use the provided onConnect function if available, otherwise use the default connect
  const handleConnect = onConnect || connect;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-primary/20' : 'bg-transparent'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <span className="text-xl font-bold font-display">MetaHeat</span>
                <span className="text-xl font-medium font-display">Engine</span>
              </div>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#what-it-is" className="font-medium text-foreground/70 hover:text-foreground transition duration-150 ease-in-out glow-on-hover">
              What It Is
            </a>
            <a href="#how-it-works" className="font-medium text-foreground/70 hover:text-foreground transition duration-150 ease-in-out glow-on-hover">
              How It Works
            </a>
            <a href="#who-its-for" className="font-medium text-foreground/70 hover:text-foreground transition duration-150 ease-in-out glow-on-hover">
              Who It's For
            </a>
            <a href="#roadmap" className="font-medium text-foreground/70 hover:text-foreground transition duration-150 ease-in-out glow-on-hover">
              Roadmap
            </a>
            <Link 
              href="/beta" 
              className="font-medium text-accent-foreground bg-accent/90 hover:bg-accent px-3 py-1 rounded-md transition duration-150 ease-in-out flex items-center"
            >
              Beta
            </Link>
            
            {/* Admin link - only visible when wallet is connected */}
            {isConnected && (
              <Link 
                href="/admin" 
                className="font-medium text-primary hover:text-primary/80 transition duration-150 ease-in-out glow-on-hover flex items-center"
              >
                <Layers size={16} className="mr-1" />
                Admin
              </Link>
            )}
          </div>
          
          <div className="flex items-center">
            <WalletConnectButton 
              isConnected={isConnected} 
              onConnect={handleConnect} 
              variant="default"
              className="hidden md:block" 
            />
            
            <button 
              className="md:hidden p-2 rounded-md text-foreground focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-primary/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#what-it-is"
              className="block px-3 py-2 rounded-md text-foreground font-medium hover:bg-primary/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              What It Is
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 rounded-md text-foreground font-medium hover:bg-primary/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#who-its-for"
              className="block px-3 py-2 rounded-md text-foreground font-medium hover:bg-primary/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Who It's For
            </a>
            <a
              href="#roadmap"
              className="block px-3 py-2 rounded-md text-foreground font-medium hover:bg-primary/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roadmap
            </a>
            <Link 
              href="/beta" 
              className="flex items-center px-3 py-2 rounded-md bg-accent/90 text-accent-foreground font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beta
            </Link>
            
            {/* Admin link - only visible when wallet is connected */}
            {isConnected && (
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-2 rounded-md text-accent font-medium hover:bg-primary/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Layers size={16} className="mr-1" />
                Admin
              </Link>
            )}
            
            <div className="mt-4 px-3">
              <WalletConnectButton 
                isConnected={isConnected} 
                onConnect={handleConnect} 
                variant="default"
                className="w-full" 
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
