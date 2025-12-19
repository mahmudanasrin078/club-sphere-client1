"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { axiosPublic } from "../api/axiosSecure"
import ClubCard from "../components/clubs/ClubCard"
import SectionTitle from "../components/common/SectionTitle"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { FiSearch } from "react-icons/fi"

const categories = [
  "All",
  "Photography",
  "Sports",
  "Technology",
  "Arts & Crafts",
  "Music",
  "Outdoors",
  "Gaming",
  "Books",
  "Food & Cooking",
]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "fee-high", label: "Highest Fee" },
  { value: "fee-low", label: "Lowest Fee" },
  { value: "name-az", label: "Name (A-Z)" },
  { value: "name-za", label: "Name (Z-A)" },
]

const Clubs = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "All")
  const [sort, setSort] = useState(searchParams.get("sort") || "newest")

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs", search, category, sort],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (category && category !== "All") params.append("category", category)
      if (sort) params.append("sort", sort)

      const res = await axiosPublic.get(`/clubs?${params.toString()}`)
      return res.data
    },
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "All") params.set("category", category)
    if (sort) params.set("sort", sort)
    setSearchParams(params)
  }

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (newCategory !== "All") params.set("category", newCategory)
    if (sort) params.set("sort", sort)
    setSearchParams(params)
  }

  const handleSortChange = (newSort) => {
    setSort(newSort)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "All") params.set("category", category)
    if (newSort) params.set("sort", newSort)
    setSearchParams(params)
  }

  return (
    <div className="section-padding max-w-7xl mx-auto">
      <SectionTitle title="Browse "
      span='Clubs' subtitle="Discover amazing clubs and communities in your area" />

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search clubs..."
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn bg-[#38909D] text-white">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`btn btn-sm ${category === cat ? "bg-[#38909D] " : "btn-outline "}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            className="select select-bordered select-sm ml-auto"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : clubs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/60">No clubs found</p>
          <p className="text-base-content/40 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default Clubs
