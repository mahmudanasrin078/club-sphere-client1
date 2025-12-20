

import { useQuery } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import { format } from "date-fns"

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments")
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Payments</h1>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
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
                  <td className="font-semibold">${payment.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${payment.type === "membership" ? "badge-primary" : "badge-secondary"}`}>
                      {payment.type}
                    </span>
                  </td>
                  <td>{payment.club?.clubName || "N/A"}</td>
                  <td>{format(new Date(payment.createdAt), "MMM dd, yyyy")}</td>
                  <td>
                    <span className="badge badge-success">{payment.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-base-content/60">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPayments
