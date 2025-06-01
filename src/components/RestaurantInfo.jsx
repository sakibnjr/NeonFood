import { useSelector } from 'react-redux'
import { Clock, Star, Zap, DollarSign, Users } from 'lucide-react'
import { selectSettings } from '../store/slices/settingsSlice'
import RestaurantStatus from './RestaurantStatus'

const RestaurantInfo = () => {
  const settings = useSelector(selectSettings)

  // Helper function to format time
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Helper function to get day name
  const getDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  const quickInfoItems = [
    {
      icon: Clock,
      label: 'Average Prep Time',
      value: `${settings.defaultPrepTime} min`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Fresh preparation'
    },
    {
      icon: Zap,
      label: 'Priority Service',
      value: `+$${settings.priorityUpcharge}`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: '50% faster preparation'
    },
    {
      icon: DollarSign,
      label: 'Service Fee',
      value: `$${settings.serviceFee}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Transparent pricing'
    },
    {
      icon: Users,
      label: 'Max Capacity',
      value: `${settings.maxTables} tables`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Comfortable dining'
    }
  ]

  return (
    <section id="restaurant-info" className="py-20 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            Restaurant Information
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-serif">
            Everything You Need to Know
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From our operating hours to our service details, discover what makes {settings.restaurantName} special
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Operating Hours Card */}
          <div id="hours" className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="text-white" size={24} />
                <h3 className="text-2xl font-bold text-white">Operating Hours</h3>
              </div>
              <p className="text-amber-100">When culinary magic happens</p>
            </div>
            
            <div className="p-6">
              {/* Current Status */}
              <div className="mb-6">
                <RestaurantStatus />
              </div>

              {/* Hours List */}
              <div className="space-y-3">
                {Object.entries(settings.operatingHours).map(([day, schedule]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-semibold text-gray-900 capitalize">
                      {getDayName(day)}
                    </span>
                    <span className="text-gray-600 font-medium">
                      {schedule.closed ? (
                        <span className="text-red-500 font-semibold">Closed</span>
                      ) : (
                        <span className="text-green-600">
                          {formatTime(schedule.open)} - {formatTime(schedule.close)}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <Star className="text-white" size={24} />
                <h3 className="text-2xl font-bold text-white">Service Details</h3>
              </div>
              <p className="text-blue-100">What you need to know</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {quickInfoItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                        <IconComponent className={item.color} size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{item.label}</h4>
                          <span className="text-xl font-bold text-gray-900">{item.value}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Tax Information */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Transparent Pricing</h4>
                    <p className="text-sm text-blue-700">Tax rate: {settings.taxRate}% • No hidden fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RestaurantInfo 