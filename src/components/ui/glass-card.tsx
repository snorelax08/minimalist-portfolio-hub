import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "strong";
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = true, ...props }, ref) => {
    const variants = {
      default: "bg-card/30 backdrop-blur-2xl border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-foreground/[0.08] before:to-transparent before:pointer-events-none",
      subtle: "bg-card/20 backdrop-blur-xl border-border/30 shadow-[0_4px_24px_rgba(0,0,0,0.08)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-foreground/[0.04] before:to-transparent before:pointer-events-none",
      strong: "bg-card/50 backdrop-blur-3xl border-border/50 shadow-[0_16px_48px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-foreground/[0.12] before:to-transparent before:pointer-events-none",
    };

    const hoverClass = hover
      ? "hover:bg-card/40 hover:border-border/60 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] hover:before:from-foreground/[0.12] transition-all duration-500"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border overflow-hidden",
          variants[variant],
          hoverClass,
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
