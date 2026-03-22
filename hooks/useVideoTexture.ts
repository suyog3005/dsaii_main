// hooks/useVideoTexture.ts
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"

export function useVideoTexture(
  src:          string,
  active:       boolean   = true,
  onReady?:     () => void,
  fallbackSrc?: string
): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const videoRef      = useRef<HTMLVideoElement | null>(null)
  const readyFired    = useRef(false)
  const videoLoaded   = useRef(false)

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
    readyFired.current  = false
    videoLoaded.current = false

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

    // ── Fallback image: show immediately while video loads ──────────────
    if (fallbackSrc) {
      const loader = new THREE.TextureLoader()
      loader.load(fallbackSrc, (fallbackTex) => {
        // Only use fallback if video hasn't already loaded
        if (!videoLoaded.current) {
          fallbackTex.colorSpace      = THREE.SRGBColorSpace
          fallbackTex.minFilter       = THREE.LinearFilter
          fallbackTex.magFilter       = THREE.LinearFilter
          fallbackTex.generateMipmaps = false
          setTexture(fallbackTex)
        } else {
          fallbackTex.dispose()
        }
        if (!readyFired.current) {
          readyFired.current = true
          onReadyRef.current?.()
        }
      })
    }

    // ── Video element ──────────────────────────────────────────────────
    const video          = document.createElement("video")
    video.crossOrigin    = "anonymous"
    video.loop           = true
    video.muted          = true
    video.playsInline    = true
    video.preload        = "auto"

    video.addEventListener("loadeddata", () => {
      videoLoaded.current = true

      if (fallbackSrc) {
        // Swap fallback image for the real video texture
        const tex           = new THREE.VideoTexture(video)
        tex.colorSpace      = THREE.SRGBColorSpace
        tex.minFilter       = THREE.LinearFilter
        tex.magFilter       = THREE.LinearFilter
        tex.generateMipmaps = false
        setTexture(prev => { prev?.dispose(); return tex })
      }

      if (!readyFired.current) {
        readyFired.current = true
        video.pause()
        onReadyRef.current?.()
      }
    }, { once: true })

    video.src = src
    video.load()
    videoRef.current = video

    // If no fallback, create video texture immediately (original behaviour)
    if (!fallbackSrc) {
      const tex           = new THREE.VideoTexture(video)
      tex.colorSpace      = THREE.SRGBColorSpace
      tex.minFilter       = THREE.LinearFilter
      tex.magFilter       = THREE.LinearFilter
      tex.generateMipmaps = false
      setTexture(tex)
    }

    return () => {
      video.pause()
      video.src = ""
      video.load()
      videoRef.current = null
      setTexture(prev => { prev?.dispose(); return null })
    }
  }, [src, fallbackSrc])

  // Effect 2: play / pause based on active prop
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) video.play().catch(() => {})
    else        video.pause()
  }, [active])

  return texture
}