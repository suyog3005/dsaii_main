"use client"

import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrollToPlugin)

type Props = {
  onUnlockDrag?: (v: boolean) => void
}

// Stop 0 = start (progress 0)
// Stop 1 = mid   (progress 0.55)  ← camera pauses, text changes
// Stop 2 = end   (progress 1)     ← drag unlocked
const STOPS        = [0, 0.55, 1]
const TOTAL_SCROLL = 3000

export default function CameraRig({ onUnlockDrag }: Props) {
  const { camera } = useThree()

  const lookTarget    = useRef(new THREE.Vector3(5, 0, 0))
  const committedStop = useRef(0)   // which stop we are AT (only updates after scroll lands)
  const isNavigating  = useRef(false)
  const stRef         = useRef<ScrollTrigger | null>(null)

  useFrame(() => {
    camera.lookAt(lookTarget.current)
  })

  useEffect(() => {
    const isMobile = window.innerWidth < 768

    // ── Paths (your originals, untouched) ──────────────────────────────────
    const desktopCameraPath = [
      { x: 5,  y: 20, z: 10  },
      { x: 6,  y: 4,  z: 12  },
      { x: 6,  y: 4,  z: 12  },
      { x: 4,  y: 1,  z: 11  },
      { x: -2, y: 0,  z: 9.5 },
    ]
    const desktopLookPath = [
      { x: 5, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]
    const mobileCameraPath = [
      { x: 5, y: 20, z: 10 },
      { x: 0, y: 6,  z: 12 },
      { x: 0, y: 6,  z: 14 },
      { x: 0, y: 2,  z: 15 },
      { x: 0, y: 0,  z: 17 },
    ]
    const mobileLookPath = [
      { x: 5, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]

    const cameraPath = isMobile ? mobileCameraPath : desktopCameraPath
    const lookPath   = isMobile ? mobileLookPath   : desktopLookPath

    camera.position.set(cameraPath[0].x, cameraPath[0].y, cameraPath[0].z)
    lookTarget.current.set(lookPath[0].x, lookPath[0].y, lookPath[0].z)

    // ── Arrow UI ────────────────────────────────────────────────────────────
    function updateArrowStates() {
      const stop  = committedStop.current
      const left  = document.querySelector(".nav-arrow-left")  as HTMLElement | null
      const right = document.querySelector(".nav-arrow-right") as HTMLElement | null
      if (!left || !right) return
      // Dim the button that has nowhere to go; keep pointer-events ALWAYS auto
      left.style.opacity        = stop === 0                  ? "0.25" : "1"
      right.style.opacity       = stop === STOPS.length - 1  ? "0.25" : "1"
      left.style.pointerEvents  = "auto"
      right.style.pointerEvents = "auto"
    }

    // ── Navigate ────────────────────────────────────────────────────────────
    // Uses st.start (the absolute scroll px where the pin begins) so the
    // target pixel is always correct regardless of current scroll position.
    function navigate(direction: 1 | -1) {
      if (isNavigating.current) return

      const next = committedStop.current + direction
      if (next < 0 || next >= STOPS.length) return

      const st = stRef.current
      if (!st) return

      isNavigating.current = true

      // st.start = absolute scroll pixel where ScrollTrigger pin begins
      const targetScroll = st.start + STOPS[next] * TOTAL_SCROLL

      console.log(
        `[CameraRig] navigate direction:${direction} ` +
        `from stop ${committedStop.current} → ${next} | ` +
        `st.start:${st.start} target:${targetScroll}`
      )

      gsap.killTweensOf(window)

      gsap.to(window, {
        scrollTo: { y: targetScroll, autoKill: false },
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          committedStop.current = next
          isNavigating.current  = false
          updateArrowStates()
          console.log(`[CameraRig] arrived at stop ${next}`)
        },
      })
    }

    // ── Timeline ────────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: `+=${TOTAL_SCROLL}`,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          stRef.current = self

          if (onUnlockDrag) onUnlockDrag(self.progress > 0.98)

          // Sync committedStop from free-scroll position (not during programmatic nav)
          if (!isNavigating.current) {
            const prev = committedStop.current
            if      (self.progress < 0.28) committedStop.current = 0
            else if (self.progress < 0.78) committedStop.current = 1
            else                           committedStop.current = 2
            if (committedStop.current !== prev) updateArrowStates()
          }
        },
      },
    })

    // Camera position
    tl.to(camera.position, {
      motionPath: { path: cameraPath, curviness: 1.5 },
      ease: "none",
      duration: 3,
    })

    // LookAt (parallel)
    tl.to(lookTarget.current, {
      motionPath: { path: lookPath, curviness: 1.5 },
      ease: "none",
      duration: 3,
    }, "<")

    // Text transitions (your original timings)
    tl.to(".text-start",  { opacity: 0, duration: 0.6 }, 0.8)
    tl.fromTo(".text-stop",  { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1)
    tl.to(".text-stop",   { opacity: 0, duration: 0.6 }, 2)
    tl.fromTo(".text-end", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.2)

    // ── Buttons (deferred 300ms so React has painted HeroSection) ──────────
    let leftEl:  HTMLElement | null = null
    let rightEl: HTMLElement | null = null

    const onLeft  = () => { console.log("[btn] LEFT"); navigate(-1) }
    const onRight = () => { console.log("[btn] RIGHT"); navigate(+1) }

    const btnTimer = setTimeout(() => {
      leftEl  = document.querySelector<HTMLElement>(".nav-arrow-left")
      rightEl = document.querySelector<HTMLElement>(".nav-arrow-right")
      leftEl?.addEventListener("click",  onLeft)
      rightEl?.addEventListener("click", onRight)
      updateArrowStates()
      console.log("[CameraRig] buttons wired — left:", !!leftEl, "right:", !!rightEl)
    }, 300)

    // ── Keyboard → clicks the DOM buttons so behaviour is identical ────────
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        document.querySelector<HTMLElement>(".nav-arrow-right")?.click()
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        document.querySelector<HTMLElement>(".nav-arrow-left")?.click()
      }
    }
    window.addEventListener("keydown", onKey)

    return () => {
      tl.kill()
      clearTimeout(btnTimer)
      window.removeEventListener("keydown", onKey)
      leftEl?.removeEventListener("click",  onLeft)
      rightEl?.removeEventListener("click", onRight)
    }
  }, [camera, onUnlockDrag])

  return null
}