

import { useAuth } from "../../hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"
import { FiMenu, FiLogOut, FiHome } from "react-icons/fi"

const DashboardTopbar = ({ onMenuClick }) => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate("/")
  }

  return (
    <header className="bg-base-100 shadow-sm sticky top-0 z-30">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden btn btn-ghost btn-square" onClick={onMenuClick}>
            <FiMenu size={24} />
          </button>
          <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-ghost btn-sm gap-2">
            <FiHome size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm gap-2">
            <FiLogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar
