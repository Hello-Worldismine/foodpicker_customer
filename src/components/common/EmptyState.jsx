function EmptyState({ title, description }) {
    return (
      <div className="empty-state">
        <div className="empty-character">🐣</div>
        <p className="empty-title">{title}</p>
        {description && <p className="empty-description">{description}</p>}
      </div>
    )
  }
  
  export default EmptyState