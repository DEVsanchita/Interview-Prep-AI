import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/userContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, clearUser } = useContext(UserContext);

  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [imagePreview, setImagePreview] = useState(
    user?.profileImageUrl || ""
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ================= IMAGE UPLOAD =================

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed");
      return;
    }

    // Check file size
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    try {
      setUploading(true);

      // Show preview immediately
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.imageUrl;

      // Update profile with uploaded image URL
      const updateResponse = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        {
          profileImageUrl: imageUrl,
        }
      );

      updateUser({
        ...user,
        ...updateResponse.data.user,
      });

      setImagePreview(imageUrl);

      toast.success("Profile photo updated successfully");
    } catch (error) {
      console.error("Image upload error:", error);

      // Restore old image if upload fails
      setImagePreview(user?.profileImageUrl || "");

      toast.error(
        error.response?.data?.message ||
          "Failed to upload profile photo"
      );
    } finally {
      setUploading(false);

      // Allow selecting the same image again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ================= UPDATE NAME =================

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        {
          name: name.trim(),
        }
      );

      updateUser({
        ...user,
        ...response.data.user,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE ACCOUNT =================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await axiosInstance.delete(
        API_PATHS.AUTH.DELETE_ACCOUNT
      );

      clearUser();

      toast.success("Account deleted successfully");

      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete account"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    clearUser();

    toast.success("Logged out successfully");

    navigate("/");
  };

  // ================= NO USER =================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Please login first
          </h2>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-600 hover:text-black mb-4"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your account information
          </p>
        </div>


        {/* Profile Card */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          {/* Profile Photo */}

          <div className="flex flex-col items-center mb-8">

            <div className="relative">

              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-semibold text-gray-500">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}

              </div>

              {/* Camera Button */}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 disabled:opacity-50"
              >
                📷
              </button>

            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <p className="text-sm text-gray-500 mt-3">
              {uploading
                ? "Uploading..."
                : "Click the camera icon to change photo"}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG or WebP • Maximum 2MB
            </p>

          </div>


          {/* Name */}

          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your name"
            />

          </div>


          {/* Email */}

          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />

            <p className="text-xs text-gray-400 mt-2">
              Email cannot be changed.
            </p>

          </div>


          {/* Save Button */}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>


        {/* Account Actions */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account
          </h2>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 mb-3"
          >
            Log Out
          </button>


          {/* Delete */}

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="w-full py-3 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 disabled:opacity-50"
          >
            {deleting
              ? "Deleting Account..."
              : "Delete Account"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;