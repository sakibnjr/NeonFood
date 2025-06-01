import { useState, useEffect } from 'react'
import { Plus, Star, Clock, Flame, Leaf } from 'lucide-react'
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
  const [activeCategory, setActiveCategory] = useState('all')
  const [menuData, setMenuData] = useState({})
  const [loading, setLoading] = useState(true)
  const { addToCart } = useAppActions()

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️', color: 'from-slate-500 to-slate-600' },
    { id: 'pizza', name: 'Pizza', icon: '🍕', color: 'from-red-500 to-orange-600' },
    { id: 'burgers', name: 'Burgers', icon: '🍔', color: 'from-yellow-500 to-orange-500' },
    { id: 'sides', name: 'Sides', icon: '🍟', color: 'from-amber-500 to-yellow-600' },
    { id: 'drinks', name: 'Drinks', icon: '🥤', color: 'from-blue-500 to-cyan-600' }
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

  const getItemBadges = (item) => {
    const badges = []
    if (item.popular) {
      badges.push({ text: 'Popular', color: 'bg-red-500', icon: Flame })
    }
    if (item.vegetarian) {
      badges.push({ text: 'Vegetarian', color: 'bg-green-500', icon: Leaf })
    }
    return badges
  }

  return (
    <section id="menu" className="py-24 bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            Culinary Delights
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Our Signature Menu
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover an exquisite collection of handcrafted dishes, each prepared with premium ingredients 
            and served with our commitment to culinary excellence.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                  : 'bg-white text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3 relative z-10">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-bold">{category.name}</span>
              </div>
              {activeCategory !== category.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              )}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-xl text-gray-500 font-medium">Preparing our menu...</p>
          </div>
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
                {items.map((item) => {
                  const badges = getItemBadges(item)
                  return (
                    <div key={item._id || item.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200 transform hover:-translate-y-2">
                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {badges.map((badge, index) => {
                          const IconComponent = badge.icon
                          return (
                            <div key={index} className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg`}>
                              <IconComponent size={12} />
                              <span>{badge.text}</span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Image Section */}
                      <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
                        <div className="text-7xl transform group-hover:scale-110 transition-transform duration-500">
                          {isImageUrl(item.image) ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            item.image
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-6 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star size={16} className="text-amber-400 fill-current" />
                            <span className="font-semibold text-gray-700">
                              {item.rating || '4.5'}
                            </span>
                            <span className="text-gray-500">({Math.floor(Math.random() * 100) + 20})</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-600">
                            <Clock size={16} />
                            <span className="font-medium">
                              {item.deliveryTime ? `${item.deliveryTime}m` : '15m'}
                            </span>
                          </div>
                        </div>

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between">
                          <div className="text-3xl font-bold text-gray-900">
                            <span className="text-lg text-gray-500 font-normal">$</span>
                            {item.price}
                          </div>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span className="font-semibold">Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No dishes found</h3>
                <p className="text-xl text-gray-500">Try selecting a different category to explore our menu.</p>
              </div>
            );
          })()
        )}
      </div>
    </section>
  )
}

export default Menu 