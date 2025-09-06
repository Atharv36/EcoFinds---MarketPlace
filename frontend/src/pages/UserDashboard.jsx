// src/pages/UserDashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { productsAPI } from '../services/api'
import AddProductForm from '../components/AddProductForm'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [userListings, setUserListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (activeTab === 'listings') {
      fetchUserListings()
    }
  }, [activeTab])

  const fetchUserListings = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getAll({ limit: 50 })
      if (response.data.success) {
        // Filter products by current user (in a real app, backend would handle this)
        const userProducts = response.data.data.filter(product => 
          product.owner && product.owner._id === user?.id
        )
        setUserListings(userProducts)
      }
    } catch (error) {
      console.error('Error fetching user listings:', error)
      toast.error('Failed to load your listings')
    } finally {
      setLoading(false)
    }
  }

  const handleProductAdded = (newProduct) => {
    setUserListings(prev => [newProduct, ...prev])
  }

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'profile' ? 'tab-active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={activeTab === 'listings' ? 'tab-active' : ''}
          onClick={() => setActiveTab('listings')}
        >
          My Listings
        </button>
        <button 
          className={activeTab === 'purchases' ? 'tab-active' : ''}
          onClick={() => setActiveTab('purchases')}
        >
          Purchase History
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <h2>Profile Information</h2>
            <div className="profile-details">
              <p><strong>Name:</strong> {user?.username || user?.name || 'User Name'}</p>
              <p><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
              <p><strong>Member Since:</strong> January 2023</p>
            </div>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        )}
        
        {activeTab === 'listings' && (
          <div className="user-listings">
            <h2>My Listings</h2>
            {loading ? (
              <div className="loading">Loading your listings...</div>
            ) : (
              <>
                <div className="listings-grid">
                  {userListings.length > 0 ? (
                    userListings.map(item => (
                      <div key={item._id} className="listing-item">
                        <img src={item.image} alt={item.title} />
                        <div className="listing-details">
                          <h3>{item.title}</h3>
                          <p>${item.price.toFixed(2)} | {item.category}</p>
                          <p className="description">{item.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-listings">
                      <p>You haven't listed any products yet.</p>
                    </div>
                  )}
                </div>
                <button 
                  className="add-listing-btn"
                  onClick={() => setShowAddForm(true)}
                >
                  Add New Listing
                </button>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'purchases' && (
          <div className="purchase-history">
            <h2>Purchase History</h2>
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Seller</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{purchase.name}</td>
                    <td>${purchase.price.toFixed(2)}</td>
                    <td>{purchase.category}</td>
                    <td>{purchase.seller}</td>
                    <td>{purchase.purchaseDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showAddForm && (
        <AddProductForm
          onClose={() => setShowAddForm(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  )
}

export default UserDashboard