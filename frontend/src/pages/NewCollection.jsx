import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import prodAPI from '../services/product'
import './Collections.css'

const NewArrivals = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    prodAPI.getNewCollection()
      .then(res => setProducts(res.data || []))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="col-page">
      <div className="col-header">
        <button className="col-back" onClick={() => navigate('/')}>← Back</button>
        <h1 className="col-title">New Arrivals</h1>
      </div>

      {loading && <p className="col-status">Loading…</p>}
      {error && <p className="col-status col-status--err">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="col-status">No new arrivals yet.</p>
      )}

      <div className={`col-grid ${products.length === 1 ? 'col-grid--single' : ''}`}>
        {products.map(product => (
          <div
            key={product._id}
            className="col-card"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            {product.stock === 0 && <div className="col-card-soldout">SOLD OUT</div>}

            <div className="col-card-img-wrap">
              {product.images?.[0]
                ? <img
                    src={product.images[0]}
                    alt={product.Product_name}
                    className={`col-card-img ${product.stock === 0 ? 'col-card-img--soldout' : ''}`}
                  />
                : <div className="col-card-img-placeholder" />
              }
            </div>

            <div className="col-card-info">
              <span className="col-card-name">{product.Product_name}</span>
              <span className="col-card-price">LE {product.Price}.00</span>
              <div className="col-card-new">NEW</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewArrivals