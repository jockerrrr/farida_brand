import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      {/* Social */}
      <div className="footer-social">
        <a
          href="https://instagram.com"
          className="footer-social-link"
          aria-label="Instagram"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
      </div>

      {/* Brand + year */}
      <p className="footer-copy">
        <em>the Duo</em> · 2026
      </p>
    </footer>
  )
}

