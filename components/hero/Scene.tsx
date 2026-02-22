"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useHelper} from "@react-three/drei"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import Cylinder from "./Cylinder"
import CameraRig from "./CameraRig"  // temporarily disable

function Lights() {
  const lightRef1 = useRef<THREE.SpotLight>(null!) //
  const lightRef2 = useRef<THREE.SpotLight>(null!)
  const lightRef3 = useRef<THREE.SpotLight>(null!)

  const target1 = useRef<THREE.Object3D>(null!)
  const target2 = useRef<THREE.Object3D>(null!)
  const target3 = useRef<THREE.Object3D>(null!)

  // //Spotlight cone visible (debug helper) 
  useHelper(lightRef1, THREE.SpotLightHelper, "cyan") 
  useHelper(lightRef2, THREE.SpotLightHelper, "cyan") 
  useHelper(lightRef3, THREE.SpotLightHelper, "yellow")

  useEffect(() => {
    if (lightRef1.current && target1.current) {
      lightRef1.current.target = target1.current
    }
    if (lightRef2.current && target2.current) {
      lightRef2.current.target = target2.current
    }
    if (lightRef3.current && target3.current) {
      lightRef3.current.target = target3.current
    }
  }, [])

  return (
    <>
      <ambientLight intensity={0.2} />

      <directionalLight 
        position={[-10, 30, -5]} 
        intensity={0.05} 
      />

      {/* Top Spotlight */}
      <spotLight
        ref={lightRef1}
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.6}
        intensity={80}
        distance={60}
        decay={2}
        castShadow
      />
      <object3D ref={target1} position={[0, 0, 0]} />

      {/* Side Spotlight  position={[5, 15, 6]} */}
      <spotLight
        ref={lightRef2}
        position={[5, 15, 6]}
        angle={0.7}
        penumbra={0.4}
        intensity={150}
        distance={60}
        decay={2}
        castShadow
      />
      <object3D ref={target2} position={[0, 0, 0]} />

      {/* top right plane Spotlight */}
      <spotLight
        ref={lightRef3}
        position={[26, 8, -10]}
        angle={1.1}
        penumbra={0.5}
        intensity={90}
        distance={80}
        decay={2}
        castShadow
      />
      <object3D ref={target3} position={[26, 0, -10]} /> 
    </>
  )
}



function InitialCameraArrow() {
  const { scene } = useThree()

  useEffect(() => {
    const start = new THREE.Vector3(5, 20, 10)
    const target = new THREE.Vector3(5, 0, 0)

    const direction = new THREE.Vector3()
      .subVectors(target, start)
      .normalize()

    const length = 10
    const color = 0xff0000

    const arrow = new THREE.ArrowHelper(direction, start, length, color)

    scene.add(arrow)

    return () => {
      scene.remove(arrow)
    }
  }, [scene])

  return null
}


export default function Scene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [10, 15, 25], fov: 45 }}  // free cam start
      >
        <Lights />

        <OrbitControls />
        <axesHelper args={[40]} /> 
        <InitialCameraArrow />

        {/* <CameraRig /> 🔴 temporarily disable */}

        {/* Back curved wall */}
        <mesh position={[0, 0, -10]}>
          <cylinderGeometry args={[40, 40, 50, 64, 1, true]} />
          <meshStandardMaterial
            color="#623B68"
            roughness={0.6}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Floor */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.55, 0]}
        >
          <planeGeometry args={[150, 150]} />
          <meshStandardMaterial
            color="#BD97C3"
            roughness={0.8}
            metalness={0.6}
          />
        </mesh>

        {/* Main Cylinder */}
        <Cylinder />
      </Canvas>
    </div>
  )
}