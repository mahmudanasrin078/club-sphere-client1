"use client"

import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import toast from "react-hot-toast"
import { format } from "date-fns"
import { FiArrowLeft } from "react-icons/fi"

const ClubMembers = () => {
  const { id } = useParams()
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["clubMembers", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}/members`)
      return res.data
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ membershipId, status }) => {
      return axiosSecure.patch(`/memberships/${membershipId}/status`, { status })
    },
    onSuccess: () => {
      toast.success("Membership status updated")
      queryClient.invalidateQueries(["clubMembers", id])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status")
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <Link to="/dashboard/manager/clubs" className="btn btn-ghost gap-2 mb-4">
        <FiArrowLeft /> Back to Clubs
      </Link>

      <h1 className="text-2xl font-bold mb-6">Club Members</h1>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr key={member._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={
                              member.user?.photoURL ||
                              `https://ui-avatars.com/api/?name=${member.user?.name || "User"}&background=2563eb&color=fff`
                            }
                            alt={member.user?.name}
                          />
                        </div>
                      </div>
                      <span className="font-medium">{member.user?.name}</span>
                    </div>
                  </td>
                  <td>{member.userEmail}</td>
                  <td>
                    <span
                      className={`badge ${member.status === "active" ? "badge-success" : member.status === "expired" ? "badge-error" : "badge-warning"}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td>{format(new Date(member.joinedAt), "MMM dd, yyyy")}</td>
                  <td>
                    <select
                      className="select select-bordered select-sm"
                      value={member.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          membershipId: member._id,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="pendingPayment">Pending</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-base-content/60">
                  No members yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClubMembers
