import { useState, useEffect } from 'react'
import { 
  Plus,
  Edit,
  Trash2,
  Package,
  Search,
  Filter
} from 'lucide-react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const MenuManagement = () => {
  // Food Management State
  const [addFoodForm, setAddFoodForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'pizza',
    deliveryTime: '',
    rating: '',
    popular: false
  })
  const [addFoodLoading, setAddFoodLoading] = useState(false)
  const [addFoodSuccess, setAddFoodSuccess] = useState(false)
  const [addFoodError, setAddFoodError] = useState('')
  const [addFoodImageFile, setAddFoodImageFile] = useState(null)
  const [generatingDesc, setGeneratingDesc] = useState(false)

  const [foods, setFoods] = useState([])
  const [foodsLoading, setFoodsLoading] = useState(true)
  const [editFoodId, setEditFoodId] = useState(null)
  const [editFoodForm, setEditFoodForm] = useState({})
  const [foodError, setFoodError] = useState('')
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddFoodChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddFoodForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddFoodSubmit = async (e) => {
    e.preventDefault()
    setAddFoodLoading(true)
    setAddFoodError('')
    setAddFoodSuccess(false)

    try {
      let res
      if (addFoodImageFile) {
        // Use FormData for file upload
        const formData = new FormData()
        formData.append('image', addFoodImageFile)
        formData.append('name', addFoodForm.name)
        formData.append('price', parseFloat(addFoodForm.price))
        formData.append('description', addFoodForm.description)
        formData.append('category', addFoodForm.category)
        if (addFoodForm.deliveryTime) formData.append('deliveryTime', parseInt(addFoodForm.deliveryTime))
        if (addFoodForm.rating) formData.append('rating', parseFloat(addFoodForm.rating))
        formData.append('popular', addFoodForm.popular)

        res = await fetch('http://localhost:5000/api/foods/upload', {
          method: 'POST',
          body: formData,
        })
      } else {
        // Fallback to old method if no file selected
        res = await fetch('http://localhost:5000/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: addFoodForm.name,
            price: parseFloat(addFoodForm.price),
            description: addFoodForm.description,
            image: addFoodForm.image,
            category: addFoodForm.category,
            deliveryTime: addFoodForm.deliveryTime ? parseInt(addFoodForm.deliveryTime) : undefined,
            rating: addFoodForm.rating ? parseFloat(addFoodForm.rating) : undefined,
            popular: addFoodForm.popular
          })
        })
      }

      if (!res.ok) throw new Error('Failed to add food')
      setAddFoodSuccess(true)
      setAddFoodForm({
        name: '', price: '', description: '', image: '', category: 'pizza', deliveryTime: '', rating: '', popular: false
      })
      setAddFoodImageFile(null)
      fetchFoods()
      // Auto hide form after success
      setTimeout(() => {
        setShowAddForm(false)
        setAddFoodSuccess(false)
      }, 2000)
    } catch (err) {
      setAddFoodError('Could not add food. Please try again.')
    }
    setAddFoodLoading(false)
  }

  const fetchFoods = async () => {
    setFoodsLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/foods')
      const data = await res.json()
      setFoods(data)
    } catch (err) {
      setFoodError('Could not fetch foods.')
    }
    setFoodsLoading(false)
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  const handleDeleteFood = async (id) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this food item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await fetch(`http://localhost:5000/api/foods/${id}`, { method: 'DELETE' })
              if (!res.ok) throw new Error('Delete failed')
              setFoods(foods.filter(f => f._id !== id))
            } catch (err) {
              setFoodError('Could not delete food.')
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }

  const handleEditFood = (food) => {
    setEditFoodId(food._id)
    setEditFoodForm({ ...food })
  }

  const handleEditFoodChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFoodForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEditFoodSubmit = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        name: editFoodForm.name,
        price: parseFloat(editFoodForm.price),
        description: editFoodForm.description,
        image: editFoodForm.image,
        category: editFoodForm.category,
        deliveryTime: editFoodForm.deliveryTime ? parseInt(editFoodForm.deliveryTime) : undefined,
        rating: editFoodForm.rating ? parseFloat(editFoodForm.rating) : undefined,
        popular: editFoodForm.popular
      }
      
      const res = await fetch(`http://localhost:5000/api/foods/${editFoodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      if (!res.ok) throw new Error('Update failed')
      const updatedFood = await res.json()
      setFoods(foods.map(f => f._id === editFoodId ? updatedFood : f))
      setEditFoodId(null)
      setEditFoodForm({})
    } catch (err) {
      setFoodError('Could not update food.')
    }
  }

  const handleCancelEdit = () => {
    setEditFoodId(null)
    setEditFoodForm({})
  }

  const isImageUrl = (str) => typeof str === 'string' && (str.startsWith('http') || str.startsWith('/'))

  // Filter foods based on search and category
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || food.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'pizza', 'burgers', 'sides', 'drinks']

  async function generateDescription(foodName) {

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
    const prompt = `Write a single, delicious and enticing menu description for a food item called "${foodName} in 10-15 words".`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    const data = await response.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant's menu items, prices, and availability</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>{showAddForm ? 'Cancel' : 'Add New Item'}</span>
        </button>
      </div>

      {/* Add Food Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add New Menu Item</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddFoodSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={addFoodForm.name} 
                  onChange={handleAddFoodChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input 
                  type="number" 
                  name="price" 
                  value={addFoodForm.price} 
                  onChange={handleAddFoodChange} 
                  required 
                  min="0" 
                  step="0.01" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="flex items-center gap-2">
                  <textarea 
                    name="description" 
                    value={addFoodForm.description} 
                    onChange={handleAddFoodChange} 
                    required 
                    rows={3} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      setGeneratingDesc(true)
                      const desc = await generateDescription(addFoodForm.name)
                      setAddFoodForm((prev) => ({ ...prev, description: desc }))
                      setGeneratingDesc(false)
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300"
                    disabled={!addFoodForm.name || generatingDesc}
                    title="Generate description with Gemini"
                  >
                    {generatingDesc ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image (emoji, URL, or file)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={e => setAddFoodImageFile(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  name="image"
                  value={addFoodForm.image}
                  onChange={handleAddFoodChange}
                  placeholder="Or paste emoji/URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  name="category" 
                  value={addFoodForm.category} 
                  onChange={handleAddFoodChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pizza">Pizza</option>
                  <option value="burgers">Burgers</option>
                  <option value="sides">Sides</option>
                  <option value="drinks">Drinks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (min)</label>
                <input 
                  type="number" 
                  name="deliveryTime" 
                  value={addFoodForm.deliveryTime} 
                  onChange={handleAddFoodChange} 
                  min="1" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <input 
                  type="number" 
                  name="rating" 
                  value={addFoodForm.rating} 
                  onChange={handleAddFoodChange} 
                  min="0" 
                  max="5" 
                  step="0.1" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="popular" 
                  checked={addFoodForm.popular} 
                  onChange={handleAddFoodChange} 
                  className="mr-3" 
                />
                <label className="text-sm font-medium text-gray-700">Popular Item</label>
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={addFoodLoading} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {addFoodLoading ? 'Adding...' : 'Add Menu Item'}
                </button>
                {addFoodSuccess && <span className="text-green-600 text-sm">✓ Menu item added successfully!</span>}
                {addFoodError && <span className="text-red-600 text-sm">{addFoodError}</span>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Menu Items ({filteredFoods.length})</h2>
          </div>
        </div>
        <div className="p-6">
          {foodsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading menu items...</p>
            </div>
          ) : foodError ? (
            <div className="text-center py-8">
              <p className="text-red-600">{foodError}</p>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== 'all' ? 'No menu items match your search.' : 'No menu items found.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map(food => (
                <div key={food._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">
                      {isImageUrl(food.image) ? (
                        <img src={food.image} alt={food.name} className="h-12 w-12 object-contain rounded" />
                      ) : (
                        food.image
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{food.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{food.category}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">${food.price}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{food.description}</p>
                  
                  {editFoodId === food._id ? (
                    <div className="space-y-3 border-t pt-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                          <input 
                            type="text" 
                            name="name" 
                            value={editFoodForm.name || ''} 
                            onChange={handleEditFoodChange} 
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
                          <input 
                            type="number" 
                            name="price" 
                            value={editFoodForm.price || ''} 
                            onChange={handleEditFoodChange} 
                            min="0" 
                            step="0.01"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                          name="description" 
                          value={editFoodForm.description || ''} 
                          onChange={handleEditFoodChange} 
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Image (emoji or URL)</label>
                          <input 
                            type="text" 
                            name="image" 
                            value={editFoodForm.image || ''} 
                            onChange={handleEditFoodChange} 
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                          <select 
                            name="category" 
                            value={editFoodForm.category || 'pizza'} 
                            onChange={handleEditFoodChange} 
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pizza">Pizza</option>
                            <option value="burgers">Burgers</option>
                            <option value="sides">Sides</option>
                            <option value="drinks">Drinks</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Time (min)</label>
                          <input 
                            type="number" 
                            name="deliveryTime" 
                            value={editFoodForm.deliveryTime || ''} 
                            onChange={handleEditFoodChange} 
                            min="1"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                          <input 
                            type="number" 
                            name="rating" 
                            value={editFoodForm.rating || ''} 
                            onChange={handleEditFoodChange} 
                            min="0" 
                            max="5" 
                            step="0.1"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="popular" 
                          checked={editFoodForm.popular || false} 
                          onChange={handleEditFoodChange} 
                          className="mr-2" 
                        />
                        <label className="text-xs font-medium text-gray-700">Popular Item</label>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={handleEditFoodSubmit} 
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={handleCancelEdit} 
                          className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {food.popular && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Popular</span>
                        )}
                        {food.deliveryTime && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{food.deliveryTime}min</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditFood(food)} 
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit item"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFood(food._id)} 
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuManagement 