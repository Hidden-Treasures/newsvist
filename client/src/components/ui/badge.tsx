import { cn } from "@/utils/utils";

type BadgeProps = {
  children: React.ReactNode;
  color?: "gray" | "blue" | "green" | "red";
  className?: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export function Badge({
  children,
  color = "gray",
  className,
  variant = "default",
}: BadgeProps) {
  const colors: Record<string, string> = {
    default: "bg-gray-200 text-gray-800",
    secondary: "bg-gray-100 text-gray-600",
    outline: "border border-gray-300 text-gray-800 bg-transparent",
    destructive: "bg-red-100 text-red-800",
  };

  const variants: Record<string, string> = {
    default: "",
    secondary: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-medium rounded-full",
        colors[color],
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
