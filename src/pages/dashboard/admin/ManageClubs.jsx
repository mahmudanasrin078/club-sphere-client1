import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiCheck, FiX, FiUsers, FiCalendar } from "react-icons/fi";

const ManageClubs = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["adminClubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/clubs");
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return axiosSecure.patch(`/admin/clubs/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Club status updated");
      queryClient.invalidateQueries(["adminClubs"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const handleStatusChange = async (club, newStatus) => {
    const action = newStatus === "approved" ? "approve" : "reject";
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Club`,
      text: `Are you sure you want to ${action} "${club.clubName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
      confirmButtonColor: newStatus === "approved" ? "#22c55e" : "#ef4444",
    });

    if (result.isConfirmed) {
      updateStatusMutation.mutate({ id: club._id, status: newStatus });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-[#38909D] text-white p-3";
      case "rejected":
        return "bg-red-500 text-white p-3";
      default:
        return "badge-warning text-white";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#38909D] mb-6">
        Manage <span className="text-[#F6851F]">Clubs</span>
      </h1>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Club</th>
              <th>Manager</th>
              <th>Fee</th>
              <th>Members</th>
              <th>Events</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded">
                        <img
                          src={
                            club.bannerImage ||
                            `https://placehold.co/48x48/2563eb/ffffff?text=${
                              club.clubName.charAt(0) || "/placeholder.svg"
                            }`
                          }
                          alt={club.clubName}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{club.clubName}</p>
                      <p className="text-xs text-base-content/60">
                        {club.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-sm">{club.managerEmail}</td>
                <td>
                  {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                </td>
                <td>
                  <span className="flex items-center gap-1">
                    <FiUsers size={14} /> {club.membersCount || 0}
                  </span>
                </td>
                <td>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} /> {club.eventsCount || 0}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadge(club.status)}`}>
                    {club.status}
                  </span>
                </td>
                <td>
                  {club.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(club, "approved")}
                        className="btn bg-[#38909D] text-white btn-xs"
                        disabled={updateStatusMutation.isPending}
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(club, "rejected")}
                        className="btn bg-red-500 text-white btn-xs"
                        disabled={updateStatusMutation.isPending}
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClubs;
