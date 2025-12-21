import { Link } from "react-router-dom"
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign } from "react-icons/fi"
import { format } from "date-fns"

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy - h:mm a")
    } catch {
      return "Date TBD"
    }
  }

  return (
    <div className="card bg-base-100 shadow-md card-hover h-full">
      <div className="card-body p-4">
        <div className="flex  items-start justify-between gap-2">
          <div className="badge bg-[#38909D] text-white badge-sm">{event.club?.clubName || "Club Event"}</div>
          {event.isPaid && <div className="badge badge-warning badge-sm text-white">Paid</div>}
        </div>
        <h3 className="card-title text-lg mt-2">{event.title}</h3>
        <p className="text-sm text-base-content/70 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-base-content/60 mt-3">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMapPin size={14} />
            <span>{event.location}</span>
          </div>
          {event.maxAttendees && (
            <div className="flex items-center gap-2">
              <FiUsers size={14} />
              <span>
                {event.registrationsCount || 0} / {event.maxAttendees} spots
              </span>
            </div>
          )}
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <span className="flex items-center gap-1 text-[#F6851F]  font-semibold">
            <FiDollarSign size={16} />
            {event.isPaid && event.eventFee > 0 ? `$${event.eventFee}` : "Free"}
          </span>
          <Link to={`/events/${event._id}`} className="btn text-white bg-[#38909D] hover:bg-[#F6851F] btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
