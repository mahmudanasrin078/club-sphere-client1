import { Navigate } from "react-router-dom"
import { useRole } from "../hooks/useRole"
import LoadingSpinner from "../components/common/LoadingSpinner"

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useRole()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard/member" replace />
  }

  return children
}

export default AdminRoute
