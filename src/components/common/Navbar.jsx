"use client";

import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { user, dbUser, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
  ];

  const handleLogout = async () => {
    await logoutUser();
  };

  const getDashboardPath = () => {
    if (dbUser?.role === "admin") return "/dashboard/admin";
    if (dbUser?.role === "clubManager") return "/dashboard/manager";
    return "/dashboard/member";
  };

  return (
    <div className="">
      <nav className="bg-base-100 shadow-md sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#38909D] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CS</span>
              </div>
              <span className="text-xl text-[#38909D] font-bold hidden sm:block">
                Club <span className="text-[#F6851F]">Sphere</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 text-[#38909D]">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-medium  transition-colors ${
                      isActive
                        ? "text-[#38909D] "
                        : "text-neutral hover:text-[#F6851F] hover:underline"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Auth section */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full ring ring-[#38909D] ring-offset-base-100 ring-offset-2">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${
                            user.displayName || "User"
                          }&background=38909D&color=fff`
                        }
                        alt={user.displayName}
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-50 p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4"
                  >
                    <li className="menu-title">
                      <span className="text-sm font-semibold">
                        {user.displayName}
                      </span>
                      <span className="text-xs text-base-content/60 capitalize">
                        {dbUser?.role || "Member"}
                      </span>
                    </li>
                    <li>
                      <Link to="/dashboard/profile">
                        <FiUser /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to={getDashboardPath()}>
                        <FiGrid /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-error">
                        <FiLogOut /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost">
                    Login
                  </Link>
                  <Link to="/register" className="btn bg-[#38909D] text-white">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-ghost btn-square"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg ${
                        isActive ? "bg-primary/10 text-primary" : ""
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {user ? (
                  <>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left text-error"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-4 pt-2">
                    <Link to="/login" className="btn btn-ghost flex-1">
                      Login
                    </Link>
                    <Link to="/register" className="btn bg-[#38909D] flex-1">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
