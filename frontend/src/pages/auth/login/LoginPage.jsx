import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { MdPerson, MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash, FaFilm, FaMusic, FaGamepad } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Expanded movie/anime quotes with emojis
const quotes = [
  { text: "Why so serious? 🤡", size: 15 },
  { text: "I am Groot 🌱", size: 14 },
  { text: "Winter is coming ❄️", size: 14 },
  { text: "Wakanda Forever! ✊", size: 18 },
  { text: "You shall not pass! 🧙", size: 16 },
  { text: "I'm Batman 🦇", size: 18 },
  { text: "Avengers... assemble! 🛡️", size: 14 },
  { text: "Just keep swimming 🐠", size: 16 },
  { text: "To infinity and beyond! 🚀", size: 14 },
  { text: "I volunteer as tribute! 🏹", size: 15 },
  { text: "Hasta la vista, baby 🤖", size: 16 },
  { text: "You're a wizard, Harry! ⚡", size: 15 },
  { text: "I drink and I know things 🍷", size: 14 },
  { text: "This is Sparta! 🏛️", size: 20 },
  { text: "I'll be back 💀", size: 16 },
  { text: "May the Force be with you ✨", size: 14 },
  { text: "E.T. phone home 📞", size: 14 },
  { text: "Life finds a way 🦖", size: 16 },
  { text: "I'm king of the world! 🚢", size: 15 },
  { text: "Say hello to my little friend! 🔫", size: 13 },
  { text: "Elementary, my dear Watson 🕵️", size: 12 },
  { text: "Houston, we have a problem 🚀", size: 14 },
  { text: "You can't handle the truth! �", size: 16 },
  { text: "Keep your friends close... 🃏", size: 14 },
  { text: "I see dead people 👻", size: 16 },
  { text: "My precious! 💍", size: 18 },
  { text: "Bond. James Bond. 🍸", size: 16 },
  { text: "Just when I thought I was out... 🎭", size: 12 },
  { text: "I'm flying! 🧚", size: 20 },
  { text: "You talking to me? 🕶️", size: 16 },
];

// Anime-style error messages
const animeErrors = [
  "NANI?! Wrong credentials! 😱",
  "Baka! That's not right! 😤",
  "Yamete! Invalid login! 🚫",
  "Hentai!? Just kidding... wrong password! 😅",
  "Sugoi fail! Try again! 💢",
  "Kawaii desu ne... but wrong! 🎀",
  "Muda muda muda! Incorrect! ✋",
  "Omae wa mou shindeiru... just kidding! Login failed! 💀",
  "It's over 9000! (your login attempts) 😅",
  "Notice me senpai! (with correct credentials) 💕",
];

