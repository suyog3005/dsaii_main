import * as THREE from "three"
import { useEffect, useState } from "react"

export function useVideoTexture(src: string) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null)

  useEffect(() => {
    const video = document.createElement("video")
    video.src = src
    video.crossOrigin = "anonymous"
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    video.play()

    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.colorSpace = THREE.SRGBColorSpace
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter

    setTexture(videoTexture)

    return () => {
      video.pause()
      video.remove()
    }
  }, [src])

  return texture
}