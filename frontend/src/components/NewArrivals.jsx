import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import prodAPI from '../services/product'
import './NewArrivals.css'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const dragRef = useRef({ startX: 0, moved: false })

  const goToProduct = () => navigate(`/product/${product._id}`)

  const handlePointerDown = (e) => {
    dragRef.current = { startX: e.clientX, moved: false }
  }

  const handlePointerUp = (e) => {
    const delta = Math.abs(e.clientX - dragRef.current.startX)
    if (delta < 8) goToProduct()
  }

  return (
    <div className="pc">
      <div
        className="pc-scroll-strip"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && goToProduct()}
        aria-label={`View ${product.Product_name}`}
      >
        {product.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${product.Product_name} view ${i + 1}`}
            className="pc-strip-img"
            draggable={false}
          />
        ))}
      </div>

      <div className="pc-info" onClick={goToProduct} role="button" tabIndex={-1}>
        <div className="pc-name-wrap">
          <span className="pc-label">THE DUO</span>
          <span className="pc-name">{product.Product_name}</span>
        </div>
        <span className="pc-price">LE {product.Price}</span>
      </div>
    </div>
  )
}

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    prodAPI.getNewCollection()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load products"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <section className="new-arrivals" id="new-arrivals">
      <div className="na-header">
        <h2 className="na-title">NEW ARRIVALS</h2>
        <a href="#" className="na-view-all">View All</a>
      </div>
      <div className="na-list">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  )
}