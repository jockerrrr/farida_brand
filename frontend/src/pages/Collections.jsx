import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/api'
import './Collections.css'

const Collections = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const newOnly = searchParams.get('new') === 'true'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    setUsingFallback(false)
    getProducts()
      .then(res => {
        const all = res.data || []
        if (newOnly) {
          const fresh = all.filter(p => p.newCollection)
          // If no products are marked newCollection yet, show all as a fallback
          if (fresh.length === 0) {
            setProducts(all)
            setUsingFallback(true)
          } else {
            setProducts(fresh)
          }
        } else {
          setProducts(all)
        }
      })
      .catch(() => setError('Could not load products. Make sure the backend is running.'))
      .finally(() => setLoading(false))
  }, [newOnly])

  return (
    <div className="col-page">
      <div className="col-header">
        <button className="col-back" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="col-title">
          {newOnly ? 'New Arrivals' : 'Collections'}
        </h1>
        {usingFallback && (
          <span className="col-fallback-note">Showing all collections</span>
        )}
        {!newOnly && (
          <button className="col-filter-btn" onClick={() => navigate('/collections?new=true')}>
            New Only
          </button>
        )}
        {newOnly && (
          <button className="col-filter-btn" onClick={() => navigate('/collections')}>
            All
          </button>
        )}
      </div>

      {loading && <p className="col-status">Loading…</p>}
      {error && <p className="col-status col-status--err">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="col-status">No products found.</p>
      )}

      <div className="col-grid">
        {products.map(product => (
          <div
            key={product._id}
            className="col-card"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {/* Sold out overlay */}
            {product.stock === 0 && <div className="col-card-soldout">SOLD OUT</div>}

            {/* New badge */}
            {product.newCollection && <div className="col-card-new">NEW</div>}

            {/* Image */}
            <div className="col-card-img-wrap">
              {product.images?.[0]
                ? <img src={product.images[0]} alt={product.Product_name} className={`col-card-img ${product.stock === 0 ? 'col-card-img--soldout' : ''}`} />
                : <div className="col-card-img-placeholder" />
              }
            </div>

            {/* Info */}
            <div className="col-card-info">
              <span className="col-card-name">{product.Product_name}</span>
              <span className="col-card-price">LE {product.Price}.00</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collections

