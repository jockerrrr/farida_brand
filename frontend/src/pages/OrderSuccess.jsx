import { useNavigate } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const navigate = useNavigate()
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1 className="success-title">Order Placed!</h1>
      <p className="success-msg">
        Thank you for your order. You'll receive a confirmation email shortly.
        We'll contact you to confirm delivery details.
      </p>
      <button className="success-btn" onClick={() => navigate('/')}>
        Continue Shopping
      </button>
    </div>
  )
}

export default OrderSuccess

