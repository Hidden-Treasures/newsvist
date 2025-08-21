import { cn } from "@/utils/utils";

type AvatarProps = {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
};

export function Avatar({ src, alt, fallback, className = "" }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 overflow-hidden",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? "avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-gray-600 text-sm">{fallback ?? "?"}</span>
      )}
    </div>
  );
}
