// src/pages/Cart.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Cart = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [isAuthenticated, navigate])

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title || item.name} />
            <div className="item-details">
              <h3>{item.title || item.name}</h3>
              <p>${item.price.toFixed(2)} x {item.quantity}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            <div className="item-actions">
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h2>Total: ${total.toFixed(2)}</h2>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  )
}

export default Cart