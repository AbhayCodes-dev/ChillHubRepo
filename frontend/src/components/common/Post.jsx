import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import { 
  FaRegTrashAlt, 
  FaHeart,
  FaRegHeart,
  FaStar
} from "react-icons/fa";
import { 
  BsChatLeftText, 
  BsChatLeftTextFill 
} from "react-icons/bs";

const CommentStorage = {
  storageKey: 'persistentComments',
  
  getAllComments() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  },
  
  getComments(postId) {
    const allComments = this.getAllComments();
    return allComments[postId] || [];
  },
  
  addComment(postId, comment) {
    const allComments = this.getAllComments();
    if (!allComments[postId]) {
      allComments[postId] = [];
    }
    allComments[postId].push(comment);
    localStorage.setItem(this.storageKey, JSON.stringify(allComments));
    return allComments[postId];
  },
  
  setComments(postId, comments) {
    const allComments = this.getAllComments();
    allComments[postId] = comments;
    localStorage.setItem(this.storageKey, JSON.stringify(allComments));
  }
};

const Post = ({ post: initialPost }) => {
    const [post, setPost] = useState(() => {
      const savedComments = CommentStorage.getComments(initialPost._id);
      if (savedComments.length > 0) {
        return {
          ...initialPost,
          comments: savedComments
        };
      }
      return initialPost;
    });
    
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const commentInputRef = useRef(null);
    
    const { data: authUser, isLoading: isAuthLoading } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    if (!post || !post.user) return null;
    if (isAuthLoading || !authUser) return <LoadingSpinner />;

    const postOwner = post.user;
    const isLiked = post.likes?.includes(authUser._id);
    const isMyPost = authUser._id === postOwner._id;
    const formattedDate = formatPostDate(post.createdAt);
    const isReview = post.postType === "review";

    useEffect(() => {
      if (initialPost._id !== post._id) {
        const savedComments = CommentStorage.getComments(initialPost._id);
        setPost({
          ...initialPost,
          comments: savedComments.length > 0 ? savedComments : initialPost.comments || []
        });
      } else if (JSON.stringify(initialPost) !== JSON.stringify(post)) {
        setPost(prev => ({
          ...initialPost,
          comments: prev.comments || []
        }));
      }
    }, [initialPost]);

    useEffect(() => {
        if (showComments && commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }, [showComments]);

    const { mutate: deletePost, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
                if (!res.ok) {
                    throw new Error("Failed to delete post");
                }
                return await res.json();
            } catch (error) {
                console.error("Delete error:", error);
                throw new Error("Something went wrong while deleting post");
            }
        },
        onSuccess: () => {
            toast.success("Post deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => toast.error(error.message),
    });

    const { mutate: likePost, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/posts/like/${post._id}`, { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                
                if (!res.ok) {
                    throw new Error("Failed to update like");
                }
                return await res.json();
            } catch (error) {
                console.error("Like error:", error);
                throw new Error("Something went wrong while updating like");
            }
        },
        onMutate: async () => {
            const newLikes = isLiked 
                ? post.likes.filter(id => id !== authUser._id)
                : [...post.likes, authUser._id];
            
            setPost(prev => ({
                ...prev,
                likes: newLikes
            }));
            
            return { previousLikes: post.likes };
        },
        onSuccess: (updatedLikes) => {
            if (updatedLikes) {
                setPost(prev => ({
                    ...prev,
                    likes: updatedLikes
                }));
            }
            
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error, _, context) => {
            setPost(prev => ({
                ...prev,
                likes: context.previousLikes
            }));
            toast.error(error.message || "Failed to update like");
        },
    });

    const { mutate: addComment, isPending: isAddingComment } = useMutation({
        mutationFn: async () => {
            try {
                const newComment = {
                    _id: `comment_${Date.now()}`,
                    text: commentText,
                    createdAt: new Date().toISOString(),
                    user: {
                        _id: authUser._id,
                        username: authUser.username,
                        profileImg: authUser.profileImg,
                        fullName: authUser.fullName
                    }
                };
                
                const updatedComments = CommentStorage.addComment(post._id, newComment);
                
                return {
                    ...post,
                    comments: updatedComments
                };
            } catch (error) {
                console.error("Comment error:", error);
                throw new Error("Something went wrong while adding comment");
            }
        },
        onSuccess: (updatedPost) => {
            setPost(updatedPost);
            setCommentText("");
            toast.success("Comment added!");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add comment");
        },
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment();
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
                            onError={(e) => {
                                e.target.src = "/avatar-placeholder.png";
                            }}
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
                {/* Review Data Section */}
                {isReview && post.reviewData && (
                    <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-yellow-400">{post.reviewData.movieName}</h3>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`text-sm ${
                                            star <= post.reviewData.rating
                                                ? "text-yellow-400"
                                                : "text-gray-500"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {post.reviewData.actorName && (
                                <div>
                                    <span className="text-gray-400">Actors:</span>
                                    <span className="text-white ml-1">{post.reviewData.actorName}</span>
                                </div>
                            )}
                            {post.reviewData.directorName && (
                                <div>
                                    <span className="text-gray-400">Director:</span>
                                    <span className="text-white ml-1">{post.reviewData.directorName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-gray-200 whitespace-pre-line mb-3">{post.text}</p>
                
                {post.img && (
                    <div className="rounded-lg overflow-hidden bg-gray-800 mb-2">
                        <img
                            src={post.img}
                            className="w-full max-h-96 object-cover"
                            alt="Post"
                            onError={(e) => {
                                e.target.src = "/image-placeholder.png";
                            }}
                        />
                    </div>
                )}
            </div>
            
            {/* Post Stats & Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-gray-900/80">
                <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button 
                        onClick={() => likePost()}
                        disabled={isLiking}
                        className={`flex items-center gap-1.5 ${
                            isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
                        } transition-colors`}
                    >
                        {isLiking ? (
                            <LoadingSpinner size="sm" />
                        ) : isLiked ? (
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
                                onError={(e) => {
                                    e.target.src = "/avatar-placeholder.png";
                                }}
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
                            {isAddingComment ? <LoadingSpinner size="sm" /> : "Post"}
                        </button>
                    </form>
                    
                    {/* Comments List */}
                    <div className="max-h-64 overflow-y-auto px-3 pb-3">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment, index) => (
                                <div key={comment._id || index} className="flex gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <img 
                                            src={comment.user?.profileImg || "/avatar-placeholder.png"} 
                                            className="w-full h-full object-cover"
                                            alt={comment.user?.username || "User"}
                                            onError={(e) => {
                                                e.target.src = "/avatar-placeholder.png";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 bg-gray-800 rounded-lg p-2">
                                        <div className="flex items-center gap-2">
                                            <Link to={`/profile/${comment.user?.username}`} className="font-medium text-white text-xs hover:underline">
                                                {comment.user?.username || "User"}
                                            </Link>
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