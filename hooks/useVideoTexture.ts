// hooks/useVideoTexture.ts
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"

export function useVideoTexture(
  src: string,
  active: boolean = true
): THREE.VideoTexture | null {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // ── Effect 1: create video element + texture once per src ─────────────────
  useEffect(() => {
    if (!src) return

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ""
      videoRef.current.load()
    }

    const video          = document.createElement("video")
    video.src            = src
    video.crossOrigin    = "anonymous"
    video.loop           = true
    video.muted          = true
    video.playsInline    = true
    video.preload        = "none"   // ← no preload at all — loads on play()

    videoRef.current = video

    const tex              = new THREE.VideoTexture(video)
    tex.colorSpace         = THREE.SRGBColorSpace
    tex.minFilter          = THREE.LinearFilter
    tex.magFilter          = THREE.LinearFilter
    tex.generateMipmaps    = false   // saves GPU memory on a per-frame texture

    setTexture(tex)

    return () => {
      video.pause()
      video.src = ""
      video.load()
      tex.dispose()
      videoRef.current = null
      setTexture(null)
    }
  }, [src])

  // ── Effect 2: play / pause independently of src changes ──────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active])

  return texture
}