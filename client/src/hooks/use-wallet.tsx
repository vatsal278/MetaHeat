import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: string }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  isConnected: boolean;
  publicKey?: string;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [phantomInstalled, setPhantomInstalled] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  // Check wallet connection on initial load
  useEffect(() => {
    const checkPhantomInstalled = () => {
      const isPhantomInstalled = window.solana && window.solana.isPhantom;
      setPhantomInstalled(!!isPhantomInstalled);
    };

    checkPhantomInstalled();

    // Check for connection status on initial load
    if (window.solana && window.solana.isConnected) {
      setIsConnected(true);
      if (window.solana.publicKey) {
        const walletAddress = window.solana.publicKey.toString();
        setPublicKey(walletAddress);
        registerWalletWithBackend(walletAddress);
      }
    }

    // Listen for connection events
    if (window.solana) {
      window.solana.on("connect", (publicKey: any) => {
        const walletAddress = publicKey.toString();
        setIsConnected(true);
        setPublicKey(walletAddress);
      });

      window.solana.on("disconnect", () => {
        setIsConnected(false);
        setPublicKey(null);
      });
    }
  }, []);

  // Register wallet with backend
  const registerWalletWithBackend = useCallback(async (walletAddress: string) => {
    if (!walletAddress || isRegistering) return;
    
    setIsRegistering(true);
    
    try {
      interface WalletResponse {
        success: boolean;
        message: string;
        isEarlyAccess: boolean;
      }
      
      const response = await apiRequest<WalletResponse>({
        url: "/api/wallet/connect",
        method: "POST",
        data: { walletAddress }
      });
      
      console.log("Wallet registered with backend:", response);
    } catch (error) {
      console.error("Error registering wallet with backend:", error);
    } finally {
      setIsRegistering(false);
    }
  }, [isRegistering]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!window.solana) {
      toast({
        title: "Phantom wallet not installed",
        description: "Please install the Phantom wallet extension to continue.",
        variant: "destructive",
      });
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      const { publicKey } = await window.solana.connect();
      const walletAddress = publicKey.toString();
      setIsConnected(true);
      setPublicKey(walletAddress);
      
      // Register the wallet with our backend
      await registerWalletWithBackend(walletAddress);
      
      toast({
        title: "Wallet connected",
        description: "You're now on the early access list!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to Phantom wallet. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, registerWalletWithBackend]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (!window.solana) return;

    try {
      await window.solana.disconnect();
      setIsConnected(false);
      setPublicKey(null);
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [toast]);

  return {
    isConnected,
    publicKey,
    phantomInstalled,
    connect,
    disconnect,
  };
};
