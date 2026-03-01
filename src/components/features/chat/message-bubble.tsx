import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: string;
  isOwn?: boolean;
  time?: string;
};

export function MessageBubble({ message, isOwn = false, time }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
        isOwn
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      <p>{message}</p>
      {time && <p className={cn("text-xs mt-1", isOwn ? "text-primary-foreground/80" : "text-muted-foreground")}>{time}</p>}
    </div>
  );
}
