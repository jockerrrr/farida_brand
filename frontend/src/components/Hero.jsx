import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">

      {/* Campaign label */}
      <p className="hero-label">SEASONAL CAMPAIGN</p>

      {/* Title with decorative lines */}
      <h1 className="hero-title">
        <span className="hero-line" />
        Soft duo collection
        <span className="hero-line" />
      </h1>

      {/* Italic tagline */}
      <p className="hero-tagline">Made by two, Worn by many</p>

      {/* Season badge */}
      <p className="hero-season-badge">NEW SEASON</p>

      {/* CTA */}
      <a href="#new-arrivals" className="hero-cta">
        Shop the Collection
      </a>

    </section>
  )
}

