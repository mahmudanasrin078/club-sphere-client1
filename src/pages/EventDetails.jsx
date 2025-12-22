import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { axiosPublic } from "../api/axiosSecure";
import { useAuth } from "../hooks/useAuth";
import { useAxiosSecure } from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
import { format } from "date-fns";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EventPaymentForm = ({ event, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { data } = await axiosSecure.post(
        "/payments/create-event-payment-intent",
        {
          eventId: event._id,
        }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments/confirm", {
          paymentIntentId: paymentIntent.id,
          type: "event",
          eventId: event._id,
          clubId: event.clubId,
        });
        toast.success("Payment successful! You're registered!");
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg bg-base-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn bg-[#38909D] text-white hover:bg-[#F6851F] w-full"
      >
        {processing ? "Processing..." : `Pay $${event.eventFee}`}
      </button>
    </form>
  );
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/events/${id}`);
      return res.data;
    },
  });

  const { data: registration } = useQuery({
    queryKey: ["eventRegistration", id, user?.email],
    queryFn: async () => {
      if (!user) return null;
      const res = await axiosSecure.get("/member/registrations");
      return res.data.find((r) => r.eventId.toString() === id);
    },
    enabled: !!user,
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      return axiosSecure.post(`/events/${id}/register`);
    },
    onSuccess: () => {
      toast.success("Successfully registered for the event!");
      queryClient.invalidateQueries(["eventRegistration", id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to register");
    },
  });

  const handleRegister = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    if (event.isPaid && event.eventFee > 0) {
      setShowPayment(true);
    } else {
      const result = await Swal.fire({
        title: "Register for Event",
        text: `Are you sure you want to register for ${event.title}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Register!",
      });

      if (result.isConfirmed) {
        registerMutation.mutate();
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Link to="/events" className="btn btn-secondary mt-4">
          Browse Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();
  const isFull =
    event.maxAttendees && event.registrationsCount >= event.maxAttendees;

  return (
    <div className="section-padding max-w-7xl mx-auto">
      <Link to="/events" className="btn btn-ghost text-[#38909D] gap-2 mb-6">
        <FiArrowLeft /> Back to Events
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Link
                to={`/clubs/${event.club?._id}`}
                className="badge bg-[#38909D] text-white badge-lg"
              >
                {event.club?.clubName}
              </Link>
              {event.isPaid && (
                <span className="badge bg-[#F6851F] text-white">
                  Paid Event
                </span>
              )}
              {isPast && <span className="badge badge-error">Past Event</span>}
            </div>

            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-base-200  rounded-lg">
                <FiCalendar className="text-[#38909D]" size={24} />
                <div>
                  <p className="text-sm text-base-content/60">Date</p>
                  <p className="font-semibold">
                    {format(eventDate, "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                <FiClock className="text-[#38909D]" size={24} />
                <div>
                  <p className="text-sm text-base-content/60">Time</p>
                  <p className="font-semibold">{format(eventDate, "h:mm a")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                <FiMapPin className="text-[#38909D]" size={24} />
                <div>
                  <p className="text-sm text-base-content/60">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                <FiUsers className="text-[#38909D]" size={24} />
                <div>
                  <p className="text-sm text-base-content/60">Attendees</p>
                  <p className="font-semibold">
                    {event.registrationsCount || 0}
                    {event.maxAttendees ? ` / ${event.maxAttendees}` : ""}{" "}
                    Registered
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl mb-3 font-bold text-[#38909D]">
                About this <span className="text-[#F6851F] ">event</span>
              </h2>
              <p>{event.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg sticky top-24">
            <div className="card-body">
              <h2 className="card-title text-[#F6851F] ">
                <FiDollarSign />
                {event.isPaid && event.eventFee > 0
                  ? `${event.eventFee}`
                  : "Free"}
              </h2>

              {registration ? (
                <div className="space-y-4">
                  <div className="alert alert-success">
                    <span>You are registered!</span>
                  </div>
                  <p className="text-sm text-base-content/60">
                    Registered on{" "}
                    {format(
                      new Date(registration.registeredAt),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>
              ) : isPast ? (
                <div className="alert alert-error">
                  <span>This event has ended</span>
                </div>
              ) : isFull ? (
                <div className="alert alert-warning">
                  <span>This event is full</span>
                </div>
              ) : showPayment && event.isPaid && event.eventFee > 0 ? (
                <Elements stripe={stripePromise}>
                  <EventPaymentForm
                    event={event}
                    onSuccess={() => {
                      setShowPayment(false);
                      queryClient.invalidateQueries(["eventRegistration", id]);
                    }}
                  />
                </Elements>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="btn bg-[#38909D] text-white hover:bg-[#F6851F] w-full"
                >
                  {registerMutation.isPending
                    ? "Registering..."
                    : "Register Now"}
                </button>
              )}

              {!user && !isPast && !isFull && (
                <p className="text-sm text-center text-base-content/60">
                  <Link to="/login" className="link link-secondary">
                    Login
                  </Link>{" "}
                  to register for this event
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
