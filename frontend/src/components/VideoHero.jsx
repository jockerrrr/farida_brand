import './VideoHero.css'
import { useEffect, useRef } from 'react'

export default function VideoHero() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.play().catch(() => {})
    }
  }, [])
  return (
    <div className="video-hero">
      <video
        className="video-hero__video"
        src="https://res.cloudinary.com/dmkci0uiw/video/upload/v1779415503/IMG_0838_t4ngml.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}

