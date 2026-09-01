import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import { getInitials } from "../../utils/helper";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  if (!user) return null;
  const logout = () => { clearUser(); navigate("/"); };
  return <div className="flex items-center gap-2.5"><div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-orange-100 text-xs font-black text-orange-700">{user.profileImageUrl ? <img src={user.profileImageUrl} alt="Profile" className="h-full w-full object-cover"/> : getInitials(user.name)}</div><div className="hidden sm:block"><p className="max-w-28 truncate text-xs font-bold text-slate-800">{user.name}</p><button onClick={logout} className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500"><LuLogOut size={11}/> Logout</button></div></div>;
};
export default ProfileInfoCard;
