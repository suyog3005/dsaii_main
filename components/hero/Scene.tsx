"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, useHelper } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { MeshReflectorMaterial } from "@react-three/drei"
import Cylinder, { PANEL_CONTENT } from "./Cylinder"
import CameraRig from "./CameraRig"
import { useVideoTexture } from "../../hooks/useVideoTexture"

// ── Lights (original, untouched) ────────────────────────────────────────────
function Lights() {
  const lightRef1 = useRef<THREE.SpotLight>(null!)
  const lightRef2 = useRef<THREE.SpotLight>(null!)
  const lightRef3 = useRef<THREE.SpotLight>(null!)
  const lightRef4 = useRef<THREE.SpotLight>(null!)

  const target1 = useRef<THREE.Object3D>(null!)
  const target2 = useRef<THREE.Object3D>(null!)
  const target3 = useRef<THREE.Object3D>(null!)
  const target4 = useRef<THREE.Object3D>(null!)

  // Spotlight cone visible (debug helper)
  // useHelper(lightRef1, THREE.SpotLightHelper, "cyan")
  // useHelper(lightRef2, THREE.SpotLightHelper, "cyan")
  // useHelper(lightRef3, THREE.SpotLightHelper, "yellow")
  // useHelper(lightRef4, THREE.SpotLightHelper, "green")

  useEffect(() => {
    if (lightRef1.current && target1.current) {
      lightRef1.current.target = target1.current
      target1.current.updateMatrixWorld()
    }
    if (lightRef2.current && target2.current) {
      lightRef2.current.target = target2.current
      target2.current.updateMatrixWorld()
    }
    if (lightRef3.current && target3.current) {
      lightRef3.current.target = target3.current
      target3.current.updateMatrixWorld()
    }
    if (lightRef4.current && target4.current) {
      lightRef4.current.target = target4.current
      target4.current.updateMatrixWorld()
    }
  }, [])

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[-10, 30, -5]} intensity={0.15} />

      {/* Top Spotlight */}
      <spotLight
        ref={lightRef1}
        position={[0, 8, 0]}
        angle={0.6}
        penumbra={0.6}
        intensity={90}
        distance={60}
        decay={2}
        castShadow
        shadow-radius={8}
      />
      <object3D ref={target1} position={[0, 0, 0]} />

      {/* Side Spotlight */}
      <spotLight
        ref={lightRef2}
        position={[5, 15, 6]}
        angle={0.7}
        penumbra={0.4}
        intensity={150}
        distance={60}
        decay={2}
        castShadow
        shadow-radius={8}
      />
      <object3D ref={target2} position={[0, 0, 0]} />

      {/* Top right plane Spotlight */}
      <spotLight
        ref={lightRef3}
        position={[27, 8, -12]}
        angle={1.2}
        penumbra={0.5}
        intensity={90}
        distance={80}
        decay={2}
        castShadow
      />
      <object3D ref={target3} position={[27, 0, -12]} />

      {/* Top left plane Spotlight */}
      <spotLight
        ref={lightRef4}
        position={[-24, 6, -12]}
        angle={1.2}
        penumbra={0.5}
        intensity={50}
        distance={80}
        decay={2}
        castShadow
      />
      <object3D ref={target4} position={[-24, 0, -12]} />
    </>
  )
}

// ── Debug helper: single video plane (original) ─────────────────────────────
function VideoTest() {
  const tex = useVideoTexture("/videos/v1.mp4")
  if (!tex) return null
  return (
    <mesh position={[0, 5, 0]}>
      <planeGeometry args={[10, 6]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}

// ── Debug helper: camera direction arrow (original) ─────────────────────────
function InitialCameraArrow() {
  const { scene } = useThree()
  useEffect(() => {
    const start     = new THREE.Vector3(5, 20, 10)
    const target    = new THREE.Vector3(5, 0, 0)
    const direction = new THREE.Vector3().subVectors(target, start).normalize()
    const arrow     = new THREE.ArrowHelper(direction, start, 10, 0xff0000)
    scene.add(arrow)
    return () => { scene.remove(arrow) }
  }, [scene])
  return null
}

// ── Debug helper: flat video panels (original) ──────────────────────────────
function VideoPanels() {
  const radius    = 5
  const height    = 6
  const total     = 4
  const angleStep = (Math.PI * 2) / total

  const textures = [
    useVideoTexture("/videos/v1.mp4"),
    useVideoTexture("/videos/v2.mp4"),
    useVideoTexture("/videos/v3.mp4"),
    useVideoTexture("/videos/v4.mp4"),
  ]

  return (
    <>
      {textures.map((tex, i) => {
        if (!tex) return null
        const angle = i * angleStep
        const x     = Math.sin(angle) * radius
        const z     = Math.cos(angle) * radius
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <planeGeometry args={[4, height, 32, 1]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
        )
      })}
    </>
  )
}

// ── Dynamic overlay — changes with active cylinder panel ────────────────────
type OverlayProps = {
  activePanel: number
  visible: boolean
}

function PanelOverlay({ activePanel, visible }: OverlayProps) {
  const panel = PANEL_CONTENT[activePanel] ?? PANEL_CONTENT[0]

  return (
    <div
      className={`
        text-end absolute transition-opacity duration-500
        md:left-10 md:bottom-[14%] md:w-[38%]
        left-0 bottom-[10%] w-full px-6
        ${visible ? "opacity-100" : "opacity-0"}
      `}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <p
        className="text-white font-bold leading-[1.05] mb-5"
        style={{ fontSize: "clamp(1.5rem, 4vw, 3.4rem)" }}
      >
        {panel.title}
      </p>
      <p className="text-white/70 font-light leading-relaxed mb-5 text-[0.9rem] md:text-[1rem]">
        {panel.description}
      </p>
      <div className="w-10 h-[2px] mb-4" style={{ background: panel.accent }} />
      <div className="flex items-center gap-3">
        <span
          className="tracking-wide text-[0.8rem] md:text-[0.9rem] font-light"
          style={{ color: panel.accent }}
        >
          {panel.cta}
        </span>
        <span style={{ color: panel.accent }}>→</span>
      </div>
    </div>
  )
}

// ── Scene ────────────────────────────────────────────────────────────────────
type SceneProps = {
  videoUrls?: string[]
  videosReady?: boolean
}

export default function Scene({ videoUrls = [], videosReady = false }: SceneProps) {
  const [dragEnabled, setDragEnabled] = useState(false)
  const [activePanel, setActivePanel] = useState(0)

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          1.5
        )}
        camera={{ position: [10, 15, 25], fov: isMobile ? 55 : 45 }}
      >
        <Lights />

        {/* <OrbitControls /> */}
        {/* <axesHelper args={[40]} /> */}
        {/* <InitialCameraArrow /> */}
        {/* <VideoTest /> */}
        {/* <VideoPanels /> */}

        <CameraRig onUnlockDrag={setDragEnabled} />

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
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
          <planeGeometry args={[150, 150]} />
          {isMobile ? (
            <meshStandardMaterial
              color="#B37CCB"
              roughness={0.8}
              metalness={0.5}
            />
          ) : (
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={0.7}
              mixStrength={3}
              roughness={0.7}
              metalness={0.5}
              color="#B37CCB"
            />
          )}
        </mesh>

        {/* Main Cylinder */}
        <Cylinder
          dragEnabled={dragEnabled}
          onActivePanelChange={setActivePanel}
        />
      </Canvas>

      {/* Panel overlay — visible only at scroll end (drag stage) */}
      <PanelOverlay activePanel={activePanel} visible={dragEnabled} />
    </div>
  )
}