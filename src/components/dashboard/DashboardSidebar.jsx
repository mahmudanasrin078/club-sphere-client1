import { Link, NavLink, useLocation } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../hooks/useAuth";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCreditCard,
  FiX,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { isAdmin, isManager } = useRole();
  const { dbUser } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: "/dashboard/admin", icon: FiHome, label: "Overview" },
    { to: "/dashboard/admin/users", icon: FiUsers, label: "Manage Users" },
    {
      to: "/dashboard/admin/clubs",
      icon: HiOutlineBuildingOffice2,
      label: "Manage Clubs",
    },
    { to: "/dashboard/admin/payments", icon: FiCreditCard, label: "Payments" },
  ];

  const managerLinks = [
    { to: "/dashboard/manager", icon: FiHome, label: "Overview" },
    {
      to: "/dashboard/manager/clubs",
      icon: HiOutlineBuildingOffice2,
      label: "My Clubs",
    },
    {
      to: "/dashboard/manager/clubs/create",
      icon: FiPlus,
      label: "Create Club",
    },
    { to: "/dashboard/manager/events", icon: FiCalendar, label: "Events" },
  ];

  const memberLinks = [
    { to: "/dashboard/member", icon: FiHome, label: "Overview" },
    {
      to: "/dashboard/member/memberships",
      icon: HiOutlineBuildingOffice2,
      label: "My Clubs",
    },
    { to: "/dashboard/member/events", icon: FiCalendar, label: "My Events" },
    {
      to: "/dashboard/member/payments",
      icon: FiCreditCard,
      label: "Payment History",
    },
  ];

  const getLinks = () => {
    if (isAdmin) return adminLinks;
    if (isManager) return managerLinks;
    return memberLinks;
  };

  const getRoleLabel = () => {
    if (isAdmin) return "Admin";
    if (isManager) return "Club Manager";
    return "Member";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-base-100 shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#38909D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <span className="text-xl text-[#38909D] font-bold hidden sm:block">
              Club <span className="text-[#F6851F]">Sphere</span>
            </span>
          </Link>
          <button
            className="lg:hidden btn btn-ghost btn-sm btn-square"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img
                  src={
                    dbUser?.photoURL ||
                    `https://ui-avatars.com/api/?name=${
                      dbUser?.name || "User"
                    }&background=38909D&color=fff`
                  }
                  alt={dbUser?.name}
                />
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">{dbUser?.name}</p>
              <span className="badge bg-[#ed9548b7]  p-2 badge-sm">
                {getRoleLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="menu menu-compact gap-1">
            {getLinks().map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to.split("/").length <= 3}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3${isActive ? "active" : ""}`
                  }
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              </li>
            ))}

            <div className="divider my-2"></div>

            <li className="">
              <NavLink
                to="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 bg-[#38909D] text-white hover:bg-[#F6851F]${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FiUser size={18} />
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
