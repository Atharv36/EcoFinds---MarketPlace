// src/components/Header.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'
import { useState, useEffect } from 'react'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }
    
    updateCartCount()
    window.addEventListener('cartUpdated', updateCartCount)
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="header">
      <Link to="/" className="logo-section">
        <div className="logo">EcoFinds</div>
        <div className="tagline">Sustainable Shopping</div>
      </Link>
      
      <SearchBar />
      
      <nav className="navigation">
        <Link 
          to="/"
          className={`nav-btn ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/products"
          className={`nav-btn ${isActive('/products') ? 'active' : ''}`}
        >
          Products
        </Link>
        <Link 
          to="/categories"
          className={`nav-btn ${isActive('/categories') ? 'active' : ''}`}
        >
          Categories
        </Link>
      </nav>
      
      <div className="user-actions">
        {/* Cart Button - Always visible */}
        <Link to="/cart" className="cart-btn">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="btn btn-outline">
              My Profile
            </Link>
            <button 
              className="btn btn-primary" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header