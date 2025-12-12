import { useState } from "react";
import { Send, Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, disabled = false, placeholder = "Type a message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
        />
        
        <button
          type="button"
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
