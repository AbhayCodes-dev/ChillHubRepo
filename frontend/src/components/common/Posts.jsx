// components/common/Posts.jsx
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import LoadingSpinner from "./LoadingSpinner";

const Posts = ({ feedType }) => {
  const getPostsEndpoint = () => {
    switch (feedType) {
      case "latest":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "reviews":
        return "/api/posts/all?type=review";
      default:
        return "/api/posts/all";
    }
  };

  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(getPostsEndpoint());
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        
        // Filter posts based on feedType
        if (feedType === "reviews") {
          return data.filter(post => post.postType === "review");
        } else if (feedType === "latest") {
          return data.filter(post => post.postType !== "review");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center mt-10 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800">
          <p className="text-lg font-medium text-white">
            {feedType === "reviews" 
              ? "No reviews yet" 
              : feedType === "following" 
                ? "No posts from people you follow" 
                : "No posts yet"}
          </p>
          <p className="text-sm mt-2">
            {feedType === "reviews" 
              ? "Be the first to share your review!" 
              : "Start by creating a post"}
          </p>
        </div>
      )}
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;