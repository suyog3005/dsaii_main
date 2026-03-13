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

const STOPS = [0, 0.55, 1]
const TOTAL_SCROLL = 3000

export default function CameraRig({ onUnlockDrag }: Props) {
  const { camera } = useThree()

  const lookTarget = useRef(new THREE.Vector3(5, 0, 0))
  const committedStop = useRef(0)
  const isNavigating = useRef(false)
  const stRef = useRef<ScrollTrigger | null>(null)

  useFrame(() => {
    camera.lookAt(lookTarget.current)
  })

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    console.log("CameraRig mounted. Mobile:", isMobile)

    /* CAMERA PATHS */

    const desktopCameraPath = [
      { x: 5, y: 20, z: 10 },
      { x: 6, y: 4, z: 12 },
      { x: 6, y: 4, z: 12 },
      { x: 4, y: 1, z: 11 },
      { x: -2, y: 0, z: 9.5 },
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
      { x: 0, y: 6, z: 12 },
      { x: 0, y: 6, z: 14 },
      { x: 0, y: 2, z: 15 },
      { x: 0, y: 0, z: 17 },
    ]

    const mobileLookPath = [
      { x: 5, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 3, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]

    const cameraPath = isMobile ? mobileCameraPath : desktopCameraPath
    const lookPath = isMobile ? mobileLookPath : desktopLookPath

    camera.position.set(cameraPath[0].x, cameraPath[0].y, cameraPath[0].z)
    lookTarget.current.set(lookPath[0].x, lookPath[0].y, lookPath[0].z)

    /* UI STATE */

    function updateArrowStates(progress: number) {
      const left = document.querySelector(".nav-arrow-left") as HTMLElement
      const right = document.querySelector(".nav-arrow-right") as HTMLElement

      if (!left || !right) return

      left.style.opacity = progress < 0.05 ? "0.2" : "0.7"
      right.style.opacity = progress > 0.97 ? "0.2" : "0.7"

      left.style.pointerEvents = progress < 0.05 ? "none" : "auto"
      right.style.pointerEvents = progress > 0.97 ? "none" : "auto"
    }

    /* NAVIGATION */

    function navigate(direction: 1 | -1) {
      if (isNavigating.current) return

      const next = committedStop.current + direction

      if (next < 0 || next >= STOPS.length) return

      const hero = document.querySelector(".hero-section") as HTMLElement
      if (!hero) return

      const heroTop = hero.getBoundingClientRect().top + window.scrollY
      const targetScroll = heroTop + STOPS[next] * TOTAL_SCROLL

      console.log("Navigate to stop:", next)

      isNavigating.current = true

      gsap.killTweensOf(window)
      ScrollTrigger.update()

      gsap.to(window, {
        scrollTo: {
          y: targetScroll,
          autoKill: false,
        },
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          committedStop.current = next
          isNavigating.current = false
        },
      })
    }

    /* TIMELINE */

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

          /* detect closest stop */

          if (!isNavigating.current) {
            let closest = 0
            let minDist = Infinity

            STOPS.forEach((s, i) => {
              const d = Math.abs(self.progress - s)
              if (d < minDist) {
                minDist = d
                closest = i
              }
            })

            committedStop.current = closest
          }

          updateArrowStates(self.progress)
        },
      },
    })

    tl.to(camera.position, {
      motionPath: {
        path: cameraPath,
        curviness: 1.5,
      },
      ease: "none",
      duration: 3,
    })

    tl.to(
      lookTarget.current,
      {
        motionPath: {
          path: lookPath,
          curviness: 1.5,
        },
        ease: "none",
        duration: 3,
      },
      "<"
    )

    /* TEXT */

    tl.to(".text-start", { opacity: 0, duration: 0.6 }, 0.8)

    tl.fromTo(
      ".text-stop",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      1
    )

    tl.to(".text-stop", { opacity: 0, duration: 0.6 }, 2)

    tl.fromTo(
      ".text-end",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      2.2
    )

    /* BUTTONS */

    const onLeft = () => navigate(-1)
    const onRight = () => navigate(1)

    const timer = setTimeout(() => {
      const left = document.querySelector(".nav-arrow-left")
      const right = document.querySelector(".nav-arrow-right")

      left?.addEventListener("click", onLeft)
      right?.addEventListener("click", onRight)

      updateArrowStates(0)
    }, 100)

    /* KEYBOARD */

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        navigate(1)
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        navigate(-1)
      }
    }

    window.addEventListener("keydown", onKey)

    return () => {
      tl.kill()
      clearTimeout(timer)
      window.removeEventListener("keydown", onKey)

      const left = document.querySelector(".nav-arrow-left")
      const right = document.querySelector(".nav-arrow-right")

      left?.removeEventListener("click", onLeft)
      right?.removeEventListener("click", onRight)
    }
  }, [camera, onUnlockDrag])

  return null
}