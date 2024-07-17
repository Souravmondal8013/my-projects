import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
const PrivateRoute = ({children}) => {
    const token=Cookies.get('token')
    const isAuthenticated=token?true:false
  return isAuthenticated?<Navigate to="/dashboard"/>:children
}

export default PrivateRoute