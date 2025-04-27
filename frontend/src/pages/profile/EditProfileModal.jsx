import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        favoriteGenres: "",
        favoriteTitle: "",
        watchingNow: "",
        newPassword: "",
        currentPassword: "",
    });

    const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (authUser) {
            setFormData({
                fullName: authUser.fullName || "",
                username: authUser.username || "",
                email: authUser.email || "",
                bio: authUser.bio || "",
                link: authUser.link || "",
                favoriteGenres: authUser.favoriteGenres || "",
                favoriteTitle: authUser.favoriteTitle || "",
                watchingNow: authUser.watchingNow || "",
                newPassword: "",
                currentPassword: "",
            });
        }
    }, [authUser]);

    return (
        <>
            {/* Edit Profile Button */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all shadow-lg"
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Edit Profile
            </button>

            {/* Modal */}
            <dialog id="edit_profile_modal" className="modal">
                <div className="modal-box border border-purple-900/50 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 text-white shadow-2xl rounded-2xl p-6 max-w-lg">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-pink-500/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 rounded-full bg-indigo-500/10 blur-xl"></div>
                    
                    {/* Header */}
                    <div className="relative mb-6">
                        <div className="flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" className="text-pink-500">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7zm3.5-5l2.5 2.5L15.5 6H17v10h-1.5V8l-2 2-2-2v8H10V6z"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                            Customize Your Fandom Profile
                        </h3>
                        <p className="text-center text-gray-400 text-sm mt-1">
                            Show off your entertainment tastes to the community
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className="flex flex-col gap-4 relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateProfile(formData);
                        }}
                    >
                        {/* Basic Info Section */}
                        <div className="space-y-4 mb-2">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-300 border-b border-purple-900/30 pb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Basic Profile
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name" className="cinema-input" value={formData.fullName} name="fullName" onChange={handleInputChange} />
                                <input type="text" placeholder="Username" className="cinema-input" value={formData.username} name="username" onChange={handleInputChange} />
                            </div>
                            
                            <input type="email" placeholder="Email" className="cinema-input" value={formData.email} name="email" onChange={handleInputChange} />
                            
                            <textarea 
                                placeholder="Bio - Tell us about your entertainment journey..." 
                                className="cinema-input h-20 resize-none" 
                                value={formData.bio} 
                                name="bio" 
                                onChange={handleInputChange} 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="Website / Social Link" 
                                className="cinema-input" 
                                value={formData.link} 
                                name="link" 
                                onChange={handleInputChange} 
                            />
                        </div>

                        {/* Entertainment Preferences Section */}
                        <div className="space-y-4 mb-2">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-300 border-b border-purple-900/30 pb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Entertainment Preferences
                            </h4>
                            
                            <input 
                                type="text" 
                                placeholder="Favorite Genres (e.g., Sci-Fi, K-Drama, Shonen Anime, Hip-Hop)" 
                                className="cinema-input" 
                                value={formData.favoriteGenres} 
                                name="favoriteGenres" 
                                onChange={handleInputChange} 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="All-Time Favorite (movie, show, anime, or song)" 
                                className="cinema-input" 
                                value={formData.favoriteTitle} 
                                name="favoriteTitle" 
                                onChange={handleInputChange} 
                            />
                            
                            <input 
                                type="text" 
                                placeholder="Currently Watching/Listening To" 
                                className="cinema-input" 
                                value={formData.watchingNow} 
                                name="watchingNow" 
                                onChange={handleInputChange} 
                            />
                        </div>

                        {/* Change Password Section */}
                        <div className="space-y-4 mb-2">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-300 border-b border-purple-900/30 pb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Change Password
                            </h4>
                            
                            <input 
                                type="password" 
                                placeholder="Current Password" 
                                className="cinema-input" 
                                value={formData.currentPassword} 
                                name="currentPassword" 
                                onChange={handleInputChange} 
                            />
                            
                            <input 
                                type="password" 
                                placeholder="New Password" 
                                className="cinema-input" 
                                value={formData.newPassword} 
                                name="newPassword" 
                                onChange={handleInputChange} 
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-2">
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-70"
                                disabled={isUpdatingProfile}
                            >
                                {isUpdatingProfile ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : "Save Profile"}
                            </button>
                            
                            <form method="dialog" className="flex-shrink-0">
                                <button className="px-4 py-3 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </form>
                </div>
                
                {/* Backdrop click to close */}
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Tailwind Input Styles */}
            <style>
                {`
                    .cinema-input {
                        padding: 12px 16px;
                        border: 2px solid rgba(139, 92, 246, 0.3);
                        border-radius: 12px;
                        background-color: rgba(17, 24, 39, 0.8);
                        color: white;
                        width: 100%;
                        outline: none;
                        transition: all 0.3s;
                        font-size: 16px;
                        backdrop-filter: blur(4px);
                    }
                    .cinema-input:focus {
                        border-color: rgba(147, 51, 234, 0.8);
                        background-color: rgba(15, 23, 42, 0.9);
                        box-shadow: 0 0 12px rgba(147, 51, 234, 0.3);
                    }
                    .cinema-input::placeholder {
                        color: rgba(156, 163, 175, 0.7);
                    }
                    .modal-box {
                        max-height: 90vh;
                        overflow-y: auto;
                        scrollbar-width: thin;
                        scrollbar-color: rgba(139, 92, 246, 0.3) rgba(17, 24, 39, 0.8);
                    }
                    .modal-box::-webkit-scrollbar {
                        width: 6px;
                    }
                    .modal-box::-webkit-scrollbar-track {
                        background: rgba(17, 24, 39, 0.8);
                        border-radius: 10px;
                    }
                    .modal-box::-webkit-scrollbar-thumb {
                        background-color: rgba(139, 92, 246, 0.3);
                        border-radius: 10px;
                    }
                `}
            </style>
        </>
    );
};

export default EditProfileModal;