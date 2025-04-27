import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiUser, FiTrash2, FiBell, FiClock, FiFilm } from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const NotificationPage = () => {
    const queryClient = useQueryClient();
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
    });

    const { mutate: deleteNotifications, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("/api/notifications", {
                    method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            toast.success("All notifications cleared");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Group notifications by date
    const groupedNotifications = notifications?.reduce((groups, notification) => {
        const date = new Date(notification.createdAt).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(notification);
        return groups;
    }, {}) || {};

    const dates = Object.keys(groupedNotifications);

    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = Math.floor((now - date) / 1000); // Difference in seconds
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        
        return date.toLocaleDateString();
    };

    const handleClearConfirm = () => {
        if (notifications?.length > 0) {
            if (window.confirm("Clear all notifications?")) {
                deleteNotifications();
            }
        } else {
            toast.error("No notifications to clear");
        }
    };

    return (
        <div className="flex-[4_4_0] min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50 py-4">
                <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                            <FiBell className="text-indigo-400 text-xl" />
                        </div>
                        <h1 className="text-xl font-medium text-white">Notifications</h1>
                    </div>
                    
                    <button 
                        onClick={handleClearConfirm}
                        disabled={isDeleting || isLoading || notifications?.length === 0}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                            notifications?.length === 0 
                                ? "bg-gray-800/40 text-gray-500 cursor-not-allowed" 
                                : "bg-gray-800 hover:bg-red-500/10 text-gray-400 hover:text-red-400"
                        }`}
                    >
                        <FiTrash2 className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Clear All</span>
                    </button>
                </div>
            </div>

            {/* Notification Content */}
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : notifications?.length === 0 ? (
                    <motion.div 
                        className="bg-gray-800/10 backdrop-blur-sm rounded-xl p-10 text-center border border-gray-800/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-800/50 w-16 h-16 flex items-center justify-center mx-auto rounded-full mb-6">
                            <FiBell className="text-2xl text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No notifications yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            When someone follows you or interacts with your content, you'll see it here
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-6">
                            {dates.map(date => (
                                <motion.div 
                                    key={date} 
                                    className="space-y-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex items-center gap-2 px-2">
                                        <FiClock className="text-indigo-400 text-sm" />
                                        <h3 className="text-gray-300 text-sm font-medium">{date}</h3>
                                        <div className="h-px flex-grow bg-gray-800/60"></div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {groupedNotifications[date].map((notification, index) => (
                                            <motion.div
                                                key={notification._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                            >
                                                <Link 
                                                    to={`/profile/${notification.from.username}`}
                                                    className="block"
                                                >
                                                    <div className="bg-gray-800/20 hover:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-800/40 hover:border-indigo-500/40 transition-all duration-200 overflow-hidden">
                                                        <div className="flex items-start p-4">
                                                            <div className="flex-shrink-0 mr-4">
                                                                <div className="relative">
                                                                    <img 
                                                                        src={notification.from.profileImg || "/avatar-placeholder.png"} 
                                                                        alt={notification.from.username}
                                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500/50"
                                                                    />
                                                                    <span className={`absolute -bottom-1 -right-1 p-1.5 rounded-full shadow-lg ${
                                                                        notification.type === "follow" 
                                                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                                                                            : "bg-gradient-to-r from-pink-500 to-rose-500"
                                                                    }`}>
                                                                        {notification.type === "follow" ? 
                                                                            <FiUser className="text-white text-xs" /> : 
                                                                            <FiHeart className="text-white text-xs" />
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="font-semibold text-white">@{notification.from.username}</span>
                                                                    <span className="text-xs text-gray-400">
                                                                        {getRelativeTime(notification.createdAt)}
                                                                    </span>
                                                                </div>
                                                                
                                                                <p className="text-gray-300 text-sm">
                                                                    {notification.type === "follow" 
                                                                        ? "started following you" 
                                                                        : "liked your post"}
                                                                </p>
                                                                
                                                                {notification.type === "like" && notification.post?.content && (
                                                                    <div className="mt-3 py-2 px-3 bg-gray-800/40 rounded-lg border-l-2 border-indigo-500/70">
                                                                        <p className="text-sm text-gray-300 line-clamp-2">
                                                                            "{notification.post.content}"
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;