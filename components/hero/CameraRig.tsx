"use client"

import { useFrame, useThree } from "@react-three/fiber"
import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    camera.lookAt(0, 0, 0)
  } )

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=2500",
        scrub: true,
        pin: true,

      },
    })

    tl.to(camera.position, {
      y: 4,
      z: 17,
      ease: "none",
    })

    tl.to(camera.position, {
    y: 1,
    z: 12,
    ease: "none",
  })


    return () => {
      tl.kill()
    }
  }, [camera])

  return null
}