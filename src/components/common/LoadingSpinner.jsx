const LoadingSpinner = ({ size = "lg" }) => {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <span className={`loading loading-spinner text-primary ${sizeClasses[size]}`}></span>
    </div>
  )
}

export default LoadingSpinner
