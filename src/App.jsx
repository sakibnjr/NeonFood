import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Award, Heart, Star } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Payment from './components/Payment'
import ReviewModal from './components/ReviewModal'
import RestaurantInfo from './components/RestaurantInfo'

// Admin Components
import AdminLogin from './admin/components/AdminLogin'
import AdminLayout from './admin/layouts/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import Orders from './admin/pages/Orders'
import MenuManagement from './admin/pages/MenuManagement'
import Reviews from './admin/pages/Reviews'
import Settings from './admin/pages/Settings'
import ProtectedRoute from './admin/components/ProtectedRoute'

// Redux selectors
import { selectIsCartOpen, selectIsPaymentOpen, selectIsReviewOpen, selectReviewData } from './store/slices/uiSlice'
import { selectIsAuthenticated } from './store/slices/adminSlice'
import { loadSettings, selectSettings } from './store/slices/settingsSlice'
import { useAppActions } from './store/hooks'

// Customer App Component
const CustomerApp = () => {
  const dispatch = useDispatch()
  const isCartOpen = useSelector(selectIsCartOpen)
  const isPaymentOpen = useSelector(selectIsPaymentOpen)
  const isReviewOpen = useSelector(selectIsReviewOpen)
  const reviewData = useSelector(selectReviewData)
  const settings = useSelector(selectSettings)
  const { closeReview } = useAppActions()

  // Load settings on app startup
  useEffect(() => {
    dispatch(loadSettings())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Menu />
        <RestaurantInfo />
        
        {/* About Section */}
        <section id="about" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-serif">
                About {settings.restaurantName}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {settings.description || 'Founded with a passion for culinary excellence, we bring you an extraordinary dining experience that combines traditional flavors with modern innovation. Every dish tells a story of dedication, quality, and love for the art of cooking.'}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Award size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 font-serif">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  We source only the finest ingredients from trusted local suppliers, ensuring every bite is exceptional.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 font-serif">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our commitment to culinary excellence shows in every dish we serve and every experience we create.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Heart size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 font-serif">Made with Passion</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every dish is crafted with love and attention to detail, creating memorable moments one meal at a time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Modals */}
      {isCartOpen && <Cart />}
      {isPaymentOpen && <Payment />}
      {isReviewOpen && (
        <ReviewModal 
          isOpen={isReviewOpen}
          onClose={closeReview}
          orderData={reviewData}
        />
      )}
    </div>
  )
}

// Admin Route Guard
const AdminRouteGuard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  if (!isAuthenticated) {
    return <AdminLogin />
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerApp />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminRouteGuard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
