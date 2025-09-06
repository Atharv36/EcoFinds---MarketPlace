// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import CategorySection from '../components/CategorySection'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set static categories
        setCategories([
          { id: 1, name: 'Electronics', icon: '📱' },
          { id: 2, name: 'Clothing', icon: '👕' },
          { id: 3, name: 'Home & Garden', icon: '🏠' },
          { id: 4, name: 'Sports', icon: '⚽' },
          { id: 5, name: 'Books', icon: '📚' },
          { id: 6, name: 'Toys', icon: '🧸' },
        ])

        // Fetch featured products from backend
        const response = await productsAPI.getAll({ limit: 6 })
        if (response.data.success) {
          setFeaturedProducts(response.data.data)
        } else {
          toast.error('Failed to load products')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="hero-section">
          <Loader type="default" />
        </div>
        
        <section>
          <h2>Browse Categories</h2>
          <div className="category-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="category-card">
                <Loader type="default" />
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h2>Featured Products</h2>
          <div className="products-grid">
            {[...Array(3)].map((_, i) => (
              <ProductCard key={i} isLoading={true} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to EcoFinds</h1>
        <p className="hero-subtitle">Discover sustainable products and reduce waste</p>
      </section>

      <CategorySection categories={categories} />
      
      <section>
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home