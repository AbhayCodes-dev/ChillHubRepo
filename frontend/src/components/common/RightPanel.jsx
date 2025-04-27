import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  // Maintain layout when no users
  if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

  return (
    <div className='hidden lg:block my-4 mx-2 relative'>
      {/* Invisible placeholder to preserve layout */}
      <div className='md:w-64 invisible h-screen'>
        <div className='bg-transparent p-4 rounded-md sticky top-2'>
          <p className='font-bold'>Placeholder</p>
        </div>
      </div>

      {/* Fixed suggestion box */}
      <div className='fixed left-4 bottom-4 z-10'>
        <div
          className='bg-gradient-to-br from-[#1a1c24] to-[#16181C] p-4 rounded-md shadow-lg border border-[#2c2f36] w-[350px] h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent'
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-purple-400 text-xl">✨</span>
            <p className='font-bold text-white text-lg'>Trending Creators</p>
          </div>
          
          <div className='flex flex-col gap-4'>
            {isLoading ? (
              <>
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </>
            ) : (
              suggestedUsers?.map((user) => {
                return (
                  <Link
                    to={`/profile/${user.username}`}
                    className='flex items-center justify-between hover:bg-[#1f1f23] p-3 rounded-lg transition-all border border-transparent hover:border-purple-900/30'
                    key={user._id}
                  >
                    <div className='flex gap-3 items-center'>
                      <div className='w-10 h-10 rounded-full ring-2 ring-purple-500/40 p-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'>
                        <img 
                          src={user.profileImg || "/avatar-placeholder.png"} 
                          alt='avatar' 
                          className="rounded-full h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className='flex flex-col'>
                        <span className='font-semibold tracking-tight truncate w-28 text-white'>
                          {user.fullName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className='text-sm text-slate-400'>@{user.username}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className='btn bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 rounded-full btn-sm border-none shadow-md shadow-purple-900/20'
                      onClick={(e) => {
                        e.preventDefault();
                        follow(user._id);
                        // We don't remove from list immediately - will be updated on page change/refresh
                      }}
                    >
                      {isPending ? <LoadingSpinner size='sm' /> : "Follow"}
                    </button>
                  </Link>
                );
              })
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-800 text-center">
            <span className="text-xs text-gray-500">Discover more entertainment creators</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;