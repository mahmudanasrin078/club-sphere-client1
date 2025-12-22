import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { format } from "date-fns";

const MyEvents = () => {
  const axiosSecure = useAxiosSecure();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["memberRegistrations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/registrations");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl text-[#38909D] font-bold mb-6">
        My <span className="text-[#F6851F]">Events</span>
      </h1>

      {registrations.length > 0 ? (
        <>
          {/*  DESKTOP  */}
          <div className="hidden md:block card bg-base-100 shadow-sm overflow-x-auto">
            <table className="table min-w-[800px]">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Club</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td className="font-medium">{reg.event?.title}</td>
                    <td>{reg.club?.clubName}</td>
                    <td>
                      {format(
                        new Date(reg.event?.eventDate),
                        "MMM dd, yyyy h:mm a"
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reg.status === "registered"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/events/${reg.event?._id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  MOBILE VIEW */}
          <div className="md:hidden space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="bg-base-100 rounded-lg shadow p-4 space-y-3"
              >
                <h3 className="font-semibold text-lg">{reg.event?.title}</h3>

                <p className="text-sm text-gray-500">{reg.club?.clubName}</p>

                <p className="text-sm">
                  📅{" "}
                  {format(
                    new Date(reg.event?.eventDate),
                    "MMM dd, yyyy h:mm a"
                  )}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className={`badge ${
                      reg.status === "registered"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {reg.status}
                  </span>

                  <Link
                    to={`/events/${reg.event?._id}`}
                    className="btn btn-outline btn-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-base-content/60 mb-4">
            You haven't registered for any events yet
          </p>
          <Link
            to="/events"
            className="btn  bg-[#38909D] text-white hover:bg-[#F6851F]"
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
