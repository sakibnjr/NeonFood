import { Phone, MapPin, Clock, Mail, Settings, Instagram, Facebook, Twitter, Star, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectSettings } from '../store/slices/settingsSlice'
import { useAppActions } from '../store/hooks'

const Footer = () => {
  const settings = useSelector(selectSettings)
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
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 to-orange-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🍽️
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-serif">{settings.restaurantName}</h3>
                <p className="text-amber-300 text-sm font-medium">Culinary Excellence</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {settings.description || 'Experience the perfect harmony of traditional flavors and modern culinary innovation. Every dish is a testament to our commitment to exceptional quality and unforgettable taste.'}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4 mb-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors duration-300 group"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors duration-300 group"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-gray-300 group-hover:text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-blue-400 transition-colors duration-300 group"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-gray-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-300 hover:text-amber-300 transition-colors">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <MapPin size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Visit Us</p>
                  <p className="text-sm leading-relaxed">{settings.address}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 text-gray-300 hover:text-amber-300 transition-colors">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <Phone size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Call Us</p>
                  <p className="text-sm font-mono">{settings.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 text-gray-300 hover:text-amber-300 transition-colors">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                  <Mail size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Email Us</p>
                  <p className="text-sm">{settings.email}</p>
                </div>
              </div>

              {settings.website && (
                <div className="flex items-start space-x-3 text-gray-300 hover:text-amber-300 transition-colors">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                    <Clock size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Website</p>
                    <a href={settings.website} className="text-sm hover:text-amber-300 transition-colors">
                      {settings.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <div className="space-y-3">
              <a 
                href="#menu" 
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm group flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span>Our Menu</span>
              </a>
              <a 
                href="#hours" 
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm group flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span>Hours & Location</span>
              </a>
              <a 
                href="#about" 
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm group flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span>About Us</span>
              </a>
              <a 
                href="#contact" 
                className="block text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm group flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span>Contact</span>
              </a>
              <button 
                onClick={handleOpenReview}
                className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm group"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <Star size={14} />
                <span>Leave a Review</span>
              </button>
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm group"
              >
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <Settings size={14} />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-400 fill-current animate-pulse" />
              <span>for food lovers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-amber-500/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-orange-600/5 to-transparent"></div>
    </footer>
  )
}

export default Footer 