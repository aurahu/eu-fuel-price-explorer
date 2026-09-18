import { ReactNode } from "react";

type PillProps = {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

export default function Pill({
  children,
  variant = "default",
  className ="",
}: PillProps) {
  const variants = {
    default: "bg-background text-foreground",
    outline: "bg-none border border-foreground text-foreground",
    ghost: "bg-none text-sm font-normal! md:text-base py-0! px-0!",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-base uppercase font-semibold tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}