import { Link } from "react-router-dom"
import { FiMapPin, FiUsers, FiDollarSign } from "react-icons/fi"

const ClubCard = ({ club }) => {
  return (
    <div className="card bg-base-100 shadow-md card-hover h-full">
      <figure className="h-48 overflow-hidden">
        <img
          src={
            club.bannerImage || `https://placehold.co/400x200/2563eb/ffffff?text=${encodeURIComponent(club.clubName)}`
          }
          alt={club.clubName}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <div className="badge badge-primary badge-outline badge-sm mb-2">{club.category}</div>
        <h3 className="card-title text-lg">{club.clubName}</h3>
        <p className="text-sm text-base-content/70 line-clamp-2">{club.description}</p>
        <div className="flex items-center gap-4 text-sm text-base-content/60 mt-2">
          <span className="flex items-center gap-1">
            <FiMapPin size={14} />
            {club.location}
          </span>
          {club.membersCount !== undefined && (
            <span className="flex items-center gap-1">
              <FiUsers size={14} />
              {club.membersCount}
            </span>
          )}
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <span className="flex items-center gap-1 font-semibold">
            <FiDollarSign size={16} />
            {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
          </span>
          <Link to={`/clubs/${club._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ClubCard
