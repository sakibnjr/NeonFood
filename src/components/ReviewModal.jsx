import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, Star, MessageCircle, CheckCircle } from 'lucide-react'
import { addReview, selectReviewsLoading, selectReviewsError } from '../store/slices/reviewsSlice'

const ReviewModal = ({ isOpen, onClose, orderData }) => {
  const dispatch = useDispatch()
  const loading = useSelector(selectReviewsLoading)
  const error = useSelector(selectReviewsError)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    customerName: orderData?.customerName || '',
    rating: 0,
    comment: '',
    aspects: {
      food: 0,
      service: 0,
      speed: 0,
      value: 0
    }
  })

  if (!isOpen) return null

  const handleStarClick = (rating, type = 'overall') => {
    if (type === 'overall') {
      setFormData({ ...formData, rating })
    } else {
      setFormData({
        ...formData,
        aspects: {
          ...formData.aspects,
          [type]: rating
        }
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.rating === 0) {
      alert('Please select a rating!')
      return
    }

    const reviewData = {
      ...formData,
      orderId: orderData?.orderId || null,
      tableNumber: orderData?.tableNumber || null
    }

    try {
      await dispatch(addReview(reviewData)).unwrap()
      setSubmitted(true)

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFormData({
          customerName: '',
          rating: 0,
          comment: '',
          aspects: { food: 0, service: 0, speed: 0, value: 0 }
        })
      }, 3000)
    } catch (error) {
      alert('Failed to submit review. Please try again.')
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const StarRating = ({ rating, onStarClick, size = 24, label, type = 'overall' }) => (
    <div className="flex items-center space-x-1">
      {label && <span className="text-sm font-medium text-gray-700 w-16">{label}:</span>}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onStarClick(star, type)}
            className="focus:outline-none transition-colors"
          >
            <Star
              size={size}
              className={`${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } hover:text-yellow-400`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-2">
        {rating > 0 ? `${rating}/5` : 'Rate'}
      </span>
    </div>
  )

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="animate-bounce mb-6">
            <CheckCircle size={64} className="text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You! 🙏</h2>
          <p className="text-gray-600 mb-4">
            Your review has been submitted successfully. We appreciate your feedback!
          </p>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Your review helps us improve our service and helps other customers make better choices.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Leave a Review</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Info */}
          {orderData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
              <div className="text-sm text-gray-600">
                <p>Order: {orderData.orderId}</p>
                <p>Table: {orderData.tableNumber}</p>
                <p>Total: ${orderData.total?.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Rating *
            </label>
            <StarRating
              rating={formData.rating}
              onStarClick={handleStarClick}
              size={32}
            />
          </div>

          {/* Aspect Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate Different Aspects
            </label>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <StarRating
                rating={formData.aspects.food}
                onStarClick={handleStarClick}
                size={20}
                label="Food"
                type="food"
              />
              <StarRating
                rating={formData.aspects.service}
                onStarClick={handleStarClick}
                size={20}
                label="Service"
                type="service"
              />
              <StarRating
                rating={formData.aspects.speed}
                onStarClick={handleStarClick}
                size={20}
                label="Speed"
                type="speed"
              />
              <StarRating
                rating={formData.aspects.value}
                onStarClick={handleStarClick}
                size={20}
                label="Value"
                type="value"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tell us about your experience..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                loading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">Error: {error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ReviewModal 