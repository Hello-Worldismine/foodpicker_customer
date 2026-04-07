function SectionCard({ children, className = '' }) {
    return <section className={`section-card ${className}`}>{children}</section>
  }
  
  export default SectionCard