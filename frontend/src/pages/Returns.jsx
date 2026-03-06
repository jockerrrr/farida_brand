import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyOrder, returnOrder } from '../services/api'
import './Returns.css'

const Returns = () => {
  const navigate = useNavigate()
  const [step, setStep]           = useState(1)   // 1=lookup, 2=select items
  const [orderNum, setOrderNum]   = useState('')
  const [phone, setPhone]         = useState('')
  const [order, setOrder]         = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await verifyOrder(Number(orderNum))
      setOrder(res.data)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found or not eligible for return.')
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (itemId) => {
    setSelectedItems(prev =>
      prev.find(i => i.item_id === itemId)
        ? prev.filter(i => i.item_id !== itemId)
        : [...prev, { item_id: itemId }]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedItems.length === 0) { setError('Please select at least one item.'); return }
    setError('')
    setLoading(true)
    try {
      await returnOrder({ order_number: Number(orderNum), phone_number: phone, items: selectedItems })
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

        {step === 1 && (
          <form className="returns-form" onSubmit={handleVerify}>
            <label className="returns-label">Order Number</label>
            <input className="returns-input" type="number" placeholder="e.g. 1234567"
              value={orderNum} onChange={e => setOrderNum(e.target.value)} required />

            <label className="returns-label">Phone Number</label>
            <input className="returns-input" type="tel" placeholder="01..."
              value={phone} onChange={e => setPhone(e.target.value)} required />

            {error && <p className="returns-error">{error}</p>}
            <button className="returns-btn" type="submit" disabled={loading}>
              {loading ? 'Looking up…' : 'Find My Order'}
            </button>
          </form>
        )}

        {step === 2 && order && (
          <form className="returns-form" onSubmit={handleSubmit}>
            <p className="returns-order-num">Order #{order.order_number}</p>
            <label className="returns-label">Select items to return / exchange:</label>

            <div className="returns-items">
              {order.items?.map((item, i) => (
                <label key={i} className="returns-item-row">
                  <input
                    type="checkbox"
                    onChange={() => toggleItem(item._id)}
                    checked={!!selectedItems.find(s => s.item_id === item._id)}
                  />
                  <span>{item.product?.Product_name || 'Item'} — Size {item.size} × {item.quantity}</span>
                </label>
              ))}
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

