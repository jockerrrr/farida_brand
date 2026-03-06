import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ onMenuClick, onCartClick, cartCount = 0 }) {
  const navigate = useNavigate()

  return (
    <header className="header">
      <button className="header-btn" onClick={onMenuClick} aria-label="Open menu">
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Logo — click goes to landing page on every page */}
      <button className="header-logo-btn" onClick={() => navigate('/')} aria-label="Go to home">
        <img src="/images/final logo.png" alt="the Duo" className="header-logo" />
      </button>

      <button className="header-btn header-cart-btn" onClick={onCartClick} aria-label="Shopping bag">
        <i className="fa-solid fa-bag-shopping"></i>
        {cartCount > 0 && (
          <span className="header-cart-count">{cartCount}</span>
        )}
      </button>
    </header>
  )
}

