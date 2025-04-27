// components/CreatePost.jsx
import { useRef, useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import {
  FaTheaterMasks,
  FaPlus,
  FaImage,
  FaSmile,
  FaStar,
  FaPenAlt,
} from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CreatePost = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("post");
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reviewData, setReviewData] = useState({
    movieName: "",
    actorName: "",
    directorName: "",
    rating: 0,
  });
  const imgRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async ({ text, img, postType, reviewData }) => {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          img,
          postType,
          reviewData: postType === "review" ? reviewData : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      setReviewData({
        movieName: "",
        actorName: "",
        directorName: "",
        rating: 0,
      });
      toast.success(activeTab === "post" ? "Post created!" : "Review posted!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "post" && !text.trim() && !img) {
      toast.error("Please add some content");
      return;
    }
    if (activeTab === "review" && !reviewData.movieName) {
      toast.error("Please enter movie name");
      return;
    }
    createPostMutation.mutate({
      text,
      img,
      postType: activeTab,
      reviewData: activeTab === "review" ? reviewData : null,
    });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      handleImgChange({ target: { files: [file] } });
    }
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  const handleStarClick = (rating) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-[615px] h-[500px] bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 shadow-xl z-40 rounded-2xl overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="h-full flex flex-col relative">
        {/* Header */}
        <div className="p-3 border-b border-gray-700 bg-gray-900/90 backdrop-blur-sm relative z-10">
          <div className="flex items-center justify-center">
            <h1 className="text-lg font-bold flex items-center gap-2">
              <FaTheaterMasks className="text-yellow-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                {activeTab === "post" ? "Create Post" : "Write Review"}
              </span>
            </h1>
          </div>
          <div className="flex gap-2 mt-2 justify-center">
            <button
              onClick={() => setActiveTab("post")}
              className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                activeTab === "post"
                  ? "bg-blue-900/50 text-blue-400 border border-blue-700"
                  : "text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              <FaPlus size={10} />
              Post
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                activeTab === "review"
                  ? "bg-green-900/50 text-green-400 border border-green-700"
                  : "text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              <FaPenAlt size={10} />
              Review
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-y-auto max-h-[24rem]">
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === "review" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Movie/TV Show Name*"
                      className="w-full p-2 bg-gray-800 rounded border border-gray-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 text-xs"
                      value={reviewData.movieName}
                      onChange={(e) =>
                        setReviewData((prev) => ({
                          ...prev,
                          movieName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Actor/Actress"
                    className="p-2 bg-gray-800 rounded border border-gray-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 text-xs"
                    value={reviewData.actorName}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        actorName: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="Director"
                    className="p-2 bg-gray-800 rounded border border-gray-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 text-xs"
                    value={reviewData.directorName}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        directorName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex justify-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-lg ${
                        star <= reviewData.rating
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                      onClick={() => handleStarClick(star)}
                    />
                  ))}
                </div>
              </div>
            )}

            <textarea
              className="w-full p-2 text-xs resize-none bg-gray-800 rounded-lg border border-gray-600 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 transition-all"
              placeholder={
                activeTab === "post"
                  ? "What's on your mind?"
                  : "Write your detailed review..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />

            {/* Image Upload */}
            <div
              className={`rounded-lg overflow-hidden border-2 ${
                isDragging
                  ? "border-teal-400 bg-teal-900/20"
                  : "border-gray-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {img ? (
                <div className="relative max-h-64 overflow-y-auto">
                  <img
                    src={img}
                    className="w-full object-contain"
                    alt="Preview"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-gray-800/80 rounded-full p-1 hover:bg-red-500 transition-all"
                    onClick={() => {
                      setImg(null);
                      imgRef.current.value = null;
                    }}
                  >
                    <IoCloseSharp size={12} />
                  </button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center p-8 cursor-pointer w-full"
                  onClick={() => imgRef.current.click()}
                >
                  <FaImage
                    className={`text-3xl mb-2 ${
                      isDragging ? "text-teal-400" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-center text-xs ${
                      isDragging ? "text-teal-300" : "text-gray-400"
                    }`}
                  >
                    {isDragging ? "Drop image here" : "Click to upload"}
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={imgRef}
              onChange={handleImgChange}
            />
          </form>
        </div>

        {/* Emoji Picker */}
        <div className="absolute bottom-14 left-4 z-50" ref={emojiPickerRef}>
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="bg-gray-900 p-1 rounded-lg shadow-xl border border-gray-700">
                  <Picker
                    data={data}
                    onEmojiSelect={addEmoji}
                    theme="dark"
                    previewPosition="none"
                    skinTonePosition="none"
                    perLine={8}
                    emojiSize={20}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-700 bg-gray-900/90 backdrop-blur-sm flex items-center justify-between">
          <button
            type="button"
            ref={emojiButtonRef}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile className="text-yellow-400 text-sm" />
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            className="py-2 px-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-70"
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? (
              <>
                <LoadingSpinner size="xs" />
                {activeTab === "post" ? "Posting..." : "Submitting..."}
              </>
            ) : (
              <>
                <FaPlus size={10} />
                {activeTab === "post" ? "Create Post" : "Submit Review"}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;