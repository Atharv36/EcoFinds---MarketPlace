// src/components/Loader.jsx
import './Loader.css'

const Loader = ({ type = 'default' }) => {
  switch(type) {
    case 'product':
      return (
        <div className="loader product-loader">
          <div className="loader-image"></div>
          <div className="loader-content">
            <div className="loader-line loader-title"></div>
            <div className="loader-line loader-description"></div>
            <div className="loader-line loader-price"></div>
            <div className="loader-button"></div>
          </div>
        </div>
      )
    
    case 'cart':
      return (
        <div className="loader cart-loader">
          <div className="loader-circle"></div>
          <div className="loader-text">Processing your order...</div>
        </div>
      )
    
    case 'search':
      return (
        <div className="loader search-loader">
          <div className="loader-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>Searching products...</p>
        </div>
      )
    
    case 'profile':
      return (
        <div className="loader profile-loader">
          <div className="loader-avatar"></div>
          <div className="loader-details">
            <div className="loader-line"></div>
            <div className="loader-line"></div>
            <div className="loader-line"></div>
          </div>
        </div>
      )
    
    default:
      return (
        <div className="loader default-loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )
  }
}

export default Loader