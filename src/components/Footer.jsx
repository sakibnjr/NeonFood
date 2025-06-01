import { Phone, MapPin, Clock, Mail, Settings, Instagram, Facebook, Twitter, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppActions } from '../store/hooks'

const Footer = () => {
  const { openReview } = useAppActions()

  const handleOpenReview = () => {
    openReview({
      customerName: '',
      orderId: null,
      tableNumber: null,
      total: null
    })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍜</span>
              <span className="text-xl font-bold">NeonFood</span>
            </div>
            <p className="text-gray-300 mb-4">
              Delicious food delivered fast. Experience the best flavors in town 
              with our carefully crafted menu.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} />
                <span className="text-sm">123 Food Street, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <span className="text-sm">contact@neonfood.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Clock size={20} />
              <span>Opening Hours</span>
            </h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#menu" className="block text-gray-300 hover:text-primary-400 transition-colors">
                Our Menu
              </a>
              <a href="#about" className="block text-gray-300 hover:text-primary-400 transition-colors">
                About Us
              </a>
              <a href="#contact" className="block text-gray-300 hover:text-primary-400 transition-colors">
                Contact
              </a>
              <a href="#reviews" className="block text-gray-300 hover:text-primary-400 transition-colors">
                Reviews
              </a>
              <Link 
                to="/admin" 
                className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
              >
                <Settings size={16} />
                <span>Restaurant Admin</span>
              </Link>
              <button 
                onClick={handleOpenReview}
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors"
              >
                <Star className="h-4 w-4" />
                <span>Leave a Review</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} NeonFood. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 