import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, BarChart3, FileText, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/bias", icon: BarChart3, label: "Bias" },
    { to: "/trades", icon: FileText, label: "Trades" },
    { to: "/rules", icon: Settings, label: "Rules" },
  ];

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-1/3 -translate-x-1/2 bg-gray-200 shadow-lg border border-gray-100 rounded-2xl flex justify-between items-center px-6 py-3 w-[90%] max-w-md"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-gray-500 transition-all ${
                isActive ? "text-indigo-600 scale-110" : "hover:text-indigo-500"
              }`
            }
          >
            <Icon size={22} />
          </NavLink>
        );
      })}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center text-gray-500 hover:text-red-500 transition-all"
      >
        <LogOut size={22} />
      </button>
    </motion.nav>
  );
}
