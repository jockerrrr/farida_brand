import { useNavigate } from 'react-router-dom'
import './AboutUs.css'

const AboutUs = () => {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      <button className="about-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="about-inner">
        {/* Editorial header */}
        <div className="about-header">
          <span className="about-eyebrow">Our Story</span>
          <h1 className="about-title">The Duo</h1>
          <div className="about-divider" />
        </div>

        {/* Body paragraphs */}
        <div className="about-body">
          <p className="about-para">
            The Duo is a brand inspired by connection and thoughtful design.
            We create timeless, refined pieces that celebrate shared moments
            and personal expression. Every collection blends simplicity with
            intention, offering styles that feel meaningful, versatile, and
            made to be worn together.
          </p>
          <p className="about-para about-para--italic">
            At The Duo, fashion is more than what you wear — it&apos;s what you share.
          </p>
        </div>

        {/* Decorative values strip */}
        <div className="about-values">
          <div className="about-value">
            <span className="about-value-title">Connection</span>
          </div>
          <div className="about-value-sep" />
          <div className="about-value">
            <span className="about-value-title">Intention</span>
          </div>
          <div className="about-value-sep" />
          <div className="about-value">
            <span className="about-value-title">Timeless</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs

