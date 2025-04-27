import { motion } from "framer-motion";
import { FaCrown, FaCheck, FaStar, FaGem, FaLock } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";

const Premium = () => {
  const features = [
    "Exclusive movie recommendations",
    "Early access to new features",
    "Premium badges on your profile",
    "Priority customer support",
    "Ad-free experience",
    "Custom themes and avatars",
  ];

  const paymentOptions = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$4.99",
      per: "month",
      popular: false,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$49.99",
      per: "year",
      popular: true,
      discount: "Save 15%",
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: "$99.99",
      per: "one-time",
      popular: false,
    },
  ];

  return (
    <div className="flex-[4_4_0] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stars-bg.png')] opacity-20"></div>
        <div className="relative z-10 p-8 text-center bg-gradient-to-b from-yellow-600/20 to-transparent">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full shadow-lg">
              <FaCrown className="text-3xl text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
            Legendary Pass
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Unlock the ultimate entertainment experience with exclusive perks and
            premium features.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <BsLightningFill className="text-yellow-400" />
          What You Get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-full">
                  <FaCheck className="text-yellow-400" />
                </div>
                <p className="text-gray-200">{feature}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FaGem className="text-yellow-400" />
          Choose Your Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentOptions.map((option) => (
            <motion.div
              key={option.id}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                option.popular
                  ? "border-yellow-400 bg-gray-800/70 shadow-lg shadow-yellow-400/20"
                  : "border-gray-700 bg-gray-800/50"
              }`}
              whileHover={{ scale: 1.03 }}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-amber-700" />
                  POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-center">{option.name}</h3>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-yellow-400">
                  {option.price}
                </span>
                <span className="text-gray-400">/{option.per}</span>
              </div>
              {option.discount && (
                <p className="text-center text-green-400 text-sm mb-4">
                  {option.discount}
                </p>
              )}
              <button
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  option.popular
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {option.popular ? "Get Premium" : "Choose Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Security */}
      <div className="p-6 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <FaLock />
          <p className="text-sm">
            Secure payment processing. Your information is protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;