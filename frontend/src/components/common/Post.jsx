import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import { 
  FaRegTrashAlt, 
  FaBookmark, 
  FaRegBookmark,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import { 
  BsChatLeftText, 
  BsChatLeftTextFill 
} from "react-icons/bs";

const Post = ({ post }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const commentInputRef = useRef(null);
    
    const { data: authUser, isLoading: isAuthLoading } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    // Fallbacks
    if (!post || !post.user) return null;
    if (isAuthLoading || !authUser) return <LoadingSpinner />;

    const postOwner = post.user;
    const isLiked = post.likes?.includes(authUser._id);
    const isMyPost = authUser._id === postOwner._id;
    const formattedDate = formatPostDate(post.createdAt);

    // Toggle comments and focus input when opened
    useEffect(() => {
        if (showComments && commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }, [showComments]);

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Something went wrong");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/like/${post._id}`, { method: "POST" });
            if (!res.ok) throw new Error("Something went wrong");
            return res.json();
        },
        onSuccess: (updatedLikes) => {
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData?.map((p) => (p._id === post._id ? { ...p, likes: updatedLikes } : p));
            });
        },
        onError: (error) => toast.error(error.message),
    });

    const { mutate: addComment, isPending: isAddingComment } = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/posts/comment/${post._id}`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: commentText })
            });
            if (!res.ok) throw new Error("Couldn't add comment");
            return res.json();
        },
        onSuccess: (updatedPost) => {
            setCommentText("");
            queryClient.setQueryData(["posts"], (oldData) => {
                return oldData?.map((p) => (p._id === post._id ? updatedPost : p));
            });
            toast.success("Comment added!");
        },
        onError: (error) => toast.error(error.message)
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment();
    };

    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        toast.success(isBookmarked ? "Removed from watchlist" : "Added to watchlist");
        // Here you would normally call an API to update bookmarks
    };

    return (
        <div className="bg-gray-900 rounded-xl mb-4 overflow-hidden border border-gray-800 hover:border-gray-700 transition-all shadow-lg">
            {/* Post Header */}
            <div className="flex items-start gap-3 p-4">
                <Link to={`/profile/${postOwner.username}`} className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 p-0.5">
                        <img 
                            src={postOwner.profileImg || "/avatar-placeholder.png"} 
                            className="w-full h-full object-cover rounded-full"
                            alt={postOwner.username}
                        />
                    </div>
                </Link>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <Link to={`/profile/${postOwner.username}`} className="font-bold text-white hover:text-indigo-400 transition-colors truncate">
                                {postOwner.fullName}
                            </Link>
                            <span className="text-gray-500 text-xs">@{postOwner.username} · {formattedDate}</span>
                        </div>
                        
                        {isMyPost && !isDeleting && (
                            <button 
                                onClick={deletePost}
                                className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
                            >
                                <FaRegTrashAlt className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Post Content */}
            <div className="px-4 pb-3">
                <p className="text-gray-200 whitespace-pre-line mb-3">{post.text}</p>
                
                {post.img && (
                    <div className="rounded-lg overflow-hidden bg-gray-800 mb-2">
                        <img
                            src={post.img}
                            className="w-full max-h-96 object-cover"
                            alt="Post"
                        />
                    </div>
                )}
            </div>
            
            {/* Post Stats & Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-gray-900/80">
                <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button 
                        onClick={likePost}
                        disabled={isLiking}
                        className={`flex items-center gap-1.5 ${
                            isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                        } transition-colors`}
                    >
                        {isLiked ? (
                            <FaHeart className="w-5 h-5" />
                        ) : (
                            <FaRegHeart className="w-5 h-5" /> 
                        )}
                        <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                    </button>
                    
                    {/* Comment Button */}
                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-1.5 ${
                            showComments ? "text-cyan-500" : "text-gray-400 hover:text-cyan-400"
                        } transition-colors`}
                    >
                        {showComments ? (
                            <BsChatLeftTextFill className="w-5 h-5" />
                        ) : (
                            <BsChatLeftText className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                    </button>
                </div>
                
                {/* Bookmark Button */}
                <button 
                    onClick={toggleBookmark}
                    className={`flex items-center gap-1.5 ${
                        isBookmarked ? "text-amber-500" : "text-gray-400 hover:text-amber-400"
                    } transition-colors`}
                >
                    {isBookmarked ? (
                        <FaBookmark className="w-5 h-5" />
                    ) : (
                        <FaRegBookmark className="w-5 h-5" />
                    )}
                </button>
            </div>
            
            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-gray-800 bg-gray-950/80">
                    {/* Add Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 p-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                                src={authUser.profileImg || "/avatar-placeholder.png"} 
                                className="w-full h-full object-cover"
                                alt={authUser.username}
                            />
                        </div>
                        <input
                            ref={commentInputRef}
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add your thoughts..."
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim() || isAddingComment}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full px-4 py-2 text-sm font-medium transition-colors"
                        >
                            Post
                        </button>
                    </form>
                    
                    {/* Comments List */}
                    <div className="max-h-64 overflow-y-auto px-3 pb-3">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, index) => (
                                <div key={index} className="flex gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <img 
                                            src={comment.user?.profileImg || "/avatar-placeholder.png"} 
                                            className="w-full h-full object-cover"
                                            alt={comment.user?.username || "User"}
                                        />
                                    </div>
                                    <div className="flex-1 bg-gray-800 rounded-lg p-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white text-xs">
                                                {comment.user?.username || "User"}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {formatPostDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-500 text-sm">
                                No comments yet. Be the first to share your thoughts!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;