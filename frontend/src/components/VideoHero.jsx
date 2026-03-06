import './VideoHero.css'

export default function VideoHero() {
  return (
    <div className="video-hero">
      <video
        className="video-hero__video"
        src="https://res.cloudinary.com/dmkci0uiw/video/upload/v1772776697/sets_video_slppb0.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}

