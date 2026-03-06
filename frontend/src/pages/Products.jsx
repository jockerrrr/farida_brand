import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { getProduct } from '../services/api'
import './Products.css'

// Fallback static products (used when backend is offline)
const staticProducts = {
  'black-set': {
    _id: 'black-set', Product_name: 'Black Set', Price: 85, stock: 10,
    images: ['/black-front.jpeg', '/black-side.jpeg', '/black-back.jpeg'],
    sizes_available: ['XS/S', 'M/L'], category: 'set'
  },
  'white-set': {
    _id: 'white-set', Product_name: 'White Set', Price: 85, stock: 10,
    images: ['/white-front.jpeg', '/white-side.jpeg', '/white-back.jpeg'],
    sizes_available: ['XS/S', 'M/L'], category: 'set'
  },
}

const isMongoId = (str) => /^[a-f\d]{24}$/i.test(str)

const Products = () => {
  const { onAdd } = useOutletContext()
  const { setName } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [count, setCount] = useState(1)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [chartTab, setChartTab] = useState('cardigan')

  useEffect(() => {
    const load = async () => {
      if (isMongoId(setName)) {
        try {
          const res = await getProduct(setName)
          setProduct(res.data)
          setSelectedSize(res.data.sizes_available?.[0] || '')
        } catch {
          setProduct(null)
        }
      } else {
        const fallback = staticProducts[setName?.toLowerCase() || '']
        setProduct(fallback || null)
        setSelectedSize(fallback?.sizes_available?.[0] || 'XS/S')
      }
      setLoading(false)
    }
    load()
  }, [setName])

  if (loading) return <div className="prod-loading">Loading…</div>

  if (!product) return (
    <div className="prod-not-found">
      <p>Product not found</p>
      <button onClick={() => navigate('/')}>← Back to Shop</button>
    </div>
  )

  const soldOut = product.stock === 0
  const sizes = product.sizes_available?.length ? product.sizes_available : ['XS/S', 'M/L']
  const images = product.images?.length ? product.images : []
  const price = product.Price ?? product.price ?? 85
  const name = product.Product_name ?? product.displayName ?? 'Product'

  const handleAddToCart = () => {
    if (soldOut) return
    onAdd({
      id: product._id,
      displayName: name,
      price: String(price),
      size: selectedSize,
      images: images[0] || '',
      quantity: count,
    })
  }

  return (
    <div className="prod-page">
      <button className="prod-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="prod-inner">
        {/* Image gallery */}
        <div className="prod-gallery">
          {soldOut && <div className="prod-soldout-badge">SOLD OUT</div>}
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="prod-swiper">
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={`${name} view ${i + 1}`} className={`prod-swiper-img ${soldOut ? 'prod-swiper-img--soldout' : ''}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Details */}
        <div className="prod-details">
          <h1 className="prod-name">{name}</h1>
          {product.description && <p className="prod-desc">{product.description}</p>}
          <p className="prod-price">LE {price}.00</p>

          {/* Size selector — XS/S and M/L only */}
          <p className="prod-size-label">Select Size</p>
          <div className="prod-sizes">
            {sizes.map((s) => (
              <button
                key={s}
                disabled={soldOut}
                className={`prod-size-btn ${selectedSize === s ? 'prod-size-btn--active' : ''} ${soldOut ? 'prod-size-btn--disabled' : ''}`}
                onClick={() => !soldOut && setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Quantity */}
          {!soldOut && (
            <div className="prod-qty">
              <button className="prod-qty-btn" onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
              <span className="prod-qty-num">{count}</span>
              <button className="prod-qty-btn" onClick={() => setCount(c => c + 1)}>+</button>
            </div>
          )}

          {/* Add to cart */}
          <button className={`prod-add-btn ${soldOut ? 'prod-add-btn--soldout' : ''}`} onClick={handleAddToCart} disabled={soldOut}>
            {soldOut ? 'SOLD OUT' : 'ADD TO CART'}
          </button>

          {/* Size chart accordion */}
          <div className="prod-accordion">
            <button className="prod-accordion-toggle" onClick={() => setShowSizeChart(v => !v)}>
              <span>Size Chart</span>
              <span>{showSizeChart ? '−' : '+'}</span>
            </button>
            {showSizeChart && (
              <div className="prod-chart-wrap">
                {/* Tabs */}
                <div className="prod-chart-tabs">
                  <button className={`prod-chart-tab ${chartTab === 'cardigan' ? 'prod-chart-tab--active' : ''}`} onClick={() => setChartTab('cardigan')}>Cardigans</button>
                  <button className={`prod-chart-tab ${chartTab === 'pants' ? 'prod-chart-tab--active' : ''}`} onClick={() => setChartTab('pants')}>Pants</button>
                </div>
                <img
                  src={chartTab === 'pants' ? '/pants-chart.jpeg' : '/cardigan-chart.jpeg'}
                  alt={`${chartTab} size chart`}
                  className="prod-chart-img"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products

