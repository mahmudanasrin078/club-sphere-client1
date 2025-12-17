import { Link } from "react-router-dom"
import { FiHome } from "react-icons/fi"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-base-content/60 mt-2 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-8 gap-2">
          <FiHome /> Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
