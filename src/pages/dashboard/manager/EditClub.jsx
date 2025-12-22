import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { useEffect } from "react";

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
];

const EditClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (club) {
      reset({
        clubName: club.clubName,
        description: club.description,
        category: club.category,
        location: club.location,
        bannerImage: club.bannerImage,
        membershipFee: club.membershipFee,
      });
    }
  }, [club, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return axiosSecure.patch(`/clubs/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Club updated successfully");
      queryClient.invalidateQueries(["managerClubs"]);
      navigate("/dashboard/manager/clubs");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update club");
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      membershipFee: Number.parseFloat(data.membershipFee) || 0,
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl text-[#38909D] font-bold mb-6">
        Edit <span className=" text-[#F6851F] ">Club</span>
      </h1>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Club Name *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${
                  errors.clubName ? "input-error" : ""
                }`}
                {...register("clubName", { required: "Club name is required" })}
              />
              {errors.clubName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.clubName.message}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-24 ${
                  errors.description ? "textarea-error" : ""
                }`}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select
                  className={`select select-bordered ${
                    errors.category ? "select-error" : ""
                  }`}
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location *</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered ${
                    errors.location ? "input-error" : ""
                  }`}
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Banner Image URL</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                {...register("bannerImage")}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Membership Fee ($)</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input input-bordered"
                {...register("membershipFee")}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="btn hover:bg-[#F6851F]  hover:text-white flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-[#38909D] text-white hover:bg-[#F6851F] flex-1"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClub;
