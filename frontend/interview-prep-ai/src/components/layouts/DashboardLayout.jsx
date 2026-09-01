import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#faf9f7]"><div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" /></div>;
  if (!user) return <Navigate to="/" replace />;
  return <div className="min-h-screen"><Navbar />{children}</div>;
};
export default DashboardLayout;
