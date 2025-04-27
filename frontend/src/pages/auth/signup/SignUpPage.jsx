import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser, FaEye, FaEyeSlash, FaFistRaised, FaSkull, FaBan } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Fight Club quotes with emojis
const quotes = [
  { text: "The first rule of Fight Club is: you do not talk about Fight Club. 🤐", size: 16 },
  { text: "The second rule of Fight Club is: you DO NOT talk about Fight Club! 🤫", size: 16 },
  { text: "Only two guys to a fight. 👊", size: 18 },
  { text: "One fight at a time. ⏱️", size: 18 },
  { text: "No shirts, no shoes. 👕", size: 18 },
  { text: "Fights will go on as long as they have to. ⏳", size: 16 },
  { text: "If this is your first night at Fight Club, you HAVE to fight. 🥊", size: 16 },
  { text: "Self-improvement is masturbation. Self-destruction is the answer. 💣", size: 15 },
  { text: "You are not your job. 💼", size: 18 },
  { text: "You are not how much money you have in the bank. 💰", size: 16 },
  { text: "You are not the car you drive. 🚗", size: 18 },
  { text: "You are not the contents of your wallet. 💳", size: 16 },
  { text: "You are not your khakis. 👖", size: 18 },
  { text: "The things you own end up owning you. 🔗", size: 16 },
  { text: "It's only after we've lost everything that we're free to do anything. 🕊️", size: 15 },
  { text: "This is your life, and it's ending one minute at a time. ⏰", size: 16 },
  { text: "I am Jack's complete lack of surprise. 😑", size: 18 },
  { text: "I am Jack's raging bile duct. 🤢", size: 16 },
  { text: "I am Jack's cold sweat. 💦", size: 18 },
  { text: "I am Jack's broken heart. 💔", size: 16 },
  { text: "I am Jack's inflamed sense of rejection. 😠", size: 17 },
  { text: "I am Jack's smirking revenge. 😏", size: 18 },
  { text: "You met me at a very strange time in my life. 🌃", size: 16 },
  { text: "We're the middle children of history. 🧠", size: 17 },
  { text: "Sticking feathers up your butt does not make you a chicken. 🐔", size: 15 },
  { text: "You're not your job. You're not how much money you have in the bank. 💲", size: 14 },
  { text: "Hitting bottom isn't a weekend retreat. It's not a seminar. 📉", size: 15 },
  { text: "On a long enough timeline, the survival rate for everyone drops to zero. ☠️", size: 16 },
  { text: "You have to know, not fear, that someday you're going to die. 🕯️", size: 15 },
  { text: "Advertising has us chasing cars and clothes, working jobs we hate. 📺", size: 14 },
];

const generateRandomSize = () => Math.random() * 4 + 2;
const generateRandomDuration = () => Math.random() * 10 + 5;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  
  const queryClient = useQueryClient();

  // Reduced to three rules as requested
  const passwordRules = [
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase and lowercase letter",
    "Password must contain at least one special character",
  ];

  // Generate floating elements with useMemo to prevent recreation on re-renders
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
  }, []); // Empty dependency array ensures this only runs once

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");

        toast.success("Welcome to Fight Club. Remember the first rule.");
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasSpecialChar;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast.error("Your password breaks the rules of Fight Club");
      return;
    }

    mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        backgroundImage: "url('/Sign.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Floating Particles */}
      {floatingElements.particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-red-500/30 rounded-full z-10"
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

      {/* Floating Fight Club Quotes */}
      {floatingElements.quoteElements.map((quote) => (
        <motion.div
          key={quote.id}
          className="fixed text-red-600/60 font-bold pointer-events-none z-10"
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

      {/* Signup Card */}
      <motion.div
        className="relative bg-black/80 p-8 rounded-2xl shadow-lg backdrop-blur-lg text-white w-full max-w-md border border-red-800/40 z-20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4 relative">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
          <div className="absolute -top-2 -right-2 bg-red-600 text-black rounded-full p-1 text-xs">
            <FaFistRaised />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-red-800 text-white rounded-full p-1 text-xs">
            <FaSkull />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-black text-red-600 rounded-full p-1 text-xs border border-red-600">
            <FaBan />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
          Join Fight Club 👊
        </h1>

        {/* Fight Club Rules for Password - Reduced to three rules as requested */}
        <div className="mb-6 p-3 bg-black/90 border border-red-800/50 rounded-lg">
          <h2 className="text-center text-lg font-bold text-red-500 mb-2">THE RULES OF FIGHT CLUB:</h2>
          <ul className="space-y-2">
            {passwordRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-500 font-bold">Rule {index + 1}:</span> 
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {[ 
            { icon: <MdOutlineMail className="text-red-500" />, type: "email", placeholder: "Email", name: "email" },
            { icon: <FaUser className="text-red-500" />, type: "text", placeholder: "Username", name: "username" },
            { icon: <MdDriveFileRenameOutline className="text-red-500" />, type: "text", placeholder: "Full Name", name: "fullName" },
          ].map(({ icon, type, placeholder, name }, index) => (
            <motion.label
              key={index}
              className="input flex items-center gap-2 p-3 border rounded-lg bg-black/50 border-red-800/40 focus-within:border-red-500 transition-all"
              whileFocus={{ scale: 1.05 }}
            >
              {icon}
              <input
                type={type}
                className="w-full bg-transparent outline-none text-white"
                placeholder={placeholder}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
              />
            </motion.label>
          ))}

          {/* Password Input with Visibility Toggle */}
          <label className="input flex items-center gap-2 p-3 border rounded-lg bg-black/50 border-red-800/40 focus-within:border-red-500 transition-all">
            <MdPassword className="text-xl text-red-500" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent outline-none text-white"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
              {showPassword ? <FaEyeSlash className="text-xl text-gray-400" /> : <FaEye className="text-xl text-gray-400" />}
            </button>
          </label>

          {/* Sign-Up Button */}
          <motion.button
            className="btn bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPending ? "Creating Identity..." : "I Understand & Accept the Rules"}
          </motion.button>
          
          {isError && (
            <motion.div 
              className="text-center p-2 rounded-lg border border-red-800/50 bg-black/80"
              animate={{ x: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-500 text-sm">
                {error.message || "You broke the rules of Fight Club"}
              </p>
            </motion.div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-white/70">Already a member of Fight Club?</p>
          <Link to="/login">
            <motion.button
              className="btn border border-red-800/40 text-white mt-2 px-4 py-2 rounded-full bg-black/50 hover:bg-red-900/20"
              whileHover={{ scale: 1.05, borderColor: "rgb(220, 38, 38)" }}
            >
              Return to the Basement
            </motion.button>
          </Link>
        </div>

        {/* Fight Club Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>"You are not special. You are not a beautiful or unique snowflake."</p>
          <p className="mt-1">© {new Date().getFullYear()} Project Mayhem</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;