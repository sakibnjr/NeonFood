import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Star, MessageCircle, Calendar, User, Trash2, Filter } from 'lucide-react'
import { 
  selectReviews, 
  selectReviewStats, 
  selectReviewsByRating,
  selectReviewsLoading,
  selectReviewsError,
  fetchReviews,
  fetchReviewStats,
  deleteReview 
} from '../../store/slices/reviewsSlice'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const Reviews = () => {
  const dispatch = useDispatch()
  const reviews = useSelector(selectReviews)
  const stats = useSelector(selectReviewStats)
  const loading = useSelector(selectReviewsLoading)
  const error = useSelector(selectReviewsError)
  const [filterRating, setFilterRating] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    dispatch(fetchReviews())
    dispatch(fetchReviewStats())
  }, [dispatch])

  const filteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date)
        case 'oldest':
          return new Date(a.date) - new Date(b.date)
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })

  const getRatingDistribution = () => {
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length,
      percentage: reviews.length > 0 
        ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 
        : 0
    }))
    return distribution
  }

  const handleDeleteReview = (reviewId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this review?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dispatch(deleteReview(reviewId))
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-600">Manage and respond to customer feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalReviews || 0}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats?.averageRating?.toFixed(1) || '0.0'}</p>
                <StarRating rating={Math.round(stats?.averageRating || 0)} />
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Food Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.aspectRatings?.food?.toFixed(1) || '0.0'}</p>
            </div>
            <div className="h-8 w-8 text-orange-600 text-2xl">🍔</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Service Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.aspectRatings?.service?.toFixed(1) || '0.0'}</p>
            </div>
            <div className="h-8 w-8 text-green-600 text-2xl">👨‍💼</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-2">
          {getRatingDistribution().map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-20">
                <span className="text-sm font-medium">{rating}</span>
                <Star size={16} className="text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found for the selected filter.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {review.customerName || 'Anonymous Customer'}
                        </span>
                      </div>
                      {review.orderId && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Order: {review.orderId}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Rating and Date */}
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={review.rating} size={20} />
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                  )}

                  {/* Aspect Ratings */}
                  {review.aspects && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      {Object.entries(review.aspects).map(([aspect, rating]) => (
                        rating > 0 && (
                          <div key={aspect} className="text-center">
                            <p className="text-xs font-medium text-gray-600 capitalize mb-1">
                              {aspect}
                            </p>
                            <div className="flex justify-center">
                              <StarRating rating={rating} size={14} />
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Reviews 