 # Redux Store Documentation

## 🏗️ Store Structure

The Redux store is organized using Redux Toolkit with the following structure:

```
src/store/
├── index.js              # Store configuration
├── hooks.js              # Custom hooks for actions
├── middleware/
│   └── logger.js         # Custom middleware
└── slices/
    ├── cartSlice.js      # Cart state management
    └── uiSlice.js        # UI state management
```

## 📦 Slices

### Cart Slice (`cartSlice.js`)
Manages the shopping cart state and related functionality.

**State:**
```javascript
{
  items: [],        // Array of cart items with quantities
  isPriority: false // Priority order status
}
```

**Actions:**
- `addToCart(item)` - Add item to cart or increase quantity
- `removeFromCart(itemId)` - Remove item completely from cart
- `updateQuantity({ itemId, newQuantity })` - Update item quantity
- `togglePriority(isPriority)` - Toggle priority order status
- `clearCart()` - Clear all items and reset priority

**Selectors:**
- `selectCartItems` - Get cart items array
- `selectIsPriority` - Get priority status
- `selectTotalItems` - Get total item count
- `selectItemsTotal` - Get subtotal (items only)
- `selectTotalPrice` - Get total price (including priority fee)
- `selectDeliveryTime` - Get estimated preparation time
- `selectOrderSummary` - Get complete order summary object

### UI Slice (`uiSlice.js`)
Manages UI state for modals and navigation.

**State:**
```javascript
{
  isCartOpen: false,     // Cart modal visibility
  isPaymentOpen: false   // Payment modal visibility
}
```

**Actions:**
- `openCart()` - Open cart modal
- `closeCart()` - Close cart modal
- `toggleCart()` - Toggle cart modal
- `openPayment()` - Open payment modal (also closes cart)
- `closePayment()` - Close payment modal
- `closeAllModals()` - Close all modals

**Selectors:**
- `selectIsCartOpen` - Get cart modal visibility
- `selectIsPaymentOpen` - Get payment modal visibility

## 🎣 Custom Hooks

### `useCartActions()`
Returns object with all cart-related action dispatchers:
```javascript
const { addToCart, removeFromCart, updateQuantity, togglePriority, clearCart } = useCartActions()
```

### `useUIActions()`
Returns object with all UI-related action dispatchers:
```javascript
const { openCart, closeCart, openPayment, closePayment } = useUIActions()
```

### `useAppActions()`
Returns combined cart and UI actions for convenience:
```javascript
const { addToCart, openCart, closePayment, /* ... all actions */ } = useAppActions()
```

## 🔧 Middleware

### Logger Middleware
Logs all Redux actions with before/after state in development mode.

### Analytics Middleware
Tracks cart-related actions for analytics purposes in development mode.

## 💡 Usage Examples

### In Components

**Using Selectors:**
```javascript
import { useSelector } from 'react-redux'
import { selectCartItems, selectTotalPrice } from '../store/slices/cartSlice'

const MyComponent = () => {
  const cartItems = useSelector(selectCartItems)
  const totalPrice = useSelector(selectTotalPrice)
  
  return (
    <div>
      <p>Items: {cartItems.length}</p>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  )
}
```

**Using Actions:**
```javascript
import { useAppActions } from '../store/hooks'

const MyComponent = () => {
  const { addToCart, openCart } = useAppActions()
  
  const handleAddItem = (item) => {
    addToCart(item)
    openCart() // Open cart after adding item
  }
  
  return <button onClick={() => handleAddItem(item)}>Add to Cart</button>
}
```

## 🎯 Benefits of This Implementation

1. **Centralized State**: All app state is managed in one place
2. **Predictable Updates**: Actions clearly describe state changes
3. **Developer Tools**: Redux DevTools integration for debugging
4. **Type Safety**: Well-defined action types and selectors
5. **Performance**: Optimized re-renders with proper selectors
6. **Maintainability**: Clean separation of concerns
7. **Testability**: Pure functions are easy to test
8. **Analytics**: Built-in action tracking for insights

## 🔄 State Flow

1. **User Interaction** → Component calls action
2. **Action Dispatch** → Redux Toolkit slice reducer processes
3. **State Update** → Immutable state update via Immer
4. **Re-render** → Components using selectors re-render with new data
5. **Middleware** → Analytics and logging capture action data