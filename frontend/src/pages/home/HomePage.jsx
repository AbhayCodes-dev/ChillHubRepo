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

  // Handle scroll to hide/show header
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

  // Feed options with metadata for cleaner rendering
  const feedOptions = [
    { id: "latest", label: "For You", icon: <TrendingUp size={18} />, color: "text-blue-400", hoverColor: "hover:text-blue-300", borderColor: "border-blue-400" },
    { id: "following", label: "Following", icon: <Users size={18} />, color: "text-purple-400", hoverColor: "hover:text-purple-300", borderColor: "border-purple-400" },
    { id: "reviews", label: "Reviews", icon: <PenLine size={18} />, color: "text-green-400", hoverColor: "hover:text-green-300", borderColor: "border-green-400" },
    { id: "premium", label: "Premium", icon: <Star size={18} />, color: "text-amber-400", hoverColor: "hover:text-amber-300", borderColor: "border-amber-400" }
  ];

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
          
          <div>
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all">
              <Heart size={16} className="text-red-400" />
              <span>Favorites</span>
            </button>
          </div>
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
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-blue-900/5 to-transparent pointer-events-none" />

        {feedType === "reviews" ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800">
            <div className="bg-gray-800 p-4 rounded-full mb-6">
              <PenLine size={32} className="text-green-400" />
            </div>
            <p className="text-xl font-medium text-white mb-2">Review Section Coming Soon</p>
            <p className="text-sm max-w-md text-center text-gray-400">
              Share your thoughts on shows and movies with the community. Rate, review, and discover content based on authentic opinions.
            </p>
            <button className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all">
              Get Notified
            </button>
          </div>
        ) : feedType === "premium" ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800">
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-4 rounded-full relative">
                <Lock size={32} className="text-white" />
              </div>
            </div>
            <p className="text-xl font-medium text-white mt-6 mb-2">Premium Experience</p>
            <p className="text-sm max-w-md text-center text-gray-400">
              Unlock exclusive content, ad-free browsing, and early access to new features with Chill-Hub Premium.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 rounded-full text-white font-medium hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                Explore Premium
              </button>
              <button className="border border-gray-700 bg-gray-800/50 hover:bg-gray-800 px-6 py-2 rounded-full text-gray-300 font-medium transition-all">
                Learn More
              </button>
            </div>
          </div>
        ) : (
          <Posts feedType={feedType} />
        )}
      </div>

      {/* Floating Create Post Button - Using original CreatePost component */}
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