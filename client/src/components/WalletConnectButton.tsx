import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WalletConnectButtonProps {
  isConnected: boolean;
  onConnect: () => void;
  variant?: "default" | "primary" | "accent" | "gradient" | "success";
  size?: "default" | "sm" | "lg";
  label?: string;
  id?: string;
  className?: string;
}

export const WalletConnectButton = ({
  isConnected,
  onConnect,
  variant = "default",
  size = "default",
  label,
  id,
  className,
}: WalletConnectButtonProps) => {
  const getButtonClasses = () => {
    if (isConnected) {
      return "bg-success text-success-foreground hover:bg-success/90";
    }

    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground font-bold shadow-lg shadow-primary/20";
      case "accent":
        return "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-foreground font-bold shadow-lg";
      case "gradient":
        return "bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-foreground font-bold shadow-lg shadow-primary/20";
      default:
        return "wallet-connect-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-foreground font-medium";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1.5 px-3 text-sm";
      case "lg":
        return "py-3 px-6";
      default:
        return "py-2 px-4";
    }
  };

  const buttonText = isConnected 
    ? "Wallet Connected" 
    : label || "Connect Wallet";

  return (
    <Button
      id={id}
      className={cn(
        "wallet-connect-button rounded-md transition duration-200 ease-in-out transform hover:scale-105",
        getButtonClasses(),
        getSizeClasses(),
        className
      )}
      onClick={onConnect}
    >
      {buttonText}
    </Button>
  );
};
