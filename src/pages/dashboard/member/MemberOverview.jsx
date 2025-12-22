

import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import StatCard from "../../../components/dashboard/StatCard"
import { FiCalendar } from "react-icons/fi"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { format } from "date-fns"

const MemberOverview = () => {
  const axiosSecure = useAxiosSecure()

  const { data: stats, isLoading } = useQuery({
    queryKey: ["memberStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/stats")
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl text-[#38909D] font-bold mb-6">Welcome <span className="   text-[#F6851F]">Back!</span></h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <StatCard title="Clubs Joined" value={stats?.totalClubs || 0} icon={HiOutlineBuildingOffice2} color="primary" />
        <StatCard title="Events Registered" value={stats?.totalEvents || 0} icon={FiCalendar} color="secondary" />
      </div>

      {/* Upcoming Events */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Upcoming Events</h2>
          {stats?.upcomingEvents?.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingEvents.map((reg) => (
                <Link
                  key={reg._id}
                  to={`/events/${reg.event._id}`}
                  className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <div>
                    <p className="font-medium">{reg.event.title}</p>
                    <p className="text-sm text-base-content/60">{reg.club.clubName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{format(new Date(reg.event.eventDate), "MMM dd")}</p>
                    <p className="text-xs text-base-content/60">{format(new Date(reg.event.eventDate), "h:mm a")}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-base-content/60">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberOverview
