import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import orderAPI from '../services/order'
import './Returns.css'

const Returns = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [orderNum, setOrderNum] = useState('')
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [returnItems, setReturnItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await orderAPI.verifyOrder(Number(orderNum))
      setOrder(res.data)
      // initialize return items with all order items
      setReturnItems(res.data.items.map(item => ({
        product: item.product._id || item.product,
        original_size: item.size,
        original_quantity: item.quantity,
        new_size: item.size,
        new_quantity: item.quantity,
        selected: false,
      })))
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found or not eligible for return.')
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (index) => {
    setReturnItems(prev => prev.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    ))
  }

  const updateQuantity = (index, delta) => {
    setReturnItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      const next = item.new_quantity + delta
      if (next < 0) return { ...item, new_quantity: 0, selected: true }
      if (next === 0) return { ...item, new_quantity: 0, selected: true }
      return { ...item, new_quantity: next }
    }))
  }

  const updateSize = (index, newSize) => {
    setReturnItems(prev => prev.map((item, i) =>
      i === index ? { ...item, new_size: newSize, selected: true } : item
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const selected = returnItems.filter(i => i.selected)
    if (selected.length === 0) { setError('Please select at least one item.'); return }
    setError('')
    setLoading(true)
    try {
      await orderAPI.returnPolicy(
        Number(orderNum),
        phone,
        selected.map(item => ({
          product: item.product,
          original_size: item.original_size,
          original_quantity: item.original_quantity,
          new_size: item.new_size,
          new_quantity: item.new_quantity,
        }))
      )
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit return request.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="returns-page">
      <div className="returns-success">
        <p className="returns-success-icon">✓</p>
        <h2>Request Submitted</h2>
        <p>We received your return request and will contact you shortly.</p>
        <button onClick={() => navigate('/')}>Back to Shop</button>
      </div>
    </div>
  )

  return (
    <div className="returns-page">
      <button className="returns-back" onClick={() => navigate(-1)}>← Back</button>
      <div className="returns-inner">
        <h1 className="returns-title">Returns &amp; Exchanges</h1>
        <p className="returns-subtitle">Only delivered orders are eligible. We'll reach out to confirm.</p>

        {/* Step 1 — verify order */}
        {step === 1 && (
          <form className="returns-form" onSubmit={handleVerify}>
            <label className="returns-label">Order Number</label>
            <input
              className="returns-input"
              type="number"
              placeholder="e.g. 1234567"
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              required
            />
            <label className="returns-label">Phone Number</label>
            <input
              className="returns-input"
              type="tel"
              placeholder="01..."
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            {error && <p className="returns-error">{error}</p>}
            <button className="returns-btn" type="submit" disabled={loading}>
              {loading ? 'Looking up…' : 'Find My Order'}
            </button>
          </form>
        )}

        {/* Step 2 — select items and adjustments */}
        {step === 2 && order && (
          <form className="returns-form" onSubmit={handleSubmit}>
            <p className="returns-order-num">Order #{order.order_number}</p>
            <p className="returns-label">Select items to return or exchange:</p>

            <div className="returns-items">
              {order.items?.map((item, i) => {
                const ri = returnItems[i]
                if (!ri) return null
                const productName = item.product?.Product_name || 'Item'
                const availableSizes = item.product?.sizes_available || [item.size]

                return (
                  <div key={i} className={`returns-item-card ${ri.selected ? 'returns-item-card--selected' : ''}`}>
                    
                    {/* Checkbox + name */}
                    <div className="returns-item-header">
                      <input
                        type="checkbox"
                        className="returns-checkbox"
                        checked={ri.selected}
                        onChange={() => toggleItem(i)}
                      />
                      <span className="returns-item-name">{productName}</span>
                    </div>

                    {/* Original info */}
                    <p className="returns-item-original">
                      Original: Size {ri.original_size} × {ri.original_quantity}
                    </p>

                    {/* Size selector */}
                    <p className="returns-field-label">Size</p>
                    <div className="returns-sizes">
                      {availableSizes.map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`returns-size-btn ${ri.new_size === s ? 'returns-size-btn--active' : ''}`}
                          onClick={() => updateSize(i, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Quantity */}
                    <p className="returns-field-label">New Quantity <span className="returns-field-note">(0 = remove)</span></p>
                    <div className="returns-qty">
                      <button
                        type="button"
                        className="returns-qty-btn"
                        onClick={() => updateQuantity(i, -1)}
                      >−</button>
                      <span className="returns-qty-num">
                        {ri.new_quantity === 0 ? 'Remove' : ri.new_quantity}
                      </span>
                      <button
                        type="button"
                        className="returns-qty-btn"
                        onClick={() => updateQuantity(i, 1)}
                        disabled={ri.new_quantity >= ri.original_quantity}
                      >+</button>
                    </div>

                  </div>
                )
              })}
            </div>

            {error && <p className="returns-error">{error}</p>}
            <button className="returns-btn" type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Return Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Returns