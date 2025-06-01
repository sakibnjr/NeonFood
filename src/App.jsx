import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Cart from './components/Cart'
import Payment from './components/Payment'
import ReviewModal from './components/ReviewModal'

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
import { useAppActions } from './store/hooks'

// Customer App Component
const CustomerApp = () => {
  const isCartOpen = useSelector(selectIsCartOpen)
  const isPaymentOpen = useSelector(selectIsPaymentOpen)
  const isReviewOpen = useSelector(selectIsReviewOpen)
  const reviewData = useSelector(selectReviewData)
  const { closeReview } = useAppActions()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Menu />
        
        {/* About Section */}
        <section id="about" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About NeonFood
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Founded in 2024, NeonFood brings you the finest culinary experience with fresh ingredients, 
                authentic recipes, and innovative technology. Our mission is to deliver exceptional food 
                that brings people together, one meal at a time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
                  <p className="text-gray-600">We source only the freshest ingredients from local suppliers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">Hot, fresh food delivered to your table in record time</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Made with Love</h3>
                  <p className="text-gray-600">Every dish is prepared with passion and attention to detail</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">123 Food Street<br />City, State 12345</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">+1 (555) 123-4567<br />Open 11 AM - 10 PM</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-4">✉️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">contact@neonfood.com<br />We reply within 24 hours</p>
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
