
import React from "react";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../hooks/useAuth"
import { axiosPublic } from "../api/axiosSecure"
import toast from "react-hot-toast"
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiImage } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"

const Register = () => {
  const { createUser, googleLogin, getIdToken } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const password = watch("password", "")

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await createUser(data.email, data.password, data.name, data.photoURL)

      const token = await result.user.getIdToken()
      await axiosPublic.post(
        "/users",
        {
          name: data.name,
          email: data.email,
          photoURL: data.photoURL || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      toast.success("Registration successful!")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await googleLogin()
      toast.success("Registration successful!")
      navigate("/")
    } catch (error) {
      toast.error(error.message || "Google registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Create <span className="text-[#F6851F]">Account</span></h1>
            <p className="text-base-content/60">Join ClubSphere today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered w-full pl-10 ${errors.name ? "input-error" : ""}`}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 4,
                      message: "Name must be at least 4 characters",
                    },
                  })}
                />
              </div>
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name.message}</span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <div className="relative ">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type="file"
                  placeholder="Your photo"
                  className="input input-bordered w-full pl-10 pt-2"
                  {...register("photoURL")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                      message: "Password must contain at least one uppercase and one lowercase letter",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}

              {/* Password Strength Indicators */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={password.length >= 6 ? "text-success" : "text-base-content/50"}>
                      {password.length >= 6 ? "✓" : "○"} At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={/[A-Z]/.test(password) ? "text-success" : "text-base-content/50"}>
                      {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={/[a-z]/.test(password) ? "text-success" : "text-base-content/50"}>
                      {/[a-z]/.test(password) ? "✓" : "○"} One lowercase letter
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn bg-[#38909D] text-white w-full">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Create Account"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button onClick={handleGoogleLogin} disabled={loading} className="btn btn-outline w-full gap-2">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
