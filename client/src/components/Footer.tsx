import { Twitter, Github, MessageSquare } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-12 bg-card/40 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <span className="text-2xl font-bold font-display">MetaHeat</span>
                <span className="text-2xl font-medium font-display">Engine</span>
              </div>
            </div>
            <p className="text-foreground/60 text-sm mt-2 text-center md:text-left">Predict the Meta, Don't Follow It</p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground/60 hover:text-secondary transition duration-150 ease-in-out"
              aria-label="Twitter"
            >
              <Twitter className="h-6 w-6" />
            </a>
            
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground/60 hover:text-secondary transition duration-150 ease-in-out"
              aria-label="Discord"
            >
              <MessageSquare className="h-6 w-6" />
            </a>
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground/60 hover:text-secondary transition duration-150 ease-in-out"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">© {new Date().getFullYear()} MetaHeat Engine. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a 
              href="#" 
              className="text-foreground/60 hover:text-secondary text-sm transition duration-150 ease-in-out"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-foreground/60 hover:text-secondary text-sm transition duration-150 ease-in-out"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
