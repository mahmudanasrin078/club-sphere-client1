import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { FiPlus, FiEdit, FiUsers, FiMapPin } from "react-icons/fi";

const MyClubs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["managerClubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/clubs");
      return res.data;
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "badge-success";
      case "rejected":
        return "badge-error";
      default:
        return "badge-warning";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#38909D]">
          My <span className="text-[#F6851F]">Clubs</span>
        </h1>
        <Link
          to="/dashboard/manager/clubs/create"
          className="btn bg-[#38909D] text-white hover:bg-[#F6851F] gap-2"
        >
          <FiPlus /> Create Club
        </Link>
      </div>

      {clubs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <div key={club._id} className="card bg-base-100 shadow-sm">
              <figure className="h-32 overflow-hidden">
                <img
                  src={
                    club.bannerImage ||
                    `https://placehold.co/400x200/2563eb/ffffff?text=${
                      encodeURIComponent(club.clubName) || "/placeholder.svg"
                    }`
                  }
                  alt={club.clubName}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex items-start justify-between">
                  <h3 className="card-title text-base">{club.clubName}</h3>
                  <span
                    className={`badge badge-sm ${getStatusBadge(club.status)}`}
                  >
                    {club.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  <span className="flex items-center gap-1">
                    <FiMapPin size={14} /> {club.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers size={14} /> {club.membersCount || 0}
                  </span>
                </div>
                <div className="card-actions justify-end mt-2">
                  <Link
                    to={`/dashboard/manager/clubs/${club._id}/members`}
                    className="btn btn-ghost btn-xs"
                  >
                    Members
                  </Link>
                  <Link
                    to={`/dashboard/manager/clubs/${club._id}/edit`}
                    className="btn bg-[#38909D] text-white btn-xs gap-1"
                  >
                    <FiEdit size={12} /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base-content/60 mb-4">
            You haven't created any clubs yet
          </p>
          <Link
            to="/dashboard/manager/clubs/create"
            className="btn bg-[#38909D] hover:bg-[#F6851F]"
          >
            Create Your First Club
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
