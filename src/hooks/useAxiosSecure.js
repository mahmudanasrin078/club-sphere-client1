"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { axiosSecure } from "../api/axiosSecure"
import { useAuth } from "./useAuth"

export const useAxiosSecure = () => {
  const { logoutUser, getIdToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const token = await getIdToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logoutUser()
          navigate("/login")
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor)
      axiosSecure.interceptors.response.eject(responseInterceptor)
    }
  }, [logoutUser, navigate, getIdToken])

  return axiosSecure
}
