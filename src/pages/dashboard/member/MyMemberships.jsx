"use client"

import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import { FiMapPin } from "react-icons/fi"
import { format } from "date-fns"

const MyMemberships = () => {
  const axiosSecure = useAxiosSecure()

  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["memberMemberships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/memberships")
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Clubs</h1>

      {memberships.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberships.map((membership) => (
            <div key={membership._id} className="card bg-base-100 shadow-sm">
              <figure className="h-32 overflow-hidden">
                <img
                  src={
                    membership.club?.bannerImage ||
                    `https://placehold.co/400x200/2563eb/ffffff?text=${encodeURIComponent(membership.club?.clubName || "Club")}`
                  }
                  alt={membership.club?.clubName}
                  className="w-full h-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-base">{membership.club?.clubName}</h3>
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <FiMapPin size={14} />
                  {membership.club?.location}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`badge ${membership.status === "active" ? "badge-success" : "badge-warning"}`}>
                    {membership.status}
                  </span>
                  <span className="text-xs text-base-content/60">
                    Joined {format(new Date(membership.joinedAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <Link to={`/clubs/${membership.club?._id}`} className="btn btn-primary btn-sm mt-2">
                  View Club
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-base-content/60 mb-4">You haven't joined any clubs yet</p>
          <Link to="/clubs" className="btn btn-primary">
            Browse Clubs
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyMemberships
