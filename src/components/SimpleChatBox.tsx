import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PATHS } from "@/paths";

interface SimpleChatBoxProps {
  className?: string;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
}

const SimpleChatBox = ({ className }: SimpleChatBoxProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your shopping assistant. How can I help you find the perfect outfit today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Generate a response after a short delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content:
          "Thanks for your message! Let me show you our products to help you find what you're looking for.",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Navigate to products page after showing the response
      setTimeout(() => {
        navigate(PATHS.products.root);
      }, 1500);
    }, 1000);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-[#1A1F2C] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700",
        className,
      )}
    >
      <div className="p-3 border-b border-gray-100 bg-gray-50 dark:bg-[#1A1F2C] dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          City Beach Shopping Assistant
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4 h-[320px] overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 max-w-[85%]",
                  message.type === "user"
                    ? "bg-[#0071e3] text-white rounded-2xl rounded-tr-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm",
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-white dark:bg-[#1A1F2C] border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2 relative">
          <Input
            placeholder="Message City Beach..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1 pr-10 py-3 rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="absolute right-1.5 rounded-full w-8 h-8 flex items-center justify-center bg-[#0071e3] hover:bg-[#0066cc]"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatBox;
