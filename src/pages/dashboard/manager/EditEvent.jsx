import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { useEffect } from "react";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const isPaid = watch("isPaid", false);

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.eventDate);
      reset({
        title: event.title,
        description: event.description,
        eventDate: eventDate.toISOString().slice(0, 16),
        location: event.location,
        isPaid: event.isPaid,
        eventFee: event.eventFee,
        maxAttendees: event.maxAttendees || "",
      });
    }
  }, [event, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return axiosSecure.patch(`/events/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries(["managerEvents"]);
      navigate("/dashboard/manager/events");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update event");
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      isPaid: data.isPaid || false,
      eventFee: data.isPaid ? Number.parseFloat(data.eventFee) || 0 : 0,
      maxAttendees: data.maxAttendees
        ? Number.parseInt(data.maxAttendees)
        : null,
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl text-[#38909D] font-bold mb-6">
        Edit <span className=" text-[#F6851F]">Event</span>
      </h1>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Event Title *</span>
              </label>
              <input
                type="text"
                className={`input input-bordered ${
                  errors.title ? "input-error" : ""
                }`}
                {...register("title", { required: "Title is required" })}
              />
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
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date & Time *</span>
                </label>
                <input
                  type="datetime-local"
                  className={`input input-bordered ${
                    errors.eventDate ? "input-error" : ""
                  }`}
                  {...register("eventDate", { required: "Date is required" })}
                />
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
                <span className="label-text">Max Attendees</span>
              </label>
              <input
                type="number"
                min="1"
                className="input input-bordered"
                {...register("maxAttendees")}
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className=" accent-[#38909D]"
                  {...register("isPaid")}
                />
                <span className="label-text">This is a paid event</span>
              </label>
            </div>

            {isPaid && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Event Fee ($)</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="input input-bordered"
                  {...register("eventFee")}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                className="btn  bg-[#F6851F] text-white hover:bg-[#38909D] flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn  bg-[#38909D] text-white hover:bg-[#F6851F] flex-1"
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

export default EditEvent;
