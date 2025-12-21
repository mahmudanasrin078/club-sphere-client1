

import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { format } from "date-fns"
import { FiPlus, FiEdit, FiTrash2, FiUsers } from "react-icons/fi"

const ManagerEvents = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["managerEvents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/events")
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/events/${id}`)
    },
    onSuccess: () => {
      toast.success("Event deleted")
      queryClient.invalidateQueries(["managerEvents"])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete event")
    },
  })

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: "Delete Event",
      text: `Are you sure you want to delete "${event.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#ef4444",
    })

    if (result.isConfirmed) {
      deleteMutation.mutate(event._id)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#38909D] font-bold">My <span className="text-[#F6851F]">Events</span></h1>
        <Link to="/dashboard/manager/events/create" className="btn bg-[#38909D] text-white hover:bg-[#F6851F] gap-2">
          <FiPlus /> Create Event
        </Link>
      </div>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Club</th>
              <th>Date</th>
              <th>Type</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event._id}>
                  <td>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-base-content/60">{event.location}</p>
                    </div>
                  </td>
                  <td>{event.club?.clubName}</td>
                  <td>{format(new Date(event.eventDate), "MMM dd, yyyy h:mm a")}</td>
                  <td>
                    <span className={`badge ${event.isPaid ? "badge-warning" : "badge-success"}`}>
                      {event.isPaid ? `$${event.eventFee}` : "Free"}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1">
                      <FiUsers size={14} />
                      {event.registrationsCount || 0}
                      {event.maxAttendees ? ` / ${event.maxAttendees}` : ""}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/manager/events/${event._id}/registrations`}
                        className="btn btn-ghost btn-xs"
                      >
                        View
                      </Link>
                      <Link to={`/dashboard/manager/events/${event._id}/edit`} className="btn btn-ghost btn-xs">
                        <FiEdit />
                      </Link>
                      <button onClick={() => handleDelete(event)} className="btn btn-ghost btn-xs text-error">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-base-content/60">
                  No events created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManagerEvents
