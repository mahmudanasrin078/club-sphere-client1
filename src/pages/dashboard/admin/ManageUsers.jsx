"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import { useAuth } from "../../../hooks/useAuth"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { format } from "date-fns"

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const { dbUser } = useAuth()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users")
      return res.data
    },
  })

  const updateRoleMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      return axiosSecure.patch(`/admin/users/${email}/role`, { role })
    },
    onSuccess: () => {
      toast.success("Role updated successfully")
      queryClient.invalidateQueries(["adminUsers"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role")
    },
  })

  const handleRoleChange = async (user, newRole) => {
    if (user.email === dbUser.email) {
      toast.error("You cannot change your own role")
      return
    }

    const result = await Swal.fire({
      title: "Change Role",
      text: `Are you sure you want to change ${user.name}'s role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
    })

    if (result.isConfirmed) {
      updateRoleMutation.mutate({ email: user.email, role: newRole })
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${user.name || "/placeholder.svg"}&background=2563eb&color=fff`
                          }
                          alt={user.name}
                        />
                      </div>
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === "admin"
                        ? "badge-error"
                        : user.role === "clubManager"
                          ? "badge-secondary"
                          : "badge-primary"
                    }`}
                  >
                    {user.role === "clubManager" ? "Manager" : user.role}
                  </span>
                </td>
                <td>{format(new Date(user.createdAt), "MMM dd, yyyy")}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    disabled={user.email === dbUser.email}
                  >
                    <option value="member">Member</option>
                    <option value="clubManager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageUsers
