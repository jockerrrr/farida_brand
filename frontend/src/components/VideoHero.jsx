import './VideoHero.css'

export default function VideoHero() {
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

