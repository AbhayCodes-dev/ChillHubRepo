import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Copy, 
  Check, 
  Trash2,
  RefreshCw,
  Sparkles,
  Zap
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <RefreshCw size={size === "xs" ? 14 : size === "sm" ? 16 : size === "md" ? 20 : 24} />
    </div>
  );
};

const AIChatPage = () => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isCopied, setIsCopied] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const currentScrollY = chatContainerRef.current.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const aiMutation = useMutation({
    mutationFn: async ({ prompt }) => {
      const res = await fetch("http://localhost:5000/api/ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "AI Error");
      return data.result;
    },
    onSuccess: (data) => {
      setConversation((prev) => [
        ...prev,
        { type: "ai", content: data || "No response received." },
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
      setConversation((prev) => [
        ...prev,
        {
          type: "ai",
          content: "Sorry, I encountered an error. Please try again.",
          error: true,
        },
      ]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || aiMutation.isPending) {
      return;
    }

    setConversation((prev) => [...prev, { type: "user", content: prompt }]);
    aiMutation.mutate({ prompt });
    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(index);
      setTimeout(() => setIsCopied(null), 2000);
      toast.success("Copied to clipboard");
    });
  };

  const clearConversation = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setConversation([]);
      toast.success("Chat cleared");
    }
  };

  // Generate entertainment-focused quick response suggestions
  const quickResponses = [
    "What's trending in movies right now?",
    "Recommend a good TV show to binge",
    "Tell me about upcoming music releases"
  ];

  const handleQuickResponse = (text) => {
    setPrompt(text);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-[4_4_0] mr-auto min-h-screen bg-gray-950">
      {/* Animated Header */}
      <div 
        className={`sticky transition-transform duration-300 ${
          showHeader ? "top-0 translate-y-0" : "-translate-y-full"
        } z-10 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 shadow-lg`}
      >
        {/* Brand header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-500 to-pink-600 p-2 rounded-lg">
              <Zap className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
                Chats
              </h1>
              <p className="text-xs text-gray-400 font-medium">Your entertainment companion</p>
            </div>
          </div>
          
          <div>
            <button 
              onClick={clearConversation}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                conversation.length === 0 
                ? "bg-gray-800/50 text-gray-500 cursor-not-allowed" 
                : "bg-gray-800 hover:bg-gray-700 text-white"
              }`}
              disabled={conversation.length === 0}
            >
              <Trash2 size={16} className={conversation.length === 0 ? "text-gray-500" : "text-red-400"} />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative px-4 pt-6 h-[calc(100vh-85px)] flex flex-col">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/5 via-purple-900/5 to-transparent pointer-events-none" />

        <div className="flex flex-col h-full">
          {/* Chat Messages Container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto bg-gray-900/30 rounded-xl border border-gray-800 p-4 mb-4"
          >
            {conversation.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="relative">
                  <div className="absolute -inset-6 bg-pink-500/10 rounded-full blur-xl animate-pulse"></div>
                  <Sparkles className="text-6xl mb-4 text-pink-500/70" />
                </div>
                <p className="text-center font-medium text-lg text-white mb-2">
                  Let's talk entertainment!
                </p>
                <p className="text-sm mt-2 text-center max-w-md">
                  Ask me about movies, TV shows, music, or fun activities!
                </p>
                
                {/* Quick response chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
                  {quickResponses.map((text, index) => (
                    <button 
                      key={index}
                      onClick={() => handleQuickResponse(text)}
                      className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 py-2 px-4 rounded-full text-sm transition-all"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl relative group ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
                          : message.error
                          ? "bg-red-900/30 border border-red-700"
                          : "bg-gray-800/80 backdrop-blur-sm border border-gray-700"
                      } ${
                        message.type === "user" 
                          ? "rounded-tr-sm" 
                          : "rounded-tl-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.type === "ai" && (
                          <Bot size={18} className="text-pink-400 mt-1 flex-shrink-0" />
                        )}
                        <p className="whitespace-pre-wrap text-sm sm:text-base">
                          {message.content}
                        </p>
                      </div>

                      {message.type === "ai" && (
                        <button
                          onClick={() => copyToClipboard(message.content, index)}
                          className="absolute bottom-2 right-2 p-1.5 bg-gray-700/70 hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition"
                          title="Copy to clipboard"
                        >
                          {isCopied === index ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {aiMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 p-3 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-2 items-center">
                        <Bot size={18} className="text-pink-400" />
                        <div className="flex space-x-1">
                          <span className="h-2 w-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="mb-6">
            <form
              onSubmit={handleSubmit}
              className="relative"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about movies, shows, or music..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-4 px-5 pr-12 bg-gray-800/80 text-white rounded-full border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition backdrop-blur-sm"
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={aiMutation.isPending || !prompt.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all ${
                  !prompt.trim() || aiMutation.isPending
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/20"
                }`}
                aria-label="Send message"
              >
                {aiMutation.isPending ? (
                  <LoadingSpinner size="xs" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;