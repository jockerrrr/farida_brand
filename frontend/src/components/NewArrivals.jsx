import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewArrivals.css'

const products = [
  {
    id: 'black-set',
    label: 'THE DUO',
    subtitle: 'Black Set',
    price: '85.00',
    images: ['/black-front.jpeg', '/black-side.jpeg', '/black-back.jpeg'],
  },
  {
    id: 'white-set',
    label: 'THE DUO',
    subtitle: 'White Set',
    price: '85.00',
    images: ['/white-front.jpeg', '/white-side.jpeg', '/white-back.jpeg'],
  },
]

function ProductCard({ product }) {
  const navigate = useNavigate()
  const dragRef = useRef({ startX: 0, moved: false })

  const goToProduct = () => navigate(`/products/${product.id}`)

  // Detect swipe vs tap so scrolling doesn't trigger navigation
  const handlePointerDown = (e) => {
    dragRef.current = { startX: e.clientX, moved: false }
  }

  const handlePointerUp = (e) => {
    const delta = Math.abs(e.clientX - dragRef.current.startX)
    if (delta < 8) goToProduct()   // tap — navigate
    // else: it was a swipe — do nothing
  }

  return (
    <div className="pc">
      {/* Scrollable image strip — tap to navigate, swipe to scroll */}
      <div
        className="pc-scroll-strip"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
        aria-label={`View ${product.subtitle}`}
      >
        {product.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${product.subtitle} view ${i + 1}`}
            className="pc-strip-img"
            draggable={false}
          />
        ))}
      </div>

      {/* Info row — also clickable */}
      <div className="pc-info" onClick={goToProduct} role="button" tabIndex={-1}>
        <div className="pc-name-wrap">
          <span className="pc-label">{product.label}</span>
          <span className="pc-name">{product.subtitle}</span>
        </div>
        <span className="pc-price">LE {product.price}</span>
      </div>
    </div>
  )
}

export default function NewArrivals() {
  return (
    <section className="new-arrivals" id="new-arrivals">
      <div className="na-header">
        <h2 className="na-title">NEW ARRIVALS</h2>
        <a href="#" className="na-view-all">View All</a>
      </div>
      <div className="na-list">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}

