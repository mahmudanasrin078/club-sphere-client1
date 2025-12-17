import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

export const axiosSecure = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
