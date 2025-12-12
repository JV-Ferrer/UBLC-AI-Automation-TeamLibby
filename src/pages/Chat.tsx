import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Square } from "lucide-react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import QuickSuggestion from "@/components/QuickSuggestion";
import BottomNav from "@/components/BottomNav";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Libby, your UBLC Library assistant. How can I help you today?",
      isUser: false,
      timestamp: "Today, 09:00 AM",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "📚 Search for books",
    "🕐 Library hours",
    "📖 Borrowing rules",
    "🚪 Book a room",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hour") || lowerMessage.includes("open") || lowerMessage.includes("time")) {
      return "📚 **Library Hours**\n\nMonday - Friday: 7:00 AM - 7:00 PM\nSaturday: 8:00 AM - 5:00 PM\nSunday: Closed\n\nNote: Hours may vary during holidays and exam periods. Would you like me to check anything else?";
    }
    
    if (lowerMessage.includes("borrow") || lowerMessage.includes("loan") || lowerMessage.includes("return")) {
      return "📖 **Borrowing Rules**\n\n• Students can borrow up to 3 books at a time\n• Loan period is 7 days\n• Overdue fine: ₱5.00 per day\n• Reference materials are for in-library use only\n\nDo you need help with anything else?";
    }
    
    if (lowerMessage.includes("book") || lowerMessage.includes("search") || lowerMessage.includes("find")) {
      return "🔍 I can help you search for books! Just tell me:\n\n1. The title or author name\n2. The subject area\n3. Or any keywords\n\nWhat book are you looking for?";
    }
    
    if (lowerMessage.includes("room") || lowerMessage.includes("discussion") || lowerMessage.includes("study")) {
      return "🚪 **Discussion Room Booking**\n\nWe have 5 discussion rooms available:\n\n• Room A (4 persons) - Available\n• Room B (6 persons) - Available\n• Room C (8 persons) - Occupied until 3 PM\n• Room D (4 persons) - Available\n• Room E (10 persons) - Available\n\nWould you like to book one?";
    }
    
    return "I'm here to help with library services! You can ask me about:\n\n📚 Book searches\n🕐 Library hours\n📖 Borrowing rules\n🚪 Discussion room bookings\n\nWhat would you like to know?";
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsGenerating(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsTyping(false);

    const response = generateResponse(content);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  const handleStopGenerating = () => {
    setIsTyping(false);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass-card rounded-none border-x-0 border-t-0 p-4 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => navigate("/home")}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Chat with Libby</h1>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors">
          <MoreHorizontal className="w-6 h-6 text-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-48 space-y-6">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
            showActions={!message.isUser}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Stop Generating Button */}
      {isGenerating && (
        <div className="fixed bottom-44 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleStopGenerating}
            className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-sm text-foreground hover:border-destructive/50 transition-colors"
          >
            <Square className="w-4 h-4 text-destructive" />
            Stop Generate
          </button>
        </div>
      )}

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="fixed bottom-36 left-0 right-0 px-4 z-10">
          <QuickSuggestion suggestions={quickSuggestions} onSelect={handleSend} />
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <ChatInput
          onSend={handleSend}
          disabled={isTyping}
          placeholder="Ask me anything about the library..."
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
