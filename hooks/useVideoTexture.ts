// hooks/useVideoTexture.ts
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"

// active is optional — defaults to true so existing callers
// that pass only src keep working with no changes needed
export function useVideoTexture(
  src: string,
  active: boolean = true
): THREE.VideoTexture | null {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // ── Effect 1: create video element + texture once per src ────────────────
  useEffect(() => {
    if (!src) return

    // Clean up previous video if src changes
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ""
      videoRef.current.load()
    }

    const video = document.createElement("video")
    video.src         = src
    video.crossOrigin = "anonymous"
    video.loop        = true
    video.muted       = true
    video.playsInline = true
    video.preload     = "auto"

    videoRef.current = video

    const videoTexture              = new THREE.VideoTexture(video)
    videoTexture.colorSpace         = THREE.SRGBColorSpace
    videoTexture.minFilter          = THREE.LinearFilter
    videoTexture.magFilter          = THREE.LinearFilter

    setTexture(videoTexture)

    return () => {
      video.pause()
      video.src = ""
      video.load()
      videoTexture.dispose()
      videoRef.current = null
      setTexture(null)
    }
  }, [src])

  // ── Effect 2: control playback separately when active changes ────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (active) {
      video.play().catch(() => {
        // Autoplay blocked — will play on next user interaction
      })
    } else {
      video.pause()
    }
  }, [active])

  return texture
}