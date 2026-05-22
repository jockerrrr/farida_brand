import  './ComingSoon.css';

const CLOUDINARY_VIDEO_URL = 'https://res.cloudinary.com/dmkci0uiw/video/upload/v1779411856/IMG_0838_g8kzs9.mov';

export default function ComingSoon() {
  return (
    <div className="coming-soon-wrapper">
      {/* Background Video */}
      <video
        className="coming-soon-video"
        src={CLOUDINARY_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark Overlay */}
      <div className="coming-soon-overlay" />

      {/* Content */}
      <div className="coming-soon-content">
        <p className="coming-soon-eyebrow">New Collection</p>

        <h1 className="coming-soon-title">
          Duo<span className="coming-soon-colon">:</span> Effortless Ease
        </h1>

        <div className="coming-soon-divider" />

        <p className="coming-soon-body">
          Stay tuned — our newest collection is almost here.
        </p>

        <p className="coming-soon-cta">Coming Soon</p>
      </div>
    </div>
  );
}