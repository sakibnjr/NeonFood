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
  Eye
} from 'lucide-react'
import { selectStats, selectOrders, selectActiveOrders, selectRecentOrders, fetchOrders } from '../../store/slices/adminSlice'
import { selectReviewStats, selectRecentReviews } from '../../store/slices/reviewsSlice'
import { useState, useEffect, useMemo } from 'react'

const Dashboard = () => {
  const stats = useSelector(selectStats)
  const orders = useSelector(selectOrders)
  const activeOrders = useSelector(selectActiveOrders)
  const recentOrders = useSelector(selectRecentOrders)
  const reviewStats = useSelector(selectReviewStats)
  const recentReviews = useSelector(selectRecentReviews(3))
  const dispatch = useDispatch()

  // Calculate today's orders and revenue
  const today = new Date().toDateString()
  const todayOrders = orders.filter(order => 
    new Date(order.orderTime).toDateString() === today
  )
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)

  // Calculate order counts using useMemo to ensure they update when orders change
  const readyOrdersCount = useMemo(() => 
    orders.filter(order => order.status === 'ready').length, 
    [orders]
  )
  
  const preparingOrdersCount = useMemo(() => 
    orders.filter(order => order.status === 'preparing').length, 
    [orders]
  )

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12%'
    },
    {
      title: 'Active Orders',
      value: activeOrders.length,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      trend: '+5%'
    },
    {
      title: 'Avg Prep Time',
      value: `${stats.averageOrderTime}m`,
      icon: Clock,
      color: 'bg-yellow-500',
      trend: '-3%'
    },
    {
      title: 'Today\'s Orders',
      value: todayOrders.length,
      icon: Users,
      color: 'bg-purple-500',
      trend: '+8%'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
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

  // Add Food State
  const [addFoodForm, setAddFoodForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'pizza',
    deliveryTime: '',
    rating: '',
    popular: false
  })
  const [addFoodLoading, setAddFoodLoading] = useState(false)
  const [addFoodSuccess, setAddFoodSuccess] = useState(false)
  const [addFoodError, setAddFoodError] = useState('')

  const handleAddFoodChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddFoodForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddFoodSubmit = async (e) => {
    e.preventDefault()
    setAddFoodLoading(true)
    setAddFoodError('')
    setAddFoodSuccess(false)
    try {
      const res = await fetch('http://localhost:5000/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addFoodForm.name,
          price: parseFloat(addFoodForm.price),
          description: addFoodForm.description,
          image: addFoodForm.image,
          category: addFoodForm.category,
          deliveryTime: addFoodForm.deliveryTime ? parseInt(addFoodForm.deliveryTime) : undefined,
          rating: addFoodForm.rating ? parseFloat(addFoodForm.rating) : undefined,
          popular: addFoodForm.popular
        })
      })
      if (!res.ok) throw new Error('Failed to add food')
      setAddFoodSuccess(true)
      setAddFoodForm({
        name: '', price: '', description: '', image: '', category: 'pizza', deliveryTime: '', rating: '', popular: false
      })
    } catch (err) {
      setAddFoodError('Could not add food. Please try again.')
    }
    setAddFoodLoading(false)
  }

  // Food List State
  const [foods, setFoods] = useState([])
  const [foodsLoading, setFoodsLoading] = useState(true)
  const [editFoodId, setEditFoodId] = useState(null)
  const [editFoodForm, setEditFoodForm] = useState({})
  const [foodError, setFoodError] = useState('')

  // Fetch all foods
  const fetchFoods = async () => {
    setFoodsLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/foods')
      const data = await res.json()
      setFoods(data)
    } catch (err) {
      setFoodError('Could not fetch foods.')
    }
    setFoodsLoading(false)
  }

  useEffect(() => {
    fetchFoods()
    dispatch(fetchOrders())
  }, [dispatch])

  // Delete food
  const handleDeleteFood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/foods/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setFoods(foods.filter(f => f._id !== id))
    } catch (err) {
      setFoodError('Could not delete food.')
    }
  }

  // Edit food
  const handleEditFood = (food) => {
    setEditFoodId(food._id)
    setEditFoodForm({ ...food })
  }
  const handleEditFoodChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFoodForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  const handleEditFoodSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/foods/${editFoodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFoodForm)
      })
      if (!res.ok) throw new Error('Update failed')
      setFoods(foods.map(f => f._id === editFoodId ? { ...editFoodForm, _id: editFoodId } : f))
      setEditFoodId(null)
      setEditFoodForm({})
    } catch (err) {
      setFoodError('Could not update food.')
    }
  }
  const handleCancelEdit = () => {
    setEditFoodId(null)
    setEditFoodForm({})
  }

  const isImageUrl = (str) => typeof str === 'string' && (str.startsWith('http') || str.startsWith('/'))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your restaurant.</p>
      </div>

      {/* Add Food Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Food Item</h2>
        <form onSubmit={handleAddFoodSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" value={addFoodForm.name} onChange={handleAddFoodChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" name="price" value={addFoodForm.price} onChange={handleAddFoodChange} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={addFoodForm.description} onChange={handleAddFoodChange} required rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (emoji or URL)</label>
            <input type="text" name="image" value={addFoodForm.image} onChange={handleAddFoodChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={addFoodForm.category} onChange={handleAddFoodChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="pizza">Pizza</option>
              <option value="burgers">Burgers</option>
              <option value="sides">Sides</option>
              <option value="drinks">Drinks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (min)</label>
            <input type="number" name="deliveryTime" value={addFoodForm.deliveryTime} onChange={handleAddFoodChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input type="number" name="rating" value={addFoodForm.rating} onChange={handleAddFoodChange} min="0" max="5" step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" name="popular" checked={addFoodForm.popular} onChange={handleAddFoodChange} className="mr-2" />
            <label className="text-sm font-medium text-gray-700">Popular</label>
          </div>
          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <button type="submit" disabled={addFoodLoading} className="btn-primary px-6 py-2 rounded-md">
              {addFoodLoading ? 'Adding...' : 'Add Food'}
            </button>
            {addFoodSuccess && <span className="text-green-600 text-sm">Food added!</span>}
            {addFoodError && <span className="text-red-600 text-sm">{addFoodError}</span>}
          </div>
        </form>
      </div>

      {/* Food List Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Food Items</h2>
        {foodsLoading ? (
          <div className="text-gray-500">Loading foods...</div>
        ) : foodError ? (
          <div className="text-red-600">{foodError}</div>
        ) : foods.length === 0 ? (
          <div className="text-gray-500">No food items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Popular</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food._id} className="border-b">
                    {editFoodId === food._id ? (
                      <>
                        <td className="px-4 py-2"><input type="text" name="image" value={editFoodForm.image} onChange={handleEditFoodChange} className="w-12 text-center" /></td>
                        <td className="px-4 py-2"><input type="text" name="name" value={editFoodForm.name} onChange={handleEditFoodChange} className="w-full" /></td>
                        <td className="px-4 py-2">
                          <select name="category" value={editFoodForm.category} onChange={handleEditFoodChange} className="w-full">
                            <option value="pizza">Pizza</option>
                            <option value="burgers">Burgers</option>
                            <option value="sides">Sides</option>
                            <option value="drinks">Drinks</option>
                          </select>
                        </td>
                        <td className="px-4 py-2"><input type="number" name="price" value={editFoodForm.price} onChange={handleEditFoodChange} className="w-20" /></td>
                        <td className="px-4 py-2"><input type="checkbox" name="popular" checked={editFoodForm.popular} onChange={handleEditFoodChange} /></td>
                        <td className="px-4 py-2 space-x-2">
                          <button onClick={handleEditFoodSubmit} className="btn-primary px-3 py-1 rounded">Save</button>
                          <button onClick={handleCancelEdit} className="btn-secondary px-3 py-1 rounded">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 text-2xl">
                          {isImageUrl(food.image)
                            ? <img src={food.image} alt={food.name} className="h-8 w-8 object-contain rounded mx-auto" />
                            : food.image
                          }
                        </td>
                        <td className="px-4 py-2">{food.name}</td>
                        <td className="px-4 py-2">{food.category}</td>
                        <td className="px-4 py-2">${food.price}</td>
                        <td className="px-4 py-2">{food.popular ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button onClick={() => handleEditFood(food)} className="btn-secondary px-3 py-1 rounded">Edit</button>
                          <button onClick={() => handleDeleteFood(food._id)} className="btn-danger px-3 py-1 rounded">Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stat.trend}</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{reviewStats.averageRating.toFixed(1)}</p>
                <StarRating rating={Math.round(reviewStats.averageRating)} />
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Orders Ready</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {readyOrdersCount}
          </p>
          <p className="text-sm text-gray-600 mt-2">Orders ready for pickup</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Preparing</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {preparingOrdersCount}
          </p>
          <p className="text-sm text-gray-600 mt-2">Orders in kitchen</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Today's Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${todayRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-2">From {todayOrders.length} orders</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">Table {order.tableNumber} • ${order.total.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
              <MessageCircle className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentReviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-400">Reviews will appear here when customers leave feedback</p>
                </div>
              ) : (
                recentReviews.map((review) => (
                  <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.customerName || 'Anonymous'}
                        </p>
                        <StarRating rating={review.rating} size={14} />
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
  )
}

export default Dashboard 