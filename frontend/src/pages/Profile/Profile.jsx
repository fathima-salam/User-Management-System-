import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, imageUpdateUpload, logout, updateUserData } from "../../../redux-toolkit/userDataReducer";
import { toast } from "react-hot-toast";

function Profile() {
  const [image, setImage] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const loading = useSelector((state) => state.userData.loading)


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


  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

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
        toast.error(err.message.message || "Something went wrong in uploading image");
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
        console.log(err)
      });
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      {
        loading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-[#002f34] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-semibold text-gray-800">Loading...</span>
            </div>
          </div>
        )
      }

      <h1 onClick={() => navigate("/")} className="cursor-pointer text-blue-600 mb-4">
        Back to home
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={() => {
              dispatch(logout());
              toast.success("Logout Successfully");
              navigate("/login");
            }}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-500">
                  {name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <form className="mt-4" onSubmit={handleProfileSubmit}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <button
                type="submit"
                className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Upload Image"}
              </button>
            </form>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData({ name: name, email: email });
                      setIsEditing(false);
                    }}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-gray-600">{email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;