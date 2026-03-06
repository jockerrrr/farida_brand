import { useNavigate } from 'react-router-dom'
import './Drawer.css'

const navLinks = [
  { label: 'New Arrivals', path: '/collections?new=true' },
  { label: 'Collections', path: '/collections' },
  { label: 'About Us', path: '/about' },
  { label: 'Returns & Exchanges', path: '/returns' },
]

export default function Drawer({ isOpen, onClose }) {
  const navigate = useNavigate()

  const go = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <aside className={`drawer ${isOpen ? 'drawer--open' : ''}`}>
      {/* Header — only the X close button */}
      <div className="drawer-header">
        <button className="drawer-btn" onClick={onClose} aria-label="Close menu">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Nav */}
      <nav className="drawer-nav">
        {navLinks.map(({ label, path }) => (
          <button key={label} className="drawer-nav-item" onClick={() => go(path)}>
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="drawer-footer">
        <span className="drawer-footer-text"><em>the Duo</em> · 2026</span>
      </div>
    </aside>
  )
}

