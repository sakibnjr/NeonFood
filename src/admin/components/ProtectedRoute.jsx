import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectIsAuthenticated } from '../../store/slices/adminSlice'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}

export default ProtectedRoute 