import { useSelector } from 'react-redux'
import { X, Plus, Minus, ShoppingBag, CreditCard, Clock, Zap } from 'lucide-react'
import { 
  selectCartItems, 
  selectIsPriority, 
  selectItemsTotal, 
  selectTotalPrice, 
  selectDeliveryTime 
} from '../store/slices/cartSlice'
import { selectIsCartOpen } from '../store/slices/uiSlice'
import { useAppActions } from '../store/hooks'

const Cart = () => {
  // Redux selectors
  const isOpen = useSelector(selectIsCartOpen)
  const items = useSelector(selectCartItems)
  const isPriority = useSelector(selectIsPriority)
  const itemsTotal = useSelector(selectItemsTotal)
  const totalPrice = useSelector(selectTotalPrice)
  const deliveryTime = useSelector(selectDeliveryTime)
  
  // Redux actions
  const { 
    removeFromCart, 
    updateQuantity, 
    togglePriority, 
    clearCart, 
    closeCart, 
    openPayment 
  } = useAppActions()
  
  if (!isOpen) return null

  const getPriorityFee = () => {
    return isPriority ? 4.99 : 0
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    openPayment()
  }

  const handleClose = () => {
    closeCart()
  }

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId)
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity({ id: itemId, quantity: newQuantity })
    }
  }

  const handleTogglePriority = (checked) => {
    togglePriority(checked)
  }

  const standardTime = items.length > 0 ? Math.max(...items.map(item => item.deliveryTime)) : 0

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={24} className="text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Your Order</h2>
              {isPriority && (
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                  <Zap size={12} />
                  <span>PRIORITY</span>
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some delicious items from our menu!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <div className="text-3xl">{item.image}</div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock size={12} className="text-green-500" />
                        <span className="text-xs text-gray-500">{item.deliveryTime} min</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Priority Order Toggle */}
                <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Zap size={20} className={isPriority ? "text-yellow-500" : "text-gray-400"} />
                      <div>
                        <h4 className="font-medium text-gray-900">Priority Order</h4>
                        <p className="text-xs text-gray-500">Get your order prepared 50% faster</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isPriority}
                        onChange={(e) => handleTogglePriority(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                  
                  {isPriority && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-800">Preparation time reduced:</span>
                        <span className="font-semibold text-yellow-900">
                          {standardTime} min → {deliveryTime} min
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-yellow-800">Priority fee:</span>
                        <span className="font-semibold text-yellow-900">+$4.99</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Delivery Time */}
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                isPriority ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-2">
                  {isPriority ? (
                    <Zap size={20} className="text-yellow-600" />
                  ) : (
                    <Clock size={20} className="text-green-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    isPriority ? 'text-yellow-800' : 'text-green-800'
                  }`}>
                    {isPriority ? 'Priority Order' : 'Estimated Preparation'}
                  </span>
                </div>
                <span className={`text-lg font-bold ${
                  isPriority ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  {deliveryTime} min
                </span>
              </div>
              
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal:</span>
                  <span>${itemsTotal.toFixed(2)}</span>
                </div>
                {isPriority && (
                  <div className="flex justify-between items-center text-sm">
                    <span>Priority fee:</span>
                    <span>+${getPriorityFee().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className={`w-full flex items-center justify-center space-x-2 py-3 text-lg font-medium rounded-lg transition-colors ${
                  isPriority 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'btn-primary'
                }`}
              >
                {isPriority ? <Zap size={20} /> : <CreditCard size={20} />}
                <span>{isPriority ? 'Rush My Order' : 'Proceed to Checkout'}</span>
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Dine-in orders • Preparation time may vary during peak hours
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart 