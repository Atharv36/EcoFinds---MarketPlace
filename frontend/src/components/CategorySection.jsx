// src/components/CategorySection.jsx
const CategorySection = ({ categories }) => {
  return (
    <section>
      <h2>Browse Categories</h2>
      <div className="category-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-title">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategorySection