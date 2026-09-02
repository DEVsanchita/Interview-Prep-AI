import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import { getInitials } from "../../utils/helper";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return null;

  const logout = () => {
    clearUser();
    navigate("/");
  };

  const openProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="flex items-center gap-2.5">

      {/* Profile Photo */}
      <button
        onClick={openProfile}
        className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-orange-100 text-xs font-black text-orange-700 cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
        title="View Profile"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          getInitials(user.name)
        )}
      </button>

      <div className="hidden sm:block">

        {/* Name */}
        <button
          onClick={openProfile}
          className="max-w-28 truncate text-xs font-bold text-slate-800 hover:text-orange-500 transition"
          title="View Profile"
        >
          {user.name}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500"
        >
          <LuLogOut size={11} />
          Logout
        </button>

      </div>
    </div>
  );
};

export default ProfileInfoCard;