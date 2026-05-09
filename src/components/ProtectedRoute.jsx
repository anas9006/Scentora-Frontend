import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, adminOnly = false, redirectTo = '/login' }) => {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
