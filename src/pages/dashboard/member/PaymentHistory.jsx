
import { useQuery } from "@tanstack/react-query"
import { useAxiosSecure } from "../../../hooks/useAxiosSecure"
import LoadingSpinner from "../../../components/common/LoadingSpinner"
import { format } from "date-fns"

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure()

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["memberPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/member/payments")
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="text-2xl text-[#38909D] font-bold mb-6">Payment <span className="text-[#F6851F] ">History</span></h1>

      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Club / Event</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="font-semibold">${payment.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${payment.type === "membership" ? "bg-[#38909D] text-white" : "badge-secondary"}`}>
                      {payment.type}
                    </span>
                  </td>
                  <td>{payment.club?.clubName || payment.event?.title || "N/A"}</td>
                  <td>{format(new Date(payment.createdAt), "MMM dd, yyyy")}</td>
                  <td>
                    <span className="badge badge-success text-white">{payment.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-base-content/60">
                  No payment history
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaymentHistory
