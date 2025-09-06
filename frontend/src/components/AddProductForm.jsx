// src/components/AddProductForm.jsx
import { useState } from 'react'
import { productsAPI } from '../services/api'
import toast from 'react-hot-toast'

const AddProductForm = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      }
      
      const response = await productsAPI.create(productData)
      
      if (response.data.success) {
        toast.success('Product added successfully!')
        onProductAdded(response.data.data)
        onClose()
      } else {
        toast.error(response.data.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price ($) *</label>
            <input
              type="number"
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (optional)</label>
            <input
              type="url"
              name="image"
              className="form-input"
              value={formData.image}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductForm
