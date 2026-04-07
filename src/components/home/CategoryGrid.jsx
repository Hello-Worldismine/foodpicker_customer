function CategoryGrid({ categories }) {
    return (
      <div className="category-grid">
        {categories.map((category) => (
          <button key={category.id} className="category-item">
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    )
  }
  
  export default CategoryGrid