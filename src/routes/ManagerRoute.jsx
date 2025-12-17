import { Navigate } from "react-router-dom"
import { useRole } from "../hooks/useRole"
import LoadingSpinner from "../components/common/LoadingSpinner"

const ManagerRoute = ({ children }) => {
  const { isManager, isAdmin, loading } = useRole()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isManager && !isAdmin) {
    return <Navigate to="/dashboard/member" replace />
  }

  return children
}

export default ManagerRoute
