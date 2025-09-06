// src/pages/ProductListing.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('')
  const [filterBy, setFilterBy] = useState('')
  const [groupBy, setGroupBy] = useState('')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsAPI.getAll({ 
          page: currentPage,
          limit: 12,
          category: filterBy || undefined
        })
        
        if (response.data.success) {
          setProducts(response.data.data)
          setFilteredProducts(response.data.data)
          setTotalPages(response.data.totalPages)
        } else {
          toast.error('Failed to load products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, filterBy])

  // Handle search functionality
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm) {
        try {
          const response = await productsAPI.search({ 
            q: searchTerm,
            page: 1,
            limit: 12
          })
          
          if (response.data.success) {
            setFilteredProducts(response.data.data)
          }
        } catch (error) {
          console.error('Error searching products:', error)
          toast.error('Search failed')
        }
      } else {
        setFilteredProducts(products)
      }
    }

    const timeoutId = setTimeout(searchProducts, 500) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchTerm, products])

  const handleSort = (type) => {
    setSortBy(type)
    let sorted = [...filteredProducts]
    
    if (type === 'price') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (type === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (type === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category))
    }
    
    setFilteredProducts(sorted)
  }

  const handleFilter = (type) => {
    setFilterBy(type)
    // In a real app, this would show a filter modal or dropdown
    console.log('Filter by:', type)
  }

  const handleGroupBy = (type) => {
    setGroupBy(type)
    // In a real app, this would group products by the selected criteria
    console.log('Group by:', type)
  }

  if (isLoading) {
    return (
      <div className="product-listing-page">
        <h1>All Products</h1>
        <div className="controls">
          <div className="control-btn">
            <span>Sort</span>
          </div>
          <div className="control-btn">
            <span>Filter</span>
          </div>
          <div className="control-btn">
            <span>Group By</span>
          </div>
        </div>
        <div className="search-control">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="products-grid">
          {[...Array(6)].map((_, i) => (
            <ProductCard key={i} isLoading={true} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="product-listing-page">
      <h1>All Products</h1>
      
      <div className="controls">
        <div 
          className={`control-btn ${sortBy ? 'active' : ''}`} 
          onClick={() => handleSort(sortBy === 'price' ? '' : 'price')}
        >
          <span>Sort {sortBy && `(${sortBy})`}</span>
        </div>
        <div 
          className={`control-btn ${filterBy ? 'active' : ''}`} 
          onClick={() => handleFilter('category')}
        >
          <span>Filter {filterBy && `(${filterBy})`}</span>
        </div>
        <div 
          className={`control-btn ${groupBy ? 'active' : ''}`} 
          onClick={() => handleGroupBy('category')}
        >
          <span>Group By {groupBy && `(${groupBy})`}</span>
        </div>
      </div>
      
      <div className="search-control">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <div className="results-count">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <h2>No products found</h2>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductListing