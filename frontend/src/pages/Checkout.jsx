import { useNavigate, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createUser, createOrder } from '../services/api'
import './Checkout.css'

const Checkout = () => {
  const { cartitem, setcartitem } = useOutletContext()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' })

  const onSubmit = async (data) => {
    setSubmitting(true)
    setOrderError('')
    try {
      // 1. Create customer record
      const userRes = await createUser({
        Firstname: data.firstname,
        Lastname: data.lastname,
        email: data.email,
        Address: data.address,
        Apartment_suite_etc: data.apartment || '',
        city: data.city,
        Phone: data.phone,
        save_info: data.saveInfo || false,
      })
      const customerId = userRes.data._id

      // 2. Create order
      await createOrder({
        Customer: customerId,
        items: cartitem.map(item => ({
          product: item.id,
          quantity: Number(item.quantity),
          size: item.size,
        })),
      })

      setcartitem([])
      navigate('/order-success')
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setOrderError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (cartitem.length === 0) navigate('/')
  }, [cartitem, navigate])

  const SHIPPING = 70
  const subtotal = cartitem.reduce(
    (acc, item) => acc + Number(item.price.replace(/[^0-9.]/g, '')) * item.quantity, 0
  )
  const total = (subtotal + SHIPPING).toFixed(2)

  return (
    <div className="checkout-page">
      <button className="checkout-back" onClick={() => navigate('/')}>← Back</button>

      <div className="checkout-inner">
        <h1 className="checkout-title">Checkout</h1>

        {/* Order summary */}
        <div className="checkout-summary">
          <h2 className="checkout-section-title">Order Summary</h2>
          {cartitem.map((item, i) => (
            <div key={i} className="checkout-summary-row">
              <span className="checkout-summary-label">{item.quantity}× {item.displayName} ({item.size})</span>
              <span className="checkout-summary-price">LE {(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-summary-row">
            <span className="checkout-summary-label">Shipping (COD)</span>
            <span className="checkout-summary-price">LE {SHIPPING}.00</span>
          </div>
          <div className="checkout-total-row">
            <span>Total</span>
            <span className="checkout-total-amount">LE {total} EGP</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
          <h2 className="checkout-section-title">Delivery</h2>

          <div className="checkout-field">
            <input {...register('firstname', { required: 'First name required', minLength: { value: 3, message: 'Min 3 characters' } })}
              type="text" placeholder="First name"
              className={`checkout-input ${errors.firstname ? 'checkout-input--err' : ''}`} />
            {errors.firstname && <p className="checkout-error">{errors.firstname.message}</p>}
          </div>

          <div className="checkout-field">
            <input {...register('lastname', { required: 'Last name required' })}
              type="text" placeholder="Last name"
              className={`checkout-input ${errors.lastname ? 'checkout-input--err' : ''}`} />
            {errors.lastname && <p className="checkout-error">{errors.lastname.message}</p>}
          </div>

          <div className="checkout-field">
            <input {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
              type="email" placeholder="Email address"
              className={`checkout-input ${errors.email ? 'checkout-input--err' : ''}`} />
            {errors.email && <p className="checkout-error">{errors.email.message}</p>}
          </div>

          <div className="checkout-field">
            <input {...register('address', { required: 'Address required', minLength: { value: 10, message: 'Please provide a full address' } })}
              type="text" placeholder="Address"
              className={`checkout-input ${errors.address ? 'checkout-input--err' : ''}`} />
            {errors.address && <p className="checkout-error">{errors.address.message}</p>}
          </div>

          <div className="checkout-field">
            <input {...register('apartment')} type="text" placeholder="Apartment, suite, etc. (optional)" className="checkout-input" />
          </div>

          <div className="checkout-field">
            <input {...register('city', { required: 'City required' })}
              type="text" placeholder="City"
              className={`checkout-input ${errors.city ? 'checkout-input--err' : ''}`} />
            {errors.city && <p className="checkout-error">{errors.city.message}</p>}
          </div>

          <div className="checkout-field">
            <input {...register('phone', { required: 'Phone required', pattern: { value: /^01[0125][0-9]{8}$/, message: 'Enter a valid Egyptian number' } })}
              type="tel" placeholder="Phone number (01...)"
              className={`checkout-input ${errors.phone ? 'checkout-input--err' : ''}`} />
            {errors.phone && <p className="checkout-error">{errors.phone.message}</p>}
          </div>

          <label className="checkout-check-label">
            <input {...register('saveInfo')} type="checkbox" className="checkout-check" />
            Save this information for next time
          </label>

          <h2 className="checkout-section-title checkout-section-title--payment">Payment</h2>
          <div className="checkout-payment-box">
            <span className="checkout-payment-dot" />
            <div className="checkout-payment-text">
              <span className="checkout-payment-name">Cash on Delivery (COD)</span>
              <span className="checkout-payment-note">+LE 70 shipping fee</span>
            </div>
          </div>

          {orderError && <p className="checkout-error checkout-error--global">{orderError}</p>}

          <button type="submit" className="checkout-submit" disabled={submitting}>
            {submitting ? 'Placing Order…' : 'Complete Order'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Checkout

