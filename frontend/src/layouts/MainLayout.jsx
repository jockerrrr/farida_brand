import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, Menu } from 'react-pro-sidebar'
import { FaBagShopping } from 'react-icons/fa6'
import Header from '../components/Header'
import Drawer from '../components/Drawer'
import Cart from '../components/Cart'
import './MainLayout.css'

const MainLayout = () => {
  const [cartitem, setcartitem] = useState(() => {
    try {
      const saved = localStorage.getItem('duo_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('duo_cart', JSON.stringify(cartitem))
  }, [cartitem])

  const onAdd = (product) => {
    setcartitem((prev) => {
      const exist = prev.find((x) => x.id === product.id && x.size === product.size)
      if (exist) {
        return prev.map((x) =>
          x.id === product.id && x.size === product.size
            ? { ...exist, quantity: exist.quantity + product.quantity }
            : x
        )
      }
      return [...prev, product]
    })
    setCartOpen(true)
  }

  const onDecrease = (index) => {
    setcartitem((prev) => {
      if (prev[index].quantity === 1) return prev.filter((_, i) => i !== index)
      return prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item
      )
    })
  }

  const onIncrease = (index) => {
    setcartitem((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const totalItems = cartitem.reduce((t, i) => t + i.quantity, 0)

  return (
    <div className="ml-root">
      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="ml-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main column */}
      <div className="ml-page">
        <Header
          onMenuClick={() => setDrawerOpen(true)}
          onCartClick={() => setCartOpen(true)}
          cartCount={totalItems}
        />

        <main className="ml-main">
          <Outlet context={{ cartitem, setcartitem, onAdd, onDecrease, onIncrease }} />
        </main>
      </div>

      {/* Cart sidebar — slides in from the RIGHT */}
      <Sidebar
        rtl={true}
        onBackdropClick={() => setCartOpen(false)}
        toggled={cartOpen}
        breakPoint="all"
        backgroundColor="var(--bg-cream)"
        width="300px"
      >
        <div className="ml-cart-header">
          <h2 className="ml-cart-title">Your Cart</h2>
          <button className="ml-cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <Menu>
          <Cart
            cartitem={cartitem}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            closeSidebar={() => setCartOpen(false)}
          />
        </Menu>
      </Sidebar>
    </div>
  )
}

export default MainLayout

