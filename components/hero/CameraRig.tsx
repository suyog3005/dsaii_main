"use client"

import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

export default function CameraRig() {
  const { camera } = useThree()

  const lookTarget = useRef(new THREE.Vector3(5, 0, 0))

  useFrame(() => {
    camera.lookAt(lookTarget.current)
  })

  useEffect(() => {
    // Initial state
    camera.position.set(5, 20, 10)
    lookTarget.current.set(5, 0, 0)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
      },
    })

    // 🔥 Single smooth path (Phase1 → Intermediate → Final)
    tl.to(camera.position, {
      motionPath: {
        path: [
          { x: 5,  y: 20, z: 10 },   // start
          { x: 6,  y: 4,  z: 12 },   // phase 1
          { x: 4,  y: 1,  z: 11 },   // curve control (intermediate)
          { x: -2, y: 0,  z: 9.5 },  // final
        ],
        curviness: 1.5,
      },
      ease: "none",
    })

    // 🔥 Look target smooth path
    tl.to(lookTarget.current, {
      motionPath: {
        path: [
          { x: 5, y: 0, z: 0 },
          { x: 3, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
        ],
        curviness: 1.5,
      },
      ease: "none",
    }, "<")

    return () => {
      tl.kill()
    }
  }, [camera])

  return null
}