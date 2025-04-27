import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // Simulating API call (Replace with actual fetch request)
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen bg-gray-900 text-white p-6 rounded-xl shadow-2xl">
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <input
          type="text"
          className="w-full p-3 bg-gray-800 rounded-lg border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="p-3 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-black font-bold flex items-center gap-2 transition-all"
          onClick={handleSearch}
        >
          <FaSearch className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-center text-gray-400 mt-6 text-lg">
          No users found 🤔
        </p>
      )}

      <div className="mt-4 space-y-4">
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover:rotate-1 border-b border-gray-700"
          >
            <img
              src={user.profileImg}
              alt={user.fullName}
              className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-md"
            />
            <div>
              <p className="text-yellow-300 font-bold text-lg">
                @{user.username}
              </p>
              <p className="text-gray-300">{user.fullName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
