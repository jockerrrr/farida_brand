import { useState } from 'react'
import './Subscribe.css'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="subscribe">
      <div className="subscribe-inner">
        <h2 className="subscribe-heading">Join the Duo.</h2>
        <p className="subscribe-sub">
          Be the first to know about new arrivals, exclusive offers, and drops.
        </p>

        {submitted ? (
          <p className="subscribe-thanks">
            Thank you for joining! ✦
          </p>
        ) : (
          <form className="subscribe-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="subscribe-input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="subscribe-btn">
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

