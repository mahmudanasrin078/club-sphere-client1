

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import toast from "react-hot-toast"

const CreateEvent = () => {
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["managerClubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/manager/clubs")
      return res.data.filter((c) => c.status === "approved")
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const isPaid = watch("isPaid", false)

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return axiosSecure.post("/events", data)
    },
    onSuccess: () => {
      toast.success("Event created successfully!")
      navigate("/dashboard/manager/events")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create event")
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate({
      ...data,
      isPaid: data.isPaid || false,
      eventFee: data.isPaid ? Number.parseFloat(data.eventFee) || 0 : 0,
      maxAttendees: data.maxAttendees ? Number.parseInt(data.maxAttendees) : null,
    })
  }

  if (clubsLoading) return <LoadingSpinner />

  if (clubs.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">No Approved Clubs</h2>
        <p className="text-base-content/60">You need an approved club to create events.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Club *</span>
              </label>
              <select
                className={`select select-bordered ${errors.clubId ? "select-error" : ""}`}
                {...register("clubId", { required: "Please select a club" })}
              >
                <option value="">Select club</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              {errors.clubId && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.clubId.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Event Title *</span>
              </label>
              <input
                type="text"
                placeholder="Enter event title"
                className={`input input-bordered ${errors.title ? "input-error" : ""}`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.title.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                placeholder="Describe your event..."
                className={`textarea textarea-bordered h-24 ${errors.description ? "textarea-error" : ""}`}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date & Time *</span>
                </label>
                <input
                  type="datetime-local"
                  className={`input input-bordered ${errors.eventDate ? "input-error" : ""}`}
                  {...register("eventDate", { required: "Date is required" })}
                />
                {errors.eventDate && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.eventDate.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location *</span>
                </label>
                <input
                  type="text"
                  placeholder="Event location"
                  className={`input input-bordered ${errors.location ? "input-error" : ""}`}
                  {...register("location", { required: "Location is required" })}
                />
                {errors.location && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.location.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Max Attendees (optional)</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
                className="input input-bordered"
                {...register("maxAttendees")}
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox checkbox-primary" {...register("isPaid")} />
                <span className="label-text">This is a paid event</span>
              </label>
            </div>

            {isPaid && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Fee ($) *</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter event fee"
                  className={`input input-bordered ${errors.eventFee ? "input-error" : ""}`}
                  {...register("eventFee", {
                    required: isPaid ? "Event fee is required for paid events" : false,
                    min: { value: 0.01, message: "Fee must be greater than 0" },
                  })}
                />
                {errors.eventFee && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.eventFee.message}</span>
                  </label>
                )}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
