"use client"

import { useAuth } from "../../hooks/useAuth"
import { useRole } from "../../hooks/useRole"
import { FiMail, FiUser, FiShield, FiCalendar } from "react-icons/fi"
import { format } from "date-fns"

const Profile = () => {
  const { user, dbUser } = useAuth()
  const { role } = useRole()

  const getRoleBadgeColor = () => {
    switch (role) {
      case "admin":
        return "badge-error"
      case "clubManager":
        return "badge-secondary"
      default:
        return "badge-primary"
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    user?.photoURL ||
                    dbUser?.photoURL ||
                    `https://ui-avatars.com/api/?name=${dbUser?.name || "User"}&background=2563eb&color=fff&size=96`
                  }
                  alt={dbUser?.name}
                />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">{dbUser?.name || user?.displayName}</h2>
              <span className={`badge ${getRoleBadgeColor()} capitalize`}>
                {role === "clubManager" ? "Club Manager" : role}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiUser className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Full Name</p>
                <p className="font-medium">{dbUser?.name || user?.displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiMail className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Email Address</p>
                <p className="font-medium">{dbUser?.email || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiShield className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Role</p>
                <p className="font-medium capitalize">{role === "clubManager" ? "Club Manager" : role}</p>
              </div>
            </div>

            {dbUser?.createdAt && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiCalendar className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Member Since</p>
                  <p className="font-medium">{format(new Date(dbUser.createdAt), "MMMM dd, yyyy")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
