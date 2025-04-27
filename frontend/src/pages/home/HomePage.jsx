// components/HomePage.jsx
import { useState, useEffect } from "react";
import { 
  Film, 
  Theater, 
  Star, 
  Users, 
  PenLine, 
  Lock,
  Plus,
  TrendingUp,
  Heart 
} from "lucide-react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("latest");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const feedOptions = [
    { id: "latest", label: "For You", icon: <TrendingUp size={18} />, color: "text-blue-400", hoverColor: "hover:text-blue-300", borderColor: "border-blue-400" },
    { id: "following", label: "Following", icon: <Users size={18} />, color: "text-purple-400", hoverColor: "hover:text-purple-300", borderColor: "border-purple-400" },
    { id: "reviews", label: "Reviews", icon: <PenLine size={18} />, color: "text-green-400", hoverColor: "hover:text-green-300", borderColor: "border-green-400" },
    { id: "premium", label: "Premium", icon: <Star size={18} />, color: "text-amber-400", hoverColor: "hover:text-amber-300", borderColor: "border-amber-400" }
  ];

  // Premium Content Message Component
  const PremiumContentMessage = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 shadow-xl my-10 text-center">
      <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mb-6">
        <Lock className="text-amber-400" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Premium Content Locked</h2>
      <p className="text-gray-400 max-w-md mb-6">
        Unlock exclusive content, reviews, and recommendations from our curated selection 
        of premium features.
      </p>
      <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-amber-500/20">
        Upgrade to Premium
      </button>
      <p className="text-xs text-gray-500 mt-6">
        Cancel anytime. See terms and conditions for details.
      </p>
    </div>
  );

  return (
    <div className="flex-[4_4_0] mr-auto min-h-screen bg-gray-950">
      {/* Header */}
      <div 
        className={`sticky transition-transform duration-300 ${
          showHeader ? "top-0 translate-y-0" : "-translate-y-full"
        } z-10 bg-gray-950/90 backdrop-blur-md border-b border-gray-800 shadow-lg`}
      >
        {/* Brand header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-amber-500 to-purple-600 p-2 rounded-lg">
              <Theater className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500">
                Chill-Hub
              </h1>
              <p className="text-xs text-gray-400 font-medium">Connect • Watch • Share</p>
            </div>
          </div>
          
          {/* Removed the Favorites Button */}
        </div>

        {/* Feed Selector */}
        <div className="flex px-4">
          {feedOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFeedType(option.id)}
              className={`py-3 px-6 flex items-center justify-center gap-2 transition-all ${
                feedType === option.id
                  ? `${option.color} border-b-2 ${option.borderColor} font-medium`
                  : `text-gray-400 ${option.hoverColor} hover:bg-gray-900/50`
              }`}
            >
              {option.icon}
              <span className="text-sm whitespace-nowrap">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative px-4 pt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-blue-900/5 to-transparent pointer-events-none" />
        
        {/* Show premium message or posts based on feedType */}
        {feedType === "premium" ? (
          <PremiumContentMessage />
        ) : (
          <Posts feedType={feedType} />
        )}
      </div>

      {/* Floating Create Post Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="relative group">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          <CreatePost />
        </div>
      </div>
    </div>
  );
};

export default HomePage;