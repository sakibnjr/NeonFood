import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X, CreditCard, Wallet, ArrowLeft, CheckCircle } from 'lucide-react'
import { selectOrderSummary } from '../store/slices/cartSlice'
import { selectIsPaymentOpen } from '../store/slices/uiSlice'
import { selectSettings } from '../store/slices/settingsSlice'
import { addOrder } from '../store/slices/adminSlice'
import { useAppActions } from '../store/hooks'

const Payment = () => {
  const dispatch = useDispatch()
  const orderSummary = useSelector(selectOrderSummary)
  const isOpen = useSelector(selectIsPaymentOpen)
  const settings = useSelector(selectSettings)
  const { clearCart, closePayment, openReview } = useAppActions()
  
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/26',
    cvv: '123',
    holderName: 'John Doe',
    customerName: 'John Doe',
    tableNumber: 5
  })

  if (!isOpen) return null

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateOrderId = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `ORD-${timestamp}-${random}`.toUpperCase()
  }

  const handlePaymentComplete = async (paymentMethod) => {
    setProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create order for admin dashboard
    const newOrder = {
      customerName: formData.customerName,
      tableNumber: parseInt(formData.tableNumber),
      items: orderSummary.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderSummary.total,
      isPriority: orderSummary.isPriority,
      estimatedTime: orderSummary.deliveryTime,
      paymentMethod: paymentMethod
    }
    
    // Add order to admin dashboard
    await dispatch(addOrder(newOrder))
    
    setProcessing(false)
    setCompleted(true)
    
    // Auto close and open review modal after celebration
    setTimeout(() => {
      clearCart()
      closePayment()
      
      // Open review modal with order data
      openReview({
        orderId: newOrder.id || 'ORD-NEW',
        customerName: formData.customerName,
        tableNumber: formData.tableNumber,
        total: orderSummary.total,
        items: orderSummary.items
      })
      
      setCompleted(false)
      setSelectedMethod(null)
    }, 3000)
  }

  const handleClose = () => {
    if (!processing && !completed) {
      closePayment()
      setSelectedMethod(null)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="animate-bounce mb-6">
            <CheckCircle size={64} className="text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-600 mb-4">
            Your order has been placed and the kitchen has been notified.
          </p>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Estimated preparation time:</strong> {orderSummary.deliveryTime} minutes
            </p>
            <p className="text-sm text-green-800 mt-1">
              <strong>Table {formData.tableNumber}</strong> - We'll notify you when it's ready!
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
            {selectedMethod && (
              <button
                onClick={() => setSelectedMethod(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={processing}
          >
            <X size={20} />
          </button>
        </div>

        {!selectedMethod ? (
          // Payment Method Selection
          <div className="p-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>{formatCurrency(orderSummary.itemsTotal)}</span>
                  </div>
                  
                  {orderSummary.isPriority && (
                    <div className="flex justify-between text-orange-600">
                      <span>Priority Service</span>
                      <span>+{formatCurrency(orderSummary.priorityFee)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>+{formatCurrency(orderSummary.serviceFee)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-1 mt-1">
                    <span>Subtotal</span>
                    <span>{formatCurrency(orderSummary.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>+{formatCurrency(orderSummary.tax)}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-300 mt-3 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>
                {orderSummary.isPriority && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚡ Priority order - Estimated time: {orderSummary.deliveryTime} minutes
                  </p>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number
                </label>
                <input
                  type="number"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  min="1"
                  max={settings.maxTables}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
              
              <button
                onClick={() => setSelectedMethod('online')}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <CreditCard className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Pay Now (Online)</h3>
                    <p className="text-sm text-gray-600">Credit/Debit Card - Secure payment processed immediately</p>
                    <p className="text-xs text-green-600 mt-1">✓ Order confirmed instantly</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handlePaymentComplete('counter')}
                disabled={processing}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Wallet className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Pay at Counter</h3>
                    <p className="text-sm text-gray-600">Pay cash or card when picking up your order</p>
                    <p className="text-xs text-orange-600 mt-1">⚠ Remember to pay before leaving</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          // Online Payment Form
          <div className="p-6">
            <form onSubmit={(e) => {
              e.preventDefault()
              handlePaymentComplete('online')
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="holderName"
                    value={formData.holderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    processing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                >
                  {processing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Pay ${formatCurrency(orderSummary.total)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment 