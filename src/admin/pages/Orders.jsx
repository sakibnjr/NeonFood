import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { 
  Clock, 
  User, 
  MapPin, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChefHat,
  Filter
} from 'lucide-react'
import { 
  selectOrders, 
  updateOrder,
  fetchOrders
} from '../../store/slices/adminSlice'

const Orders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrder({ id: orderId, data: { status: newStatus } }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />
      case 'preparing':
        return <ChefHat size={16} />
      case 'ready':
        return <CheckCircle size={16} />
      case 'completed':
        return <CheckCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing'
      case 'preparing':
        return 'ready'
      case 'ready':
        return 'completed'
      default:
        return currentStatus
    }
  }

  const formatTime = (timeString) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (timeString) => {
    const date = new Date(timeString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeSinceOrder = (orderTime) => {
    const now = new Date()
    const orderDate = new Date(orderTime)
    const diffInMinutes = Math.floor((now - orderDate) / 60000)
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours}h ago`
    }
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Monitor and update order statuses in real-time</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-1">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Orders', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'preparing', label: 'Preparing', count: statusCounts.preparing },
            { key: 'ready', label: 'Ready', count: statusCounts.ready },
            { key: 'completed', label: 'Completed', count: statusCounts.completed }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusFilter === tab.key
                  ? 'bg-primary-200 text-primary-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Order Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{order._id}</h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>Table {order.tableNumber}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-4">
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-1">
                  <DollarSign size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                
                {order.isPriority && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    <AlertTriangle size={12} />
                    <span>Priority</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                <div className="flex items-center justify-between">
                  <span>Ordered: {formatTime(order.orderTime)}</span>
                  <span>{getTimeSinceOrder(order.orderTime)}</span>
                </div>
                <div className="mt-1">
                  Estimated: {order.estimatedTime} minutes
                </div>
              </div>

              {/* Action Button */}
              {order.status !== 'completed' && (
                <button
                  onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                  className="w-full py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium"
                >
                  {order.status === 'pending' && 'Start Preparing'}
                  {order.status === 'preparing' && 'Mark as Ready'}
                  {order.status === 'ready' && 'Mark as Completed'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? 'No orders have been placed yet.'
              : `No orders with "${statusFilter}" status.`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Orders 