

import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import toast from "react-hot-toast"
import { FiImage } from "react-icons/fi"

const categories = [
  "Photography",
  "Sports",
  "Technology",
  "Arts & Crafts",
  "Music",
  "Outdoors",
  "Gaming",
  "Books",
  "Food & Cooking",
  "Other",
]

const CreateClub = () => {
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return axiosSecure.post("/clubs", data)
    },
    onSuccess: () => {
      toast.success("Club created! Awaiting admin approval.")
      navigate("/dashboard/manager/clubs")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create club")
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate({
      ...data,
      membershipFee: Number.parseFloat(data.membershipFee) || 0,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#38909D] mb-6">Create New<span className="text-[#F6851F]"> Club</span></h1>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Club Name *</span>
              </label>
              <input
                type="text"
                placeholder="Enter club name"
                className={`input input-bordered ${errors.clubName ? "input-error" : ""}`}
                {...register("clubName", { required: "Club name is required" })}
              />
              {errors.clubName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.clubName.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                placeholder="Describe your club..."
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
                  <span className="label-text">Category *</span>
                </label>
                <select
                  className={`select select-bordered ${errors.category ? "select-error" : ""}`}
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.category.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location *</span>
                </label>
                <input
                  type="text"
                  placeholder="City or area"
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
          {/* banner img */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Banner Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered"
                {...register("bannerImage")}
              />
            </div>
            
             {/* Photo URL
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Banner image</span>
                          </label>
                          <div className="relative ">
                            <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                            <input
                              type="file"
                              placeholder="Your photo"
                              className="input input-bordered w-full pl-10 pt-2"
                              {...register("photo", { required: "Photo is required" })}
                            />
                          </div>
            
                          {errors.photo && (
                            <p className="text-error text-sm">{errors.photo.message}</p>
                          )}
                        </div> */}
            
            

            <div className="form-control">
              <label className="label">
                <span className="label-text">Membership Fee ($)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0 for free"
                className="input input-bordered"
                {...register("membershipFee")}
              />
              <label className="label">
                <span className="label-text-alt">Leave 0 or empty for free membership</span>
              </label>
            </div>

            <div className="alert alert-info bg-[#ac6905] text-white">
              <span>Your club will be reviewed by an admin before it becomes visible to the public.</span>
            </div>

            <button type="submit" className="btn bg-[#38909D] w-full text-white hover:bg-[#F6851F]" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Club"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateClub
