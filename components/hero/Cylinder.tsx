"use client"

import * as THREE from "three"
import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useVideoTexture } from "../../hooks/useVideoTexture"
import { useDrag } from "../../hooks/useDrag"
import { VIDEO_SOURCES } from "@/lib/videoConfig"

// ── Panel content — one entry per video ──────────────────────────────────────
// These are the overlay texts that appear when each panel faces the camera.
export const PANEL_CONTENT = [
  {
    title: "Tackling Online Education",
    description:
      "A virtual Open Days event featuring 12 academic islands built for the digital generation.",
    cta: "SDU Open Days",
    accent: "#F59E0B", // amber
  },
  {
    title: "Legendary Music Festival",
    description:
      "Building a new kind of immersive experience for Tomorrowland — where the stage is everywhere.",
    cta: "Tomorrowland Festival",
    accent: "#10B981", // green
  },
  {
    title: "Future of Work Summit",
    description:
      "An always-on virtual venue for the world's leading voices on technology and the future of work.",
    cta: "Explore Summit",
    accent: "#8B5CF6", // purple
  },
  {
    title: "Digital Fashion Week",
    description:
      "Reimagining the runway as a spatial experience — collections you can walk through, not just watch.",
    cta: "View Collections",
    accent: "#EC4899", // pink
  },
  {
    title: "Global Climate Forum",
    description:
      "An interactive world map connecting activists, scientists and policy makers in real time.",
    cta: "Join the Forum",
    accent: "#3B82F6", // blue
  },
]

type Props = {
  dragEnabled: boolean
  // Callback fired when the frontmost panel changes (index 0–4)
  onActivePanelChange?: (index: number) => void
}

export default function Cylinder({ dragEnabled, onActivePanelChange }: Props) {
  const groupRef    = useRef<THREE.Group>(null!)
  const rotationRef = useRef(0)
  const lastActive  = useRef(-1)

  const radius   = 5
  const height   = 3
  const segments = 64
  const videoArc = 1.2366
  const gapArc   = 0.023

  // ── Video textures from Appwrite blob URLs ───────────────────────────────
  const tex0 = useVideoTexture(VIDEO_SOURCES[0] ?? "")
  const tex1 = useVideoTexture(VIDEO_SOURCES[1] ?? "")
  const tex2 = useVideoTexture(VIDEO_SOURCES[2] ?? "")
  const tex3 = useVideoTexture(VIDEO_SOURCES[3] ?? "")
  const tex4 = useVideoTexture(VIDEO_SOURCES[4] ?? "")
  const textures = [tex0, tex1, tex2, tex3, tex4]

  // ── Drag ─────────────────────────────────────────────────────────────────
  useDrag({
    enabled: dragEnabled,
    sensitivity: 0.005,
    damping: 0.92,
    onVelocity: (v) => { rotationRef.current += v },
    onDrag:     (d) => { rotationRef.current += d },
  })

  // ── Pre-compute panel start angles ───────────────────────────────────────
  const panelAngles: number[] = []
  let angle = 0
  for (let i = 0; i < 5; i++) {
    panelAngles.push(angle + videoArc / 2) // centre of each panel
    angle += videoArc + gapArc
  }

  // ── Per-frame: rotate + detect frontmost panel ───────────────────────────
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = rotationRef.current

    if (!dragEnabled || !onActivePanelChange) return

    // Camera faces +Z. The front of the cylinder is where rotation brings
    // a panel to face angle ≈ 0 (or 2π). We find which panel's centre
    // angle, after subtracting the current rotation, is closest to 0 mod 2π.
    const TWO_PI = Math.PI * 2
    let   bestIdx  = 0
    let   bestDist = Infinity

    panelAngles.forEach((a, i) => {
      // effective angle the panel currently faces
      let effective = ((a + rotationRef.current) % TWO_PI + TWO_PI) % TWO_PI
      // distance from "front" (0 / 2π)
      const dist = Math.min(effective, TWO_PI - effective)
      if (dist < bestDist) { bestDist = dist; bestIdx = i }
    })

    if (bestIdx !== lastActive.current) {
      lastActive.current = bestIdx
      onActivePanelChange(bestIdx)
    }
  })

  // ── Build geometry ───────────────────────────────────────────────────────
  const panels: { videoStart: number; gapStart: number }[] = []
  let currentAngle = 0
  for (let i = 0; i < 5; i++) {
    panels.push({ videoStart: currentAngle, gapStart: currentAngle + videoArc })
    currentAngle += videoArc + gapArc
  }

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <group key={i}>
          {/* Video slice — only renders once blob URL is ready */}
          {textures[i] ? (
            <mesh>
              <cylinderGeometry
                args={[radius, radius, height, segments, 1, true, p.videoStart, videoArc]}
              />
              <meshBasicMaterial
                map={textures[i]!}
                side={THREE.DoubleSide}
                toneMapped={false}
              />
            </mesh>
          ) : null}

          {/* Black gap */}
          <mesh>
            <cylinderGeometry
              args={[radius, radius, height, segments, 1, true, p.gapStart, gapArc]}
            />
            <meshBasicMaterial color="black" side={THREE.FrontSide} />
          </mesh>
        </group>
      ))}

      {/* Inner glass layer */}
      <mesh>
        <cylinderGeometry
          args={[radius - 0.01, radius - 0.01, height, segments, 1, true]}
        />
        <meshStandardMaterial
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