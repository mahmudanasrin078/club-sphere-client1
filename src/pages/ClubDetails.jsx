

import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { axiosPublic } from "../api/axiosSecure"
import { useAuth } from "../hooks/useAuth"
import { useAxiosSecure } from "../hooks/useAxiosSecure"
import LoadingSpinner from "../components/common/LoadingSpinner"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { useState } from "react"
import { FiMapPin, FiUsers, FiDollarSign, FiCalendar, FiArrowLeft } from "react-icons/fi"
import { format } from "date-fns"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PaymentForm = ({ club, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const axiosSecure = useAxiosSecure()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)

    try {
      const { data } = await axiosSecure.post("/payments/create-payment-intent", {
        clubId: club._id,
      })

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments/confirm", {
          paymentIntentId: paymentIntent.id,
          type: "membership",
          clubId: club._id,
        })
        toast.success("Payment successful! Welcome to the club!")
        onSuccess()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed")
    } finally {
      setProcessing(false)
    }
  }

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
      <button type="submit" disabled={!stripe || processing} className="btn btn-primary w-full">
        {processing ? "Processing..." : `Pay $${club.membershipFee}`}
      </button>
    </form>
  )
}

const ClubDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, dbUser } = useAuth()
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const [showPayment, setShowPayment] = useState(false)

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/clubs/${id}`)
      return res.data
    },
  })

  const { data: membership } = useQuery({
    queryKey: ["membership", id, user?.email],
    queryFn: async () => {
      if (!user) return null
      const res = await axiosSecure.get("/member/memberships")
      return res.data.find((m) => m.clubId.toString() === id)
    },
    enabled: !!user,
  })

  const { data: events = [] } = useQuery({
    queryKey: ["clubEvents", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/events?clubId=${id}&upcoming=true`)
      return res.data
    },
  })

  const joinMutation = useMutation({
    mutationFn: async () => {
      return axiosSecure.post(`/clubs/${id}/join`)
    },
    onSuccess: () => {
      toast.success("Successfully joined the club!")
      queryClient.invalidateQueries(["membership", id])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to join club")
    },
  })

  const handleJoin = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/clubs/${id}` } })
      return
    }

    if (club.membershipFee > 0) {
      setShowPayment(true)
    } else {
      const result = await Swal.fire({
        title: "Join Club",
        text: `Are you sure you want to join ${club.clubName}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Join!",
      })

      if (result.isConfirmed) {
        joinMutation.mutate()
      }
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (!club) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold">Club not found</h2>
        <Link to="/clubs" className="btn btn-primary mt-4">
          Browse Clubs
        </Link>
      </div>
    )
  }

  return (
    <div className="section-padding max-w-7xl mx-auto">
      <Link to="/clubs" className="btn btn-ghost gap-2 mb-6">
        <FiArrowLeft /> Back to Clubs
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="aspect-video rounded-xl overflow-hidden">
            <img
              src={
                club.bannerImage ||
                `https://placehold.co/800x400/2563eb/ffffff?text=${encodeURIComponent(club.clubName)}`
              }
              alt={club.clubName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div>
            <div className="badge badge-primary mb-2">{club.category}</div>
            <h1 className="text-3xl font-bold mb-4">{club.clubName}</h1>
            <div className="flex flex-wrap gap-4 text-base-content/70 mb-6">
              <span className="flex items-center gap-2">
                <FiMapPin /> {club.location}
              </span>
              <span className="flex items-center gap-2">
                <FiUsers /> {club.membersCount || 0} members
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar /> {club.eventsCount || 0} events
              </span>
            </div>
            <p className="text-base-content/80">{club.description}</p>
          </div>

          {/* Club Events */}
          {events.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <Link key={event._id} to={`/events/${event._id}`} className="card bg-base-100 shadow-sm card-hover">
                    <div className="card-body p-4 flex-row items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-base-content/60">
                          {format(new Date(event.eventDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <span className="badge badge-secondary">{event.isPaid ? `$${event.eventFee}` : "Free"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg sticky top-24">
            <div className="card-body">
              <h2 className="card-title">
                <FiDollarSign />
                {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"} / membership
              </h2>

              {membership ? (
                <div className="space-y-4">
                  <div className="alert alert-success">
                    <span>You are already a member!</span>
                  </div>
                  <p className="text-sm text-base-content/60">
                    Joined on {format(new Date(membership.joinedAt), "MMM dd, yyyy")}
                  </p>
                </div>
              ) : showPayment && club.membershipFee > 0 ? (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    club={club}
                    onSuccess={() => {
                      setShowPayment(false)
                      queryClient.invalidateQueries(["membership", id])
                    }}
                  />
                </Elements>
              ) : (
                <button onClick={handleJoin} disabled={joinMutation.isPending} className="btn btn-primary w-full">
                  {joinMutation.isPending ? "Joining..." : "Join Club"}
                </button>
              )}

              {!user && (
                <p className="text-sm text-center text-base-content/60">
                  <Link to="/login" className="link link-primary">
                    Login
                  </Link>{" "}
                  to join this club
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClubDetails
