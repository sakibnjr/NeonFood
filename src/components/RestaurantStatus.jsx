import { useSelector } from 'react-redux'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { selectSettings, selectIsRestaurantOpen } from '../store/slices/settingsSlice'

const RestaurantStatus = () => {
  const settings = useSelector(selectSettings)
  const isOpen = useSelector(selectIsRestaurantOpen)
  
  const getCurrentDaySchedule = () => {
    const now = new Date()
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    return settings.operatingHours[currentDay]
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const todaySchedule = getCurrentDaySchedule()

  if (!todaySchedule) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <Clock size={20} className="text-gray-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {isOpen ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <XCircle size={16} className="text-red-500" />
            )}
            <span className={`font-medium ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          
          {todaySchedule.closed ? (
            <p className="text-sm text-gray-500">Closed today</p>
          ) : (
            <p className="text-sm text-gray-500">
              Today: {formatTime(todaySchedule.open)} - {formatTime(todaySchedule.close)}
            </p>
          )}
        </div>
      </div>
      
      {/* Restaurant Info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900">{settings.restaurantName}</h3>
        <p className="text-sm text-gray-600">{settings.address}</p>
        <p className="text-sm text-gray-600">{settings.phone}</p>
      </div>
    </div>
  )
}

export default RestaurantStatus 