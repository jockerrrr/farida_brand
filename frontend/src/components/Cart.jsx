import { useNavigate } from 'react-router-dom'
import './Cart.css'

const SHIPPING = 70

const Cart = ({ cartitem, onDecrease, onIncrease, closeSidebar }) => {
  const navigate = useNavigate()

  const subtotal = cartitem.reduce((sum, item) => {
    const price = Number(item.price.replace(/[^0-9.]/g, ''))
    return sum + price * Number(item.quantity)
  }, 0)

  const total = (subtotal).toFixed(2)

  const handleCheckout = () => {
    closeSidebar()
    navigate('/checkout')
  }

  if (cartitem.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="cart">
      <ul className="cart-list">
        {cartitem.map((item, index) => (
          <li key={`${item.id}-${index}`} className="cart-item">
            <img src={item.images} alt={item.displayName} className="cart-item-img" />

            <div className="cart-item-info">
              <span className="cart-item-name">{item.displayName}</span>
              <span className="cart-item-meta">{item.size} · LE {item.price}</span>

              {/* +/- quantity controls */}
              <div className="cart-qty-row">
                <button
                  className="cart-qty-btn"
                  onClick={() => onDecrease(index)}
                  aria-label="Decrease quantity"
                >−</button>
                <span className="cart-qty-num">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => onIncrease(index)}
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <div className="cart-fee-row">
          <span className="cart-fee-label">Subtotal</span>
          <span className="cart-fee-value">LE {subtotal.toFixed(2)}</span>
        </div>
        <div className="cart-total-row">
          <span className="cart-total-label">Total</span>
          <span className="cart-total-amount">LE {total} EGP</span>
        </div>
        <button className="cart-checkout-btn" onClick={handleCheckout}>
          Check Out
        </button>
      </div>
    </div>
  )
}

export default Cart

