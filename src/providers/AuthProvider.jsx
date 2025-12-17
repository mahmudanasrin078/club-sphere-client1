"use client"

import { createContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "../firebase/firebase.config"
import { axiosPublic } from "../api/axiosSecure"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const googleProvider = new GoogleAuthProvider()

  const createUser = async (email, password, name, photoURL) => {
    setLoading(true)
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name, photoURL })
    return result
  }

  const loginUser = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const googleLogin = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const logoutUser = async () => {
    setLoading(true)
    await axiosPublic.post("/auth/logout")
    return signOut(auth)
  }

  const getIdToken = async () => {
    if (user) {
      return user.getIdToken()
    }
    return null
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken()
          const response = await axiosPublic.post(
            "/auth/jwt",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          setDbUser(response.data.user)
        } catch (error) {
          console.error("Error getting JWT:", error)
          setDbUser(null)
        }
      } else {
        setDbUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const authInfo = {
    user,
    dbUser,
    loading,
    createUser,
    loginUser,
    googleLogin,
    logoutUser,
    getIdToken,
    setDbUser,
  }

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}
