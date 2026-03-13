"use client"

import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useVideoTexture } from "../../hooks/useVideoTexture"
import { useDrag } from "../../hooks/useDrag"

type Props = {
  dragEnabled: boolean
}

export default function Cylinder({ dragEnabled }: Props) {
  const groupRef = useRef<THREE.Group>(null!)
  const rotationRef = useRef(0)

  const radius = 5
  const height = 3
  const segments = 128

  const videoArc = 1.2366
  const gapArc = 0.023

  const textures = [
    useVideoTexture("/videos/v1.mp4"),
    useVideoTexture("/videos/v2.mp4"),
    useVideoTexture("/videos/v3.mp4"),
    useVideoTexture("/videos/v4.mp4"),
    useVideoTexture("/videos/v5.mp4"),

  ]

  // Global drag hook — works even when pointer leaves canvas
  const { velocityRef } = useDrag({
    enabled: dragEnabled,
    sensitivity: 0.005,
    damping: 0.92,
    onVelocity: (v) => {
      // inertia loop feeds into rotationRef
      rotationRef.current += v
    },
    onDrag: (delta) => {
      // live drag feeds directly into rotationRef
      rotationRef.current += delta
    },
  })

  // Apply rotation from rotationRef each frame (smooth, no jitter)
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = rotationRef.current
  })

  let currentAngle = 0

  return (
    <group ref={groupRef}>
      {textures.map((tex, i) => {
        if (!tex) return null

        const videoStart = currentAngle
        currentAngle += videoArc

        const gapStart = currentAngle
        currentAngle += gapArc

        return (
          <group key={i}>
            {/* Video Slice */}
            <mesh>
              <cylinderGeometry
                args={[radius, radius, height, segments, 1, true, videoStart, videoArc]}
              />
              <meshBasicMaterial
                map={tex}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>

            {/* Black Gap */}
            <mesh>
              <cylinderGeometry
                args={[radius, radius, height, segments, 1, true, gapStart, gapArc]}
              />
              <meshBasicMaterial color="black" side={THREE.FrontSide} />
            </mesh>
          </group>
        )
      })}

      {/* Inner Glass Layer */}
      <mesh>
        <cylinderGeometry
          args={[radius - 0.01, radius - 0.01, height, segments, 1, true]}
        />
        <meshPhysicalMaterial
          color="black"
          transparent
          opacity={0.6}
          roughness={0.4}
          metalness={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}