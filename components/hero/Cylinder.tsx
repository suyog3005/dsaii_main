"use client"

import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useVideoTexture } from "../../hooks/useVideoTexture"

type Props = {
  dragEnabled: boolean
}

export default function Cylinder({ dragEnabled }: Props) {
  const groupRef = useRef<THREE.Group>(null!)

  const radius = 5
  const height = 3
  const segments = 128

  const videoArc = 1.066
  const gapArc = 0.505

  const textures = [
    useVideoTexture("/videos/v1.mp4"),
    useVideoTexture("/videos/v2.mp4"),
    useVideoTexture("/videos/v3.mp4"),
    useVideoTexture("/videos/v4.mp4"),
  ]

  // 🔥 Drag state
  const isDragging = useRef(false)
  const previousX = useRef(0)
  const velocity = useRef(0)

  const sensitivity = 0.05
  const damping = 0.94

  const onPointerDown = (e: any) => {
    if (!dragEnabled) return
    isDragging.current = true
    previousX.current = e.clientX
  }

  const onPointerUp = () => {
    isDragging.current = false
  }

  const onPointerMove = (e: any) => {
    if (!dragEnabled || !isDragging.current) return

    const delta = e.clientX - previousX.current
    previousX.current = e.clientX

    velocity.current = delta * sensitivity
  }

  // 🔥 Smooth inertia rotation
  useFrame(() => {
    if (!groupRef.current) return

    groupRef.current.rotation.y += velocity.current
    velocity.current *= damping
  })

  let currentAngle = 0

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
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
                args={[
                  radius,
                  radius,
                  height,
                  segments,
                  1,
                  true,
                  videoStart,
                  videoArc
                ]}
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
                args={[
                  radius,
                  radius,
                  height,
                  segments,
                  1,
                  true,
                  gapStart,
                  gapArc
                ]}
              />
              <meshBasicMaterial
                color="black"
                side={THREE.FrontSide}
              />
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