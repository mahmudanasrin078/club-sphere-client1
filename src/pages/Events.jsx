

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { axiosPublic } from "../api/axiosSecure"
import EventCard from "../components/events/EventCard"
import SectionTitle from "../components/common/SectionTitle"
import LoadingSpinner from "../components/common/LoadingSpinner"

const sortOptions = [
  { value: "date-asc", label: "Date (Soonest)" },
  { value: "date-desc", label: "Date (Latest)" },
  { value: "newest", label: "Recently Added" },
  { value: "oldest", label: "Oldest Added" },
]

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState(searchParams.get("sort") || "date-asc")
  const [showUpcoming, setShowUpcoming] = useState(searchParams.get("upcoming") !== "false")

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", sort, showUpcoming],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (sort) params.append("sort", sort)
      if (showUpcoming) params.append("upcoming", "true")

      const res = await axiosPublic.get(`/events?${params.toString()}`)
      return res.data
    },
  })

  const handleSortChange = (newSort) => {
    setSort(newSort)
    const params = new URLSearchParams()
    if (newSort) params.set("sort", newSort)
    if (showUpcoming) params.set("upcoming", "true")
    setSearchParams(params)
  }

  const handleUpcomingToggle = () => {
    const newValue = !showUpcoming
    setShowUpcoming(newValue)
    const params = new URLSearchParams()
    if (sort) params.set("sort", sort)
    if (newValue) params.set("upcoming", "true")
    setSearchParams(params)
  }

  return (
    <div className="section-padding max-w-7xl mx-auto">
      <SectionTitle
        title="Discover"
        span=' Events'
        subtitle="Find exciting events and activities happening in your community"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <label className="label cursor-pointer gap-2">
          <input
            type="checkbox"
            className="accent-[#38909D]"
            checked={showUpcoming}
            onChange={handleUpcomingToggle}
          />
          <span className="label-text ">Show upcoming only</span>
        </label>

        <select className="select select-bordered" value={sort} onChange={(e) => handleSortChange(e.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : events.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/60">No events found</p>
          <p className="text-base-content/40 mt-2">Check back later for new events</p>
        </div>
      )}
    </div>
  )
}

export default Events
