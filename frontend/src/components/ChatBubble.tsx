import { ThumbsUp, ThumbsDown, Copy, RotateCcw } from "lucide-react";
import Mascot from "./Mascot";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  showActions?: boolean;
}

const ChatBubble = ({ message, isUser, timestamp, showActions = true }: ChatBubbleProps) => {
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-fade-in-up`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <Mascot size="sm" className="w-10 h-10" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-assistant"}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        
        {!isUser && showActions && (
          <div className="flex items-center gap-2 mt-1 px-1">
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ThumbsDown className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
        
        {timestamp && (
          <span className="text-xs text-muted-foreground px-1">{timestamp}</span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
