import './VideoHero.css'

export default function VideoHero() {
  return (
    <div className="video-hero">
      <video
        className="video-hero__video"
        src="/sets-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}

