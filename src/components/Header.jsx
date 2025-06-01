import { Phone, MapPin, ShoppingCart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectTotalItems } from '../store/slices/cartSlice'
import { useAppActions } from '../store/hooks'

const Header = () => {
  const cartItemCount = useSelector(selectTotalItems)
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
    }
  }

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    smoothScrollTo(sectionId)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>123 Food Street, City</span>
            </div>
          </div>
          <div className="text-primary-600 font-medium">
            ⏰ Open until 10:00 PM
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🍜</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NeonFood</h1>
              <p className="text-sm text-gray-500">Delicious food, delivered fast</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={(e) => handleNavClick(e, 'menu')}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:text-primary-600"
            >
              Menu
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:text-primary-600"
            >
              About
            </button>
            <button 
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:text-primary-600"
            >
              Contact
            </button>
          </nav>

          <button
            onClick={handleCartClick}
            className="relative bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header 