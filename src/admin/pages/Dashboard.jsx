import { useSelector, useDispatch } from 'react-redux'
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  TrendingUp,
  Users,
  CheckCircle,
  Package,
  Star,
  MessageCircle,
  Eye,
  CreditCard,
  Wallet,
  BarChart3,
  Activity,
  AlertCircle
} from 'lucide-react'
import { selectStats, selectOrders, selectActiveOrders, selectRecentOrders, fetchOrders } from '../../store/slices/adminSlice'
import { selectReviewStats, selectRecentReviews, fetchReviews, fetchReviewStats } from '../../store/slices/reviewsSlice'
import { useState, useEffect, useMemo } from 'react'

const Dashboard = () => {
  const stats = useSelector(selectStats) || {}
  const orders = useSelector(selectOrders) || []
  const activeOrders = useSelector(selectActiveOrders) || []
  const recentOrders = useSelector(selectRecentOrders) || []
  const reviewStats = useSelector(selectReviewStats) || {}
  const recentReviews = useSelector(selectRecentReviews(3)) || []
  const dispatch = useDispatch()

  // Loading state
  const [loading, setLoading] = useState(true)

  // Calculate today's orders and revenue
  const today = new Date().toDateString()
  const todayOrders = orders.filter(order => 
    order.orderTime && new Date(order.orderTime).toDateString() === today
  )
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0)

  // Calculate order counts using useMemo to ensure they update when orders change
  const readyOrdersCount = useMemo(() => 
    (orders || []).filter(order => order.status === 'ready').length, 
    [orders]
  )
  
  const preparingOrdersCount = useMemo(() => 
    (orders || []).filter(order => order.status === 'preparing').length, 
    [orders]
  )

  const pendingOrdersCount = useMemo(() => 
    (orders || []).filter(order => order.status === 'pending').length, 
    [orders]
  )

  // Calculate payment method stats
  const paidOnlineCount = useMemo(() => 
    (orders || []).filter(order => order.paymentMethod === 'online').length,
    [orders]
  )

  const payAtCounterCount = useMemo(() => 
    (orders || []).filter(order => order.paymentMethod === 'counter' && order.status !== 'completed').length,
    [orders]
  )

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StarRating = ({ rating, size = 16 }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      await Promise.all([
        dispatch(fetchOrders()),
        dispatch(fetchReviews()),
        dispatch(fetchReviewStats())
      ])
      setLoading(false)
    }
    fetchAll()
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-xl text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your restaurant today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Revenue */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Today's Revenue</p>
                <p className="text-3xl font-bold">${todayRevenue.toFixed(2)}</p>
                <p className="text-green-100 text-sm mt-1">From {(todayOrders || []).length} orders</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <DollarSign size={32} />
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Orders</p>
                <p className="text-3xl font-bold">{activeOrders.length}</p>
                <p className="text-blue-100 text-sm mt-1">Currently processing</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <ShoppingBag size={32} />
              </div>
            </div>
          </div>

          {/* Average Prep Time */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Avg Prep Time</p>
                <p className="text-3xl font-bold">{(stats.averageOrderTime || 0)}m</p>
                <p className="text-orange-100 text-sm mt-1">Kitchen efficiency</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Clock size={32} />
              </div>
            </div>
          </div>

          {/* Customer Rating */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Customer Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold">{(reviewStats.averageRating || 0).toFixed(1)}</p>
                  <StarRating rating={Math.round(reviewStats.averageRating || 0)} size={20} />
                </div>
                <p className="text-purple-100 text-sm mt-1">{reviewStats.totalReviews || 0} reviews</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Star size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertCircle className="text-yellow-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
                  <p className="text-gray-600 text-sm">Awaiting preparation</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-yellow-600">{pendingOrdersCount}</span>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <p className="text-yellow-800 text-sm font-medium">⏰ Start preparing these orders</p>
            </div>
          </div>

          {/* Orders in Kitchen */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Activity className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">In Kitchen</h3>
                  <p className="text-gray-600 text-sm">Currently preparing</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-blue-600">{preparingOrdersCount}</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-medium">👨‍🍳 Being prepared by kitchen</p>
            </div>
          </div>

          {/* Ready for Pickup */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready</h3>
                  <p className="text-gray-600 text-sm">Ready for pickup</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-green-600">{readyOrdersCount}</span>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-800 text-sm font-medium">✅ Call customers for pickup</p>
            </div>
          </div>
        </div>

        {/* Payment Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-green-600" size={20} />
                  <span className="text-gray-700">Paid Online</span>
                </div>
                <span className="text-xl font-bold text-green-600">{paidOnlineCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="text-orange-600" size={20} />
                  <span className="text-gray-700">Pay at Counter</span>
                </div>
                <span className="text-xl font-bold text-orange-600">{payAtCounterCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Business Insights</h3>
              <TrendingUp className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders Today</span>
                <span className="font-semibold">{(todayOrders || []).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold">${(stats.totalRevenue || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">All-time Orders</span>
                <span className="font-semibold">{stats.totalOrders || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(recentOrders || []).slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">Table {order.tableNumber} • ${order.total?.toFixed(2) || ''}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {order.paymentMethod === 'online' ? (
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <CreditCard size={10} />
                            <span>Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-xs text-orange-600">
                            <Wallet size={10} />
                            <span>Pay at Counter</span>
                          </div>
                        )}
                        {order.isPriority && (
                          <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">Priority</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(order.orderTime)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
                <MessageCircle className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {(!recentReviews || recentReviews.length === 0) ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400">Reviews will appear here when customers leave feedback</p>
                  </div>
                ) : (
                  (recentReviews || []).map((review) => (
                    <div key={review._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.customerName || 'Anonymous'}
                          </p>
                          <StarRating rating={review.rating || 0} size={14} />
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {review.comment}
                        </p>
                      )}
                      {review.orderId && (
                        <p className="text-xs text-gray-400 mt-1">Order: {review.orderId}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 