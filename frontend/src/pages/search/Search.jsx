import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Film, 
  ThumbsUp, 
  User, 
  BadgeCheck, 
  Popcorn, 
  ArrowRight,
  Clapperboard
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CinematicSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "drama", "action", "Christopher Nolan"
  ]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Save to recent searches
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        {
          _id: "1",
          username: "moviebuff",
          profileImg: "",
          bio: "Film enthusiast and critic",
          favoriteGenres: ["Action", "Sci-Fi"],
          reviewCount: 42,
          isVerified: true
        },
        {
          _id: "2",
          username: "cinemalover",
          profileImg: "",
          bio: "Director wannabe with a passion for storytelling",
          favoriteGenres: ["Drama", "Thriller"],
          reviewCount: 28,
          isVerified: false
        }
      ];
      
      setResults(mockUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) || 
        user.bio.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="flex-[4_4_0] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Glass-morphic Header - Keeping original background but enhancing style */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800/90 backdrop-blur-sm border-b border-yellow-500/20 p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <Clapperboard className="text-yellow-400 h-6 w-6" strokeWidth={1.5} />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
              Chill - Search
            </h1>
          </div>
          
          {results.length > 0 && (
            <motion.button 
              onClick={clearSearch}
              className="text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <X size={16} />
              <span className="text-sm">Clear</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-5xl mx-auto p-6">
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex gap-3 items-center">
            <div className="flex-1 group">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-yellow-400 opacity-70 group-hover:opacity-100 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for movie fans, directors, critics..."
                  className="w-full py-3 pl-12 pr-12 bg-gray-800 border-2 border-gray-700 focus:border-yellow-400 rounded-xl outline-none placeholder-gray-500 transition-all duration-300"
                />
                {query && (
                  <button 
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-200 transition-colors" />
                  </button>
                )}
              </div>
            </div>
            <motion.button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-yellow-500/20 font-medium transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Search</span>
              <Search size={18} />
            </motion.button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && query === "" && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Film size={14} />
                <span>Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-300 hover:text-yellow-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <div className="mt-6 pb-8">
          <AnimatePresence>
            {loading && (
              <motion.div 
                className="flex justify-center items-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner size="lg" />
              </motion.div>
            )}

            {!loading && results.length === 0 && query.trim() !== "" && (
              <motion.div 
                className="flex flex-col items-center justify-center py-16 text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Film className="h-16 w-16 text-yellow-400 mb-4" strokeWidth={1.5} />
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm mt-2 text-gray-500">Try different search terms</p>
              </motion.div>
            )}

            {!loading && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-200">
                    Found <span className="text-yellow-400">{results.length}</span> results
                  </h2>
                </div>

                <div className="space-y-3">
                  {results.map((user) => (
                    <motion.div
                      key={user._id}
                      className="group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link 
                        to={`/profile/${user.username}`}
                        className="block p-4 bg-gray-800/70 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-400">
                              {user.profileImg ? (
                                <img 
                                  src={user.profileImg} 
                                  className="w-full h-full object-cover"
                                  alt={user.username}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="h-8 w-8 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-2 border border-yellow-400">
                              <User className="h-3 w-3 text-yellow-400" />
                            </div>
                            {user.isVerified && (
                              <div className="absolute top-0 -right-1 bg-yellow-400 rounded-full p-1">
                                <BadgeCheck className="h-3 w-3 text-gray-900" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-yellow-300 truncate">
                                @{user.username}
                              </h3>
                              {user.isVerified && (
                                <BadgeCheck className="h-4 w-4 text-yellow-400" />
                              )}
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-2">
                              {user.bio || "Movie enthusiast"}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {user.favoriteGenres?.map((genre, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-xs px-2 py-1 rounded-full bg-gray-700 text-yellow-400 border border-yellow-400"
                                >
                                  {genre}
                                </span>
                              ))}
                              {user.reviewCount && (
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>{user.reviewCount}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <motion.button 
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>View</span>
                            <Clapperboard className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CinematicSearch;