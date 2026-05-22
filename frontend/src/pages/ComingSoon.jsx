import { useEffect, useRef } from 'react';
import './ComingSoon.css';

const CLOUDINARY_VIDEO_URL = 'https://res.cloudinary.com/dmkci0uiw/video/upload/vc_h264,ac_none,f_mp4,q_auto:low,w_1080/v1779411856/IMG_0838_g8kzs9.mp4';
export default function ComingSoon() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="coming-soon-wrapper">
      <video
        ref={videoRef}
        className="coming-soon-video"
        src={CLOUDINARY_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="coming-soon-overlay" />

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