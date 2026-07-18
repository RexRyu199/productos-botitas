function ProductFallbackIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="14" rx="2"/>
      <path d="M3 7l2.5-4h13L21 7"/>
      <path d="M12 11v6M9 14h6"/>
    </svg>
  )
}

export default ProductFallbackIcon