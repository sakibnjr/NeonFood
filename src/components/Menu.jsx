import { useState, useEffect } from 'react'
import { Plus, Star, Clock } from 'lucide-react'
import { useAppActions } from '../store/hooks'

const groupByCategory = (foods) => {
  return foods.reduce((acc, food) => {
    if (!acc[food.category]) acc[food.category] = []
    acc[food.category].push(food)
    return acc
  }, {})
}

const isImageUrl = (str) => typeof str === 'string' && (str.startsWith('http') || str.startsWith('/'))

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('pizza')
  const [menuData, setMenuData] = useState({})
  const [loading, setLoading] = useState(true)
  const { addToCart } = useAppActions()

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'sides', name: 'Sides', icon: '🍟' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ]

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5000/api/foods')
        const data = await res.json()
        setMenuData(groupByCategory(data))
      } catch (err) {
        setMenuData({})
      }
      setLoading(false)
    }
    fetchMenu()
  }, [])

  const handleAddToCart = (item) => {
    addToCart(item)
  }

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Delicious Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our mouth-watering selection of freshly prepared dishes, 
            made with the finest ingredients.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-12 text-xl text-gray-500">Loading menu...</div>
        ) : (
          (() => {
            let items = [];
            if (activeCategory === 'all') {
              items = Object.values(menuData).flat();
            } else {
              items = menuData[activeCategory] || [];
            }
            return items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <div key={item._id || item.id} className="card hover:shadow-lg transition-shadow duration-300 relative">
                    {item.popular && (
                      <div className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-2 -right-2 z-10">
                        Popular
                      </div>
                    )}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3">
                        {isImageUrl(item.image) ? (
                          <img src={item.image} alt={item.name} className="mx-auto size-full object-contain rounded" />
                        ) : (
                          item.image
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{item.rating || '-'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} className="text-green-500" />
                          <span className="text-sm text-gray-600">{item.deliveryTime ? `${item.deliveryTime} min` : '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Plus size={20} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xl text-gray-500">No items found in this category.</div>
            );
          })()
        )}
      </div>
    </section>
  )
}

export default Menu 