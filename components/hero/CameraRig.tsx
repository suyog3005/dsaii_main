"use client"

import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

type Props = {
  onUnlockDrag?: (v: boolean) => void
}

export default function CameraRig({ onUnlockDrag }: Props) {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(5, 0, 0))

  useFrame(() => {
    camera.lookAt(lookTarget.current)
  })

  useEffect(() => {
    camera.position.set(5, 20, 10)
    lookTarget.current.set(5, 0, 0)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,

        // 🔥 important part
        onUpdate: (self) => {
          if (!onUnlockDrag) return

          if (self.progress > 0.98) {
            onUnlockDrag(true)
          } else {
            onUnlockDrag(false)
          }
        },
      },
    })

    tl.to(camera.position, {
      motionPath: {
        path: [
          { x: 5, y: 20, z: 10 },
          { x: 6, y: 4, z: 12 },  // stop
          { x: 6, y: 4, z: 12 },
          { x: 4, y: 1, z: 11 },
          { x: -2, y: 0, z: 9.5 },
        ],
        curviness: 1.5,
      },
      ease: "none",
      duration: 3,
    })

    tl.to(
      lookTarget.current,
      {
        motionPath: {
          path: [
            { x: 5, y: 0, z: 0 },
            { x: 3, y: 0, z: 0 },
            { x: 3, y: 0, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
          ],
          curviness: 1.5,
        },
        ease: "none",
        duration: 3,
      },
      "<"
    )

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

    return () => {
      tl.kill()
    }
  }, [camera, onUnlockDrag])

  return null
}