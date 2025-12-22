import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { format } from "date-fns";

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

 
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        All <span className="text-[#F6851F]">Payments</span>
      </h1>

      {/*  DESKTOP  */}
      <div className="hidden md:block card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table min-w-[900px]">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Club</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.userEmail}</td>

                  <td className="font-semibold">
                    ${payment.amount.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        payment.type === "membership"
                          ? "bg-[#38909D] text-white"
                          : "badge-secondary"
                      }`}
                    >
                      {payment.type}
                    </span>
                  </td>

                  <td>{payment.club?.clubName || "N/A"}</td>

                  <td>{format(new Date(payment.createdAt), "MMM dd, yyyy")}</td>

                  <td>
                    <span className="badge badge-success text-white">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-base-content/60"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  MOBILE VIEW = */}
      <div className="md:hidden space-y-4">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-base-100 rounded-lg shadow p-4 space-y-3"
            >
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium break-all">{payment.userEmail}</p>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">
                  ${payment.amount.toFixed(2)}
                </span>
                <span
                  className={`badge ${
                    payment.type === "membership"
                      ? "bg-[#38909D] text-white"
                      : "badge-secondary"
                  }`}
                >
                  {payment.type}
                </span>
              </div>

              <div className="text-sm">
                <p>
                  <span className="font-medium">Club:</span>{" "}
                  {payment.club?.clubName || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                </p>
              </div>

              <span className="badge badge-success text-white w-fit">
                {payment.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-base-content/60">
            No payments found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
