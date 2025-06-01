import { useDispatch, useSelector } from 'react-redux'
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  BarChart3, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell,
  User,
  Star,
  Package
} from 'lucide-react'
import { useState } from 'react'
import { logout, selectAdminUser, selectActiveOrders } from '../../store/slices/adminSlice'
import { selectReviewStats } from '../../store/slices/reviewsSlice'

const AdminLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectAdminUser)
  const activeOrders = useSelector(selectActiveOrders)
  const reviewStats = useSelector(selectReviewStats)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = '/'
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      current: location.pathname === '/admin'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: Package,
      current: location.pathname === '/admin/orders',
      badge: activeOrders.length
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      icon: Star,
      current: location.pathname === '/admin/reviews',
      badge: reviewStats.totalReviews
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🍜</span>
            <span className="text-xl font-bold text-gray-900">NeonFood</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg ${
                item.current
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-900">
                <Bell size={20} />
                {activeOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeOrders.length}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                  <User size={16} className="text-primary-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-900"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 