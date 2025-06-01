import { Phone, MapPin, ShoppingCart, Clock } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectTotalItems } from '../store/slices/cartSlice'
import { selectSettings, selectIsRestaurantOpen } from '../store/slices/settingsSlice'
import { useAppActions } from '../store/hooks'

const Header = () => {
  const cartItemCount = useSelector(selectTotalItems)
  const settings = useSelector(selectSettings)
  const isRestaurantOpen = useSelector(selectIsRestaurantOpen)
  const { openCart } = useAppActions()

  const handleCartClick = () => {
    openCart()
  }

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    } else if (elementId === 'contact') {
      // If contact section not found, scroll to footer
      const footer = document.querySelector('footer')
      if (footer) {
        footer.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  }

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    smoothScrollTo(sectionId)
  }

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

  const getStatusText = () => {
    const todaySchedule = getCurrentDaySchedule()
    if (!todaySchedule || todaySchedule.closed) {
      return 'Closed Today'
    }
    if (isRestaurantOpen) {
      return `Open until ${formatTime(todaySchedule.close)}`
    }
    return `Opens at ${formatTime(todaySchedule.open)}`
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Bar - More Compact */}
        <div className="hidden lg:flex items-center justify-between py-2 text-xs border-b border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors">
              <Phone size={14} className="text-amber-600" />
              <span className="font-medium">{settings.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors">
              <MapPin size={14} className="text-amber-600" />
              <span className="font-medium">{settings.address}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRestaurantOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-semibold ${isRestaurantOpen ? 'text-green-600' : 'text-red-600'}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Main Header - Reduced Padding */}
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Logo & Brand - More Compact */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
              🍽️
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 font-serif">
                {settings.restaurantName}
              </h1>
              <p className="text-xs text-gray-500 font-medium hidden lg:block">Culinary Excellence Since 2024</p>
            </div>
          </div>

          {/* Navigation - Updated Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={(e) => handleNavClick(e, 'menu')}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors duration-200 relative group text-sm"
            >
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'hours')}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors duration-200 relative group text-sm"
            >
              Hours
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors duration-200 relative group text-sm"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-700 hover:text-amber-600 font-semibold transition-colors duration-200 relative group text-sm"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Cart Button - More Compact */}
          <button
            onClick={handleCartClick}
            className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline font-semibold text-sm">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Status Bar - More Compact */}
        <div className="lg:hidden pb-2">
          <div className="flex items-center justify-center space-x-2 text-xs">
            <div className={`w-1.5 h-1.5 rounded-full ${isRestaurantOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-semibold ${isRestaurantOpen ? 'text-green-600' : 'text-red-600'}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 