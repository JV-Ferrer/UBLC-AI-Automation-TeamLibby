interface QuickSuggestionProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const QuickSuggestion = ({ suggestions, onSelect }: QuickSuggestionProps) => {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 rounded-full glass-card text-sm text-foreground hover:border-primary/50 transition-all duration-200 hover:scale-105 opacity-0 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default QuickSuggestion;
