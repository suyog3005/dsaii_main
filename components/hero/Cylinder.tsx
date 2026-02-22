"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Cylinder() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.000
    }
  })

  return (
    <mesh 
    castShadow receiveShadow
    ref={meshRef}>
      <cylinderGeometry args={[5, 5, 3, 64, 1, true]} />
      <meshPhysicalMaterial
        color="#A9A9A9"
        roughness={0.7}
        metalness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}