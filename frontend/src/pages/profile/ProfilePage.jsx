import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink, FaUserCheck, FaUserPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { follow, isPending } = useFollow();
  
  // Mock authUser for development - replace this with your actual authentication logic
  const mockAuthUser = {
    _id: "user123",
    following: []
  };
  
  // Use the mock data as fallback if the query fails or is still loading
  const { data: authUser = mockAuthUser } = useQuery({ 
    queryKey: ["authUser"],
    // Add a queryFn if you have an API endpoint for the auth user
    // This will prevent the "No queryFn was passed" error
    queryFn: async () => {
      try {
        // Replace with your actual auth user endpoint
        const res = await fetch('/api/auth/me');
        if (!res.ok) return mockAuthUser;
        return await res.json();
      } catch (error) {
        console.error("Error fetching auth user:", error);
        return mockAuthUser;
      }
    }
  });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser?._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following?.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Updated fetch followers function with better error handling
  const handleShowFollowers = async () => {
    if (!user) return;
    
    setShowFollowersModal(true);
    setIsLoadingFollowers(true);
    
    try {
      // First check if followers are already populated in user object
      if (user.followers && Array.isArray(user.followers) && 
          user.followers.length > 0 && typeof user.followers[0] === 'object') {
        // Use already populated follower objects
        setFollowersData(user.followers);
        setIsLoadingFollowers(false);
        return;
      }
      
      // If we only have IDs, fetch the full user data
      if (user.followers && Array.isArray(user.followers)) {
        try {
          // Try to get followers data
          // Using a more reliable approach - fetch user details for each follower ID
          const followerPromises = user.followers.map(async (followerId) => {
            try {
              const res = await fetch(`/api/users/${followerId}`);
              if (!res.ok) throw new Error("Failed to fetch user");
              return await res.json();
            } catch (e) {
              // Return a minimal user object if we can't fetch details
              return { 
                _id: followerId, 
                username: `user_${followerId.substring(0, 5)}`,
                fullName: "Unknown User",
                profileImg: "/avatar-placeholder.png"
              };
            }
          });
          
          const resolvedFollowers = await Promise.all(followerPromises);
          setFollowersData(resolvedFollowers);
        } catch (error) {
          console.error("Error fetching followers:", error);
          
          // Create minimal user objects from IDs as a fallback
          const minimalFollowers = user.followers.map(id => ({
            _id: id,
            username: `user_${id.substring(0, 5)}`,
            fullName: "Unknown User", 
            profileImg: "/avatar-placeholder.png"
          }));
          
          setFollowersData(minimalFollowers);
        }
      } else {
        // No followers data available
        setFollowersData([]);
      }
    } catch (error) {
      console.error("Error in followers modal:", error);
      setFollowersData([]);
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  // Updated fetch following function with better error handling
  const handleShowFollowing = async () => {
    if (!user) return;
    
    setShowFollowingModal(true);
    setIsLoadingFollowing(true);
    
    try {
      // First check if following users are already populated in user object
      if (user.following && Array.isArray(user.following) && 
          user.following.length > 0 && typeof user.following[0] === 'object') {
        // Use already populated following objects
        setFollowingData(user.following);
        setIsLoadingFollowing(false);
        return;
      }
      
      // If we only have IDs, fetch the full user data
      if (user.following && Array.isArray(user.following)) {
        try {
          // Try to get following data
          // Using a more reliable approach - fetch user details for each following ID
          const followingPromises = user.following.map(async (followingId) => {
            try {
              const res = await fetch(`/api/users/${followingId}`);
              if (!res.ok) throw new Error("Failed to fetch user");
              return await res.json();
            } catch (e) {
              // Return a minimal user object if we can't fetch details
              return { 
                _id: followingId, 
                username: `user_${followingId.substring(0, 5)}`,
                fullName: "Unknown User",
                profileImg: "/avatar-placeholder.png"
              };
            }
          });
          
          const resolvedFollowing = await Promise.all(followingPromises);
          setFollowingData(resolvedFollowing);
        } catch (error) {
          console.error("Error fetching following:", error);
          
          // Create minimal user objects from IDs as a fallback
          const minimalFollowing = user.following.map(id => ({
            _id: id,
            username: `user_${id.substring(0, 5)}`,
            fullName: "Unknown User", 
            profileImg: "/avatar-placeholder.png"
          }));
          
          setFollowingData(minimalFollowing);
        }
      } else {
        // No following data available
        setFollowingData([]);
      }
    } catch (error) {
      console.error("Error in following modal:", error);
      setFollowingData([]);
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  // User list component for both followers and following modals
  const UserList = ({ users, title, isLoading, onClose }) => {
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-gray-900 rounded-xl w-full max-w-md shadow-2xl border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="font-bold text-xl text-white">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <IoClose className="w-5 h-5 text-gray-300" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No {title.toLowerCase()} found</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    className="flex items-center justify-between hover:bg-gray-800 p-3 rounded-lg transition-all"
                    onClick={onClose}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img 
                          src={user.profileImg || "/avatar-placeholder.png"} 
                          alt={user.username} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {user.fullName}
                        </span>
                        <span className="text-sm text-gray-400">
                          @{user.username}
                        </span>
                        {user.bio && (
                          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {authUser?._id !== user._id && (
                      <button
                        className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                          authUser?.following?.includes(user._id)
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900"
                        } transition-all`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          follow(user._id);
                        }}
                      >
                        {authUser?.following?.includes(user._id) ? "Following" : "Follow"}
                      </button>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* HEADER */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-lg mt-4 text-gray-300"
        >
          User not found
        </motion.p>
      )}
      
      <div className="flex flex-col">
        {!isLoading && !isRefetching && user && (
          <>
            {/* Navigation Header */}
            <div className="flex gap-4 px-6 py-4 items-center sticky top-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800/90 backdrop-blur-sm border-b border-gray-700">
              <Link to="/">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4 text-gray-300" />
                </motion.div>
              </Link>
              <motion.p 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-xl text-white"
              >
                {user?.fullName}
              </motion.p>
            </div>

            {/* COVER IMAGE */}
            <div 
              className="relative group/cover h-64 w-full bg-gray-800"
              onMouseEnter={() => setIsHoveringCover(true)}
              onMouseLeave={() => setIsHoveringCover(false)}
            >
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={coverImg || user?.coverImg || "/cover.png"}
                className="h-full w-full object-cover"
                alt="cover image"
              />
              
              {isMyProfile && (
                <AnimatePresence>
                  {isHoveringCover && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center"
                      onClick={() => coverImgRef.current.click()}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-gray-800/80 backdrop-blur-sm cursor-pointer"
                      >
                        <MdEdit className="w-5 h-5 text-white" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                accept="image/*"
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              {/* USER AVATAR */}
              <div className="absolute -bottom-16 left-6">
                <div 
                  className="relative group/avatar"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden shadow-lg"
                  >
                    <img 
                      src={profileImg || user?.profileImg || "/avatar-placeholder.png"} 
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </motion.div>
                  
                  {isMyProfile && (
                    <AnimatePresence>
                      {isHoveringAvatar && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer"
                          onClick={() => profileImgRef.current.click()}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-full"
                          >
                            <MdEdit className="w-5 h-5 text-white" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>

            {/* PROFILE ACTIONS */}
            <div className="flex justify-end px-6 mt-5 mb-4">
              {isMyProfile ? (
                <div className="flex gap-3">
                  {(coverImg || profileImg) && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                      onClick={async () => {
                        await updateProfile({ coverImg, profileImg });
                        setProfileImg(null);
                        setCoverImg(null);
                      }}
                    >
                      {isUpdatingProfile ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                          Updating...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </motion.button>
                  )}
                  <EditProfileModal authUser={authUser} />
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                    amIFollowing
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:shadow-md"
                  } transition-all`}
                  onClick={() => follow(user?._id)}
                >
                  {isPending ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : amIFollowing ? (
                    <>
                      <FaUserCheck /> Following
                    </>
                  ) : (
                    <>
                      <FaUserPlus /> Follow
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* PROFILE DETAILS SECTION */}
            <div className="px-6 pb-6 border-b border-gray-700">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col">
                  <h1 className="font-bold text-2xl text-white">{user?.fullName}</h1>
                  <span className="text-gray-400">@{user?.username}</span>
                  {user?.bio && (
                    <p className="text-gray-300 mt-3 leading-relaxed">
                      {user?.bio}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {user?.link && (
                    <div className="flex items-center gap-1">
                      <FaLink className="w-3 h-3" />
                      <a
                        href={user?.link.startsWith('http') ? user.link : `https://${user.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-yellow-400 hover:underline hover:text-yellow-300 transition-colors"
                      >
                        {user?.link}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <IoCalendarOutline className="w-4 h-4" />
                    <span>Joined {memberSinceDate}</span>
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Following Button/Counter - Updated to ensure it works */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 cursor-pointer group/follow"
                    onClick={handleShowFollowing}
                  >
                    <span className="font-bold text-white">{user?.following?.length || 0}</span>
                    <span className="text-gray-400 group-hover/follow:text-yellow-400 transition-colors">Following</span>
                  </motion.div>
                  
                  {/* Followers Button/Counter - Updated to ensure it works */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 cursor-pointer group/follow"
                    onClick={handleShowFollowers}
                  >
                    <span className="font-bold text-white">{user?.followers?.length || 0}</span>
                    <span className="text-gray-400 group-hover/follow:text-yellow-400 transition-colors">Followers</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* FEED TYPE SELECTOR */}
            <div className="flex w-full border-b border-gray-700">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`flex justify-center flex-1 p-4 relative cursor-pointer transition-colors ${
                  feedType === "posts"
                    ? "text-yellow-400 font-medium"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
                onClick={() => setFeedType("posts")}
              >
                Posts
                {feedType === "posts" && (
                  <motion.div 
                    layoutId="feedIndicator"
                    className="absolute bottom-0 w-1/2 h-1 rounded-full bg-yellow-400"
                    initial={false}
                  />
                )}
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`flex justify-center flex-1 p-4 relative cursor-pointer transition-colors ${
                  feedType === "likes"
                    ? "text-yellow-400 font-medium"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
                onClick={() => setFeedType("likes")}
              >
                Likes
                {feedType === "likes" && (
                  <motion.div 
                    layoutId="feedIndicator"
                    className="absolute bottom-0 w-1/2 h-1 rounded-full bg-yellow-400"
                    initial={false}
                  />
                )}
              </motion.div>
            </div>
          </>
        )}

        {/* POSTS SECTION */}
        <Posts feedType={feedType} username={username} userId={user?._id} />
      </div>

      {/* Followers Modal */}
      <AnimatePresence>
        {showFollowersModal && (
          <UserList 
            users={followersData} 
            title="Followers" 
            isLoading={isLoadingFollowers}
            onClose={() => setShowFollowersModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Following Modal */}
      <AnimatePresence>
        {showFollowingModal && (
          <UserList 
            users={followingData} 
            title="Following" 
            isLoading={isLoadingFollowing}
            onClose={() => setShowFollowingModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;