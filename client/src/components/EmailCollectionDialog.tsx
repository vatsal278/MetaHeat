import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EmailCollectionDialogProps {
  walletAddress: string | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function EmailCollectionDialog({ 
  walletAddress, 
  isOpen, 
  onClose, 
  onComplete 
}: EmailCollectionDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "No wallet connected. Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit email along with wallet address
      const response = await apiRequest<{ success: boolean; message: string }>({
        url: "/api/wallet/connect",
        method: "POST",
        data: { 
          walletAddress,
          email: email.trim()
        }
      });
      
      toast({
        title: "Success!",
        description: "Your email has been submitted for early access updates.",
        variant: "default",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error submitting email:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSkip = () => {
    toast({
      title: "Skipped",
      description: "You can provide your email later for project updates.",
      variant: "default",
    });
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card/70 backdrop-blur-md border border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-display">Get Early Access Updates</DialogTitle>
          <DialogDescription className="text-foreground/70">
            Enter your email to receive updates about the MetaHeat Engine launch and early access opportunities.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-primary/30 focus:border-primary"
            />
            <p className="text-xs text-foreground/60">
              We'll never share your email with anyone else.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Email"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSkip}
              className="border-primary/30 hover:bg-primary/10"
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}