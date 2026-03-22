// hooks/useVideoTexture.ts
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"

export function useVideoTexture(
  src:      string,
  active:   boolean   = true,
  onReady?: () => void
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const videoRef    = useRef<HTMLVideoElement | null>(null)
  const readyFired  = useRef(false)

  // Keep onReady in a ref — so it never causes the effect to re-run
  const onReadyRef = useRef(onReady)
  useEffect(() => { onReadyRef.current = onReady }, [onReady])

  // Effect 1: create video + texture when src changes
  useEffect(() => {
    if (!src) return

    // Clean up previous
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.src = ""
      videoRef.current.load()
    }
    readyFired.current = false

    const lowerSrc = src.toLowerCase()
    const isImageSource = /\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/.test(lowerSrc)

    if (isImageSource) {
      const loader = new THREE.TextureLoader()
      loader.load(
        src,
        (loadedTexture) => {
          loadedTexture.colorSpace = THREE.SRGBColorSpace
          loadedTexture.minFilter = THREE.LinearFilter
          loadedTexture.magFilter = THREE.LinearFilter
          loadedTexture.generateMipmaps = false
          setTexture(loadedTexture)
          if (!readyFired.current) {
            readyFired.current = true
            onReadyRef.current?.()
          }
        },
        undefined,
        () => {
          if (!readyFired.current) {
            readyFired.current = true
            onReadyRef.current?.()
          }
        }
      )

      return () => {
        setTexture(prev => { prev?.dispose(); return null })
      }
    }

    const video          = document.createElement("video")
    video.crossOrigin    = "anonymous"
    video.loop           = true
    video.muted          = true
    video.playsInline    = true
    // Use "metadata" instead of "none" — browser fetches just enough
    // to fire canplay without downloading the whole file.
    // This triggers the chain without needing play() to be called first.
    video.preload        = "auto"    // full buffer — no double-fetch on play()

    // loadeddata fires when first frame is decoded and ready to display
    // canplay fires too early (just metadata) — video may still be black
    video.addEventListener("loadeddata", () => {
      if (!readyFired.current) {
        readyFired.current = true
        // Pause immediately — we just needed canplay to fire for the chain
        video.pause()
        onReadyRef.current?.()
      }
    }, { once: true })

    // load() starts the fetch immediately
    video.src = src
    video.load()

    videoRef.current = video

    const tex           = new THREE.VideoTexture(video)
    tex.colorSpace      = THREE.SRGBColorSpace
    tex.minFilter       = THREE.LinearFilter
    tex.magFilter       = THREE.LinearFilter
    tex.generateMipmaps = false

    setTexture(tex)

    return () => {
      video.pause()
      video.src = ""
      video.load()
      videoRef.current = null
      setTexture(prev => { prev?.dispose(); return null })
    }
  }, [src])

  // Effect 2: play / pause based on active prop
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) video.play().catch(() => {})
    else        video.pause()
  }, [active])

  return texture
}