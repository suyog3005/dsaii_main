"use client"

import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import Cylinder from "./Cylinder"
import CameraRig from "./CameraRig"

export default function Scene() {
  return (
    <div className="absolute inset-0">
      <Canvas shadows

        camera={{ position: [12, 20, 10], fov: 40 }}
        gl={{ antialias: true }}
      >

        
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight
          castShadow
          position={[0, 20, 0]}
          intensity={1.5}
        />

         <CameraRig />

         <mesh position={[0, 0, -10]}>
         <cylinderGeometry args={[40, 40, 50, 64, 1, true]} />
          <meshStandardMaterial color="#D3D3D3" side={THREE.BackSide} />
          </mesh>

         <mesh 
         receiveShadow
         rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
          <planeGeometry args={[150, 150]} />
          <meshStandardMaterial color="#D3D3D3" />
        </mesh>


        {/* Main Object */}
        <Cylinder />
      </Canvas>
    </div>
  )
}