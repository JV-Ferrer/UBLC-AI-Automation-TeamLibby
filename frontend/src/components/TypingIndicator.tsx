import Mascot from "./Mascot";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in-up">
      <div className="flex-shrink-0">
        <Mascot size="sm" className="w-10 h-10" />
      </div>
      <div className="chat-bubble-assistant flex items-center gap-1 py-4">
        <span className="w-2 h-2 rounded-full bg-primary animate-typing-1"></span>
        <span className="w-2 h-2 rounded-full bg-primary animate-typing-2"></span>
        <span className="w-2 h-2 rounded-full bg-primary animate-typing-3"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
