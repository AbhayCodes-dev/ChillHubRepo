import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  User,
  LogOut,
  MessageSquare,
  Film,
  Tv,
  BookOpen,
  Sparkles,
  Bot,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [hoverCount, setHoverCount] = useState(0);
  const [easterEggVisible, setEasterEggVisible] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("See you space cowboy...", {
        icon: "🚀",
        style: {
          background: "#1F2937",
          color: "#F3F4F6",
          border: "1px solid #374151",
        },
      });
    },
    onError: () => {
      toast.error("I'm afraid I can't let you do that", {
        icon: "🔴",
      });
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleLogoClick = () => {
    setHoverCount((prev) => prev + 1);
    if (hoverCount === 5) {
      setEasterEggVisible(true);
      toast.success("You found a secret portal!", {
        icon: "✨",
        style: {
          background: "linear-gradient(135deg, #6366F1, #EC4899)",
          color: "white",
        },
      });
      setTimeout(() => setEasterEggVisible(false), 3000);
      setHoverCount(0);
    }
  };

  const navItems = [
    {
      to: "/",
      icon: <Home className="w-4 h-4" />,
      label: "Home",
      bgClass: "from-blue-600/20 to-blue-700/20",
    },
    {
      to: "/search",
      icon: <Search className="w-4 h-4" />,
      label: "Discover",
      bgClass: "from-indigo-600/20 to-indigo-700/20",
    },
    {
      to: "/notifications",
      icon: <Bell className="w-4 h-4" />,
      label: "Updates",
      bgClass: "from-purple-600/20 to-purple-700/20",
    },
    {
      to: "/ai",
      icon: <Bot className="w-4 h-4" />,
      label: "AI Chat",
      bgClass: "from-emerald-600/20 to-emerald-700/20",
    },
    {
      to: `/profile/${authUser?.username}`,
      icon: <User className="w-4 h-4" />,
      label: "My Portal",
      bgClass: "from-red-600/20 to-red-700/20",
    },
  ];

  // Entertainment categories
  const categories = [
    {
      icon: <Film className="w-4 h-4" />,
      label: "Movies",
      to: "/suggestions/movies",
    },
    {
      icon: <Tv className="w-4 h-4" />,
      label: "Series",
      to: "/suggestions/series",
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Anime",
      to: "/suggestions/anime",
    },
  ];

  return (
    <motion.div
      className="md:w-64 w-16 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-purple-900/30 backdrop-blur-lg"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="sticky top-0 left-0 h-screen flex flex-col p-3">
        {/* Logo with Easter Egg */}
        <motion.div
          whileHover={{
            scale: 1.05,
            rotate: hoverCount > 0 ? [0, 5, -5, 0] : 0,
          }}
          className="mb-6 flex justify-center"
          onClick={handleLogoClick}
        >
          <Link to="/">
            {easterEggVisible ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="relative w-12 h-12"
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover shadow-xl border-2 border-purple-500 absolute"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse mix-blend-overlay"></div>
              </motion.div>
            ) : (
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-purple-400"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </Link>
        </motion.div>

        {/* Navigation */}
        <ul className="flex flex-col gap-2 flex-grow">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <motion.li
                key={index}
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
              >
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-l-2 border-pink-400 shadow-md"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30"
                        : `bg-gradient-to-br ${item.bgClass}`
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="hidden md:block font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              </motion.li>
            );
          })}

          {/* Categories Section */}
          <div className="mt-6 mb-2">
            <h3 className="text-xs font-semibold text-gray-400 px-3 hidden md:block">
              Hot Right Now
            </h3>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-2 hidden md:block"></div>
          </div>

          {categories.map((category, index) => (
            <motion.li
              key={`category-${index}`}
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
              }}
            >
              <Link
                to={category.to}
                className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all ${
                  location.pathname === category.to
                    ? "bg-gradient-to-r from-indigo-600/20 to-pink-600/20 text-pink-300 border-l-2 border-indigo-400 shadow-md"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    location.pathname === category.to
                      ? "bg-gradient-to-br from-indigo-500/30 to-pink-500/30"
                      : "bg-gray-800/60"
                  }`}
                >
                  {category.icon}
                </div>
                <span className="hidden md:block font-medium text-sm">
                  {category.label}
                </span>
              </Link>
            </motion.li>
          ))}

          {/* Premium Section */}
          <motion.li
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mt-4"
          >
            <Link
              to="/premium"
              className="flex items-center gap-3 w-full p-2 rounded-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/30 to-yellow-500/30 group-hover:opacity-100 opacity-80 transition-opacity"></div>
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/50 to-yellow-500/50 relative z-10">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <span className="hidden md:block font-medium text-sm relative z-10 text-yellow-300">
                Legendary Pass
              </span>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-yellow-500/10 animate-pulse"></div>
            </Link>
          </motion.li>
        </ul>

        {/* User Profile */}
        {authUser && (
          <motion.div
            className="mt-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-3 border border-purple-800/30 backdrop-blur-sm shadow-lg overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/universe-bg.png')] opacity-10 bg-cover bg-center"></div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-pink-400"
                  src={authUser?.profileImg || "/avatar-placeholder.png"}
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm">
                  {authUser?.fullName}
                </p>
                <p className="text-pink-300 text-xs">@{authUser?.username}</p>
              </div>
            </div>

            <motion.button
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-medium rounded-lg transition-all relative overflow-hidden group"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden md:inline text-xs">End Session</span>
              <div className="absolute top-0 right-0 w-12 h-full bg-white/10 skew-x-12 transform transition-transform group-hover:translate-x-20 duration-700 ease-in-out"></div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;