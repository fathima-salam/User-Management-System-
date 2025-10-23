import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, imageUpdateUpload, logout, updateUserData } from "../../../redux-toolkit/userDataReducer";
import { toast } from "react-hot-toast";

function Profile() {
  const [image, setImage] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const loading = useSelector((state) => state.userData.loading);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.userData.name);
  const email = useSelector((state) => state.userData.email);
  const id = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.userData.token);
  const profileImage = useSelector((state) => state.userData.profile_Image);
  const err = useSelector((state) => state.userData.error);

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    name: name,
    email: email,
  });

  // Redirect to login if token is lost (cross-tab logout)
  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Update local state when Redux state changes
  useEffect(() => {
    setData({
      name: name,
      email: email,
    });
  }, [name, email]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }
    setUploadLoading(true);
    const uploadData = new FormData();
    uploadData.append("profileImage", image);
    dispatch(imageUpdateUpload({ data: uploadData, token }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Profile image updated successfully!");
        setUploadLoading(false);
        setImage(null);
      })
      .catch((err) => {
        setUploadLoading(false);
        toast.error(err.message || "Something went wrong in uploading image");
      });
  };

  function validation(data) {
    const { name, email } = data;

    if (!name || name.trim() === "") {
      return { valid: false, message: "Name is required", type: 'name' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { valid: false, message: "Please enter a valid email address", type: 'email' };
    }

    return { valid: true, message: "Validation successful" };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = validation(data);
    if (!validationResult.valid) {
      toast.error(validationResult.message);
      return;
    }
    dispatch(updateUserData({ data, id, token }))
      .unwrap()
      .then((res) => {
        toast.success("Updated Successfully");
        setIsEditing(false);
      })
      .catch((err) => {
        setIsEditing(false);
        setData({ name: name, email: email });
        toast.error(err.message);
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen bg-black">
      {
        loading && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-semibold text-gray-800">Loading...</span>
            </div>
          </div>
        )
      }

      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-white hover:text-gray-300 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={() => {
              dispatch(logout());
              toast.success("Logout Successfully");
              navigate("/login");
            }}
            className="bg-white text-black py-2 px-6 rounded-lg font-semibold hover:shadow-[4px_4px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-gray-400">Manage your account information and settings</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-900 border-2 border-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">Account Details</h2>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Section - Profile Picture */}
              <div className="flex flex-col items-center md:items-start space-y-6">
                <div className="text-center md:text-left w-full">
                  <h3 className="text-lg font-bold text-white mb-4 tracking-wide">PROFILE PICTURE</h3>
                  
                  <div className="flex flex-col items-center space-y-4">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-700"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
                        <span className="text-6xl text-white font-bold">
                          {name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}

                    <form className="w-full max-w-sm" onSubmit={handleProfileSubmit}>
                      <div className="mb-4">
                        <label className="block w-full cursor-pointer">
                          <div className="border-2 border-gray-700 bg-black rounded-lg p-4 hover:border-white transition-all duration-300 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setImage(e.target.files[0])}
                              className="hidden"
                            />
                            <span className="text-gray-400 text-sm">
                              {image ? image.name : "Choose an image file"}
                            </span>
                          </div>
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-white text-black py-3 px-4 rounded-lg font-bold hover:shadow-[4px_4px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={uploadLoading}
                      >
                        {uploadLoading ? "Uploading..." : "Upload Image"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Section - User Information */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 tracking-wide">USER INFORMATION</h3>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block mb-2 font-bold text-white text-sm tracking-wide">
                        NAME
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="w-full p-3 border-2 border-gray-700 bg-black text-white rounded-lg outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-bold text-white text-sm tracking-wide">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="w-full p-3 border-2 border-gray-700 bg-black text-white rounded-lg outline-none focus:border-white focus:shadow-[4px_4px_0px_#ffffff] transition-all duration-300"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-white text-black py-3 px-4 rounded-lg font-bold hover:shadow-[4px_4px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setData({ name: name, email: email });
                          setIsEditing(false);
                        }}
                        className="flex-1 bg-gray-800 text-white border-2 border-gray-700 py-3 px-4 rounded-lg font-bold hover:border-white transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-5">
                      <label className="block text-gray-400 text-sm font-semibold mb-2">NAME</label>
                      <p className="text-white text-xl font-semibold">{name || 'Not set'}</p>
                    </div>
                    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-5">
                      <label className="block text-gray-400 text-sm font-semibold mb-2">EMAIL</label>
                      <p className="text-white text-xl font-semibold">{email || 'Not set'}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-white text-black py-3 px-4 rounded-lg font-bold hover:shadow-[4px_4px_0px_#ffffff] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 mt-6"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Profile;