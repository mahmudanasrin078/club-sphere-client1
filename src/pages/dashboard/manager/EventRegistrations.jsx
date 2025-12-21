

import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import { format } from "date-fns"
import { FiArrowLeft } from "react-icons/fi"

const EventRegistrations = () => {
  const { id } = useParams()
  const axiosSecure = useAxiosSecure()

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["eventRegistrations", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/events/${id}/registrations`)
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <Link to="/dashboard/manager/events" className="btn btn-ghost  text-[#38909D] gap-2 mb-4">
        <FiArrowLeft /> Back to Events
      </Link>

      <h1 className="text-2xl text-[#38909D] font-bold mb-6">Event <span className="text-[#F6851F]">Registrations</span></h1>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <tr key={reg._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={
                              reg.user?.photoURL ||
                              `https://ui-avatars.com/api/?name=${reg.user?.name || "User"}&background=2563eb&color=fff`
                            }
                            alt={reg.user?.name}
                          />
                        </div>
                      </div>
                      <span className="font-medium">{reg.user?.name}</span>
                    </div>
                  </td>
                  <td>{reg.userEmail}</td>
                  <td>
                    <span className={`badge ${reg.status === "registered" ? "badge-success" : "badge-error"}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td>{format(new Date(reg.registeredAt), "MMM dd, yyyy h:mm a")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-base-content/60">
                  No registrations yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EventRegistrations