const generateRandomSize = () => Math.random() * 4 + 2;
const generateRandomDuration = () => Math.random() * 10 + 5;

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const backgroundRef = useRef(null);
  
  const queryClient = useQueryClient();

  // Pre-generate all random positions and animations upfront
  const floatingElements = useMemo(() => {
    // Particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: `particle-${i}`,
      size: generateRandomSize(),
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: generateRandomDuration(),
      xRange: [0, Math.random() * 30, Math.random() * -30, 0],
      yRange: [0, Math.random() * 30, Math.random() * -30, 0]
    }));

    // Quotes
    const quoteElements = quotes.map((quote, i) => ({
      id: `quote-${i}`,
      ...quote,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: generateRandomDuration() * 1.5,
      xRange: [0, Math.random() * 20, Math.random() * -20, 0],
      yRange: [0, Math.random() * 20, Math.random() * -20, 0],
      rotation: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0]
    }));

    return { particles, quoteElements };
  }, []);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const randomError = animeErrors[Math.floor(Math.random() * animeErrors.length)];
        setCurrentError(randomError);
        throw new Error(data.error || "Login failed");
      }

      toast.success("Logged in successfully! ようこそ!");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  // Fix for blurry background image
  useEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.style.willChange = "transform";
      backgroundRef.current.style.transform = "translateZ(0)";
    }
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Background Image */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('/Background.jpg')",
          backgroundAttachment: "fixed",
          transform: "translateZ(0)",
          willChange: "transform"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Floating Particles */}
      {floatingElements.particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/40 rounded-full z-10"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.initialY}vh`,
            left: `${particle.initialX}vw`,
            willChange: "transform"
          }}
          animate={{
            x: particle.xRange.map(x => `${x}vw`),
            y: particle.yRange.map(y => `${y}vh`)
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating Movie Quotes */}
      {floatingElements.quoteElements.map((quote) => (
        <motion.div
          key={quote.id}
          className="fixed text-white/70 font-bold pointer-events-none z-10"
          style={{
            fontSize: `${quote.size}px`,
            top: `${quote.initialY}vh`,
            left: `${quote.initialX}vw`,
            textShadow: '0 0 8px rgba(0,0,0,0.8)',
            willChange: "transform"
          }}
          animate={{
            x: quote.xRange.map(x => `${x}vw`),
            y: quote.yRange.map(y => `${y}vh`),
            rotate: quote.rotation
          }}
          transition={{
            duration: quote.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {quote.text}
        </motion.div>
      ))}

      {/* Login Card */}
      <motion.div
        className="relative bg-black/70 p-8 rounded-2xl shadow-2xl backdrop-blur-md text-white w-full max-w-md border border-purple-500/30 z-20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo with entertainment icons */}
        <div className="flex justify-center mb-4 relative">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1 text-xs">
            <FaFilm />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-pink-500 text-black rounded-full p-1 text-xs">
            <FaMusic />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-black rounded-full p-1 text-xs">
            <FaGamepad />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Enter the Multiverse 🌀
        </h1>
        
        {/* Easter egg hint */}
        <p className="text-center text-xs mb-4 text-gray-400">
          "The password is not 'password123'... obviously! 😏"
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Username Input */}
          <label className="input flex items-center gap-2 p-3 border rounded-lg bg-white/5 hover:bg-white/10 transition-all border-purple-500/30">
            <MdPerson className="text-xl text-purple-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
              placeholder="Username (try 'goku')"
              name="username"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              value={formData.username}
            />
          </label>

          {/* Password Input */}
          <label className="input flex items-center gap-2 p-3 border rounded-lg bg-white/5 hover:bg-white/10 transition-all border-purple-500/30">
            <MdPassword className="text-xl text-purple-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
              placeholder="Password (not 'onepiece')"
              name="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              value={formData.password}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
            </button>
          </label>

          {/* Login Button */}
          <motion.button
            type="submit"
            className="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isPending}
          >
            <span className="relative z-10">
              {isPending ? "Engaging hyperdrive..." : "Initiate Sequence 🎬"}
            </span>
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
          
          {/* Anime-style Error Message */}
          {isError && (
            <motion.div 
              className="text-center p-2 rounded-lg border border-red-400/30 bg-gradient-to-r from-red-900/50 to-pink-900/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-red-300 font-bold text-sm">
                {currentError || error.message}
              </p>
              <motion.div 
                className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              <p className="text-xs text-red-400 mt-1">
                Try: "naruto" / "believeit" (maybe?)
              </p>
            </motion.div>
          )}
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm mb-2">New to our cinematic universe?</p>
          <Link to="/signup">
            <motion.button 
              className="btn border border-purple-500/50 text-white px-6 py-2 rounded-full bg-purple-900/20 hover:bg-purple-900/40 transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your Origin Story 🎭
            </motion.button>
          </Link>
        </div>

        {/* Easter egg footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Warning: May cause extreme nostalgia and sudden urge to binge-watch</p>
          <p className="mt-1">© {new Date().getFullYear()} Not affiliated with any major studio</p>
        </div>
      </motion.div>

      {/* Hidden Easter egg */}
      <div className="absolute bottom-4 right-4 text-xs text-white/20 hover:text-white/50 transition-colors cursor-default z-30">
        🎮 ↑ ↑ ↓ ↓ ← → ← → B A
      </div>
    </motion.div>
  );
};

export default LoginPage;