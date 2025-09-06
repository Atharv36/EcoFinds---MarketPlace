// src/components/ProductCard.jsx
import { useState } from 'react'
import Loader from './Loader'
import toast from 'react-hot-toast'

const ProductCard = ({ product, isLoading = false }) => {
  const [addingToCart, setAddingToCart] = useState(false)
  if (isLoading) {
    return <Loader type="product" />
  }

  if (!product) {
    return null
  }

  const addToCart = () => {
    setAddingToCart(true)
    
    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
      
      // Check if product already exists in cart
      const existingItem = existingCart.find(item => item.id === product._id)
      
      if (existingItem) {
        // Update quantity
        existingItem.quantity += 1
      } else {
        // Add new item
        existingCart.push({
          id: product._id,
          title: product.title || product.name,
          name: product.title || product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        })
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart))
      
      // Dispatch custom event to update cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated'))
      
      toast.success('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="product-card">
      <img 
        src={product.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
        alt={product.title || product.name} 
        className="product-image" 
      />
      <div className="product-info">
        <h3 className="product-title">{product.title || product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          {product.owner && (
            <span className="product-owner">by {product.owner.username}</span>
          )}
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <button 
          className="add-to-cart-btn"
          onClick={addToCart}
          disabled={addingToCart}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard