"use client"

import * as THREE from "three"
import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useVideoTexture } from "../../hooks/useVideoTexture"
import { useDrag } from "../../hooks/useDrag"
import { VIDEO_SOURCES } from "@/lib/videoConfig"
import { scrollVelocity } from "@/lib/scrollVelocity"

// ── Panel content ─────────────────────────────────────────────────────────────
export const PANEL_CONTENT = [
  {
    title: "Tackling Online Education",
    description:
      "A virtual Open Days event featuring 12 academic islands built for the digital generation.",
    cta: "SDU Open Days",
    accent: "#F59E0B",
  },
  {
    title: "Legendary Music Festival",
    description:
      "Building a new kind of immersive experience for Tomorrowland — where the stage is everywhere.",
    cta: "Tomorrowland Festival",
    accent: "#10B981",
  },
  {
    title: "Future of Work Summit",
    description:
      "An always-on virtual venue for the world's leading voices on technology and the future of work.",
    cta: "Explore Summit",
    accent: "#8B5CF6",
  },
  {
    title: "Digital Fashion Week",
    description:
      "Reimagining the runway as a spatial experience — collections you can walk through, not just watch.",
    cta: "View Collections",
    accent: "#EC4899",
  },
  {
    title: "Global Climate Forum",
    description:
      "An interactive world map connecting activists, scientists and policy makers in real time.",
    cta: "Join the Forum",
    accent: "#3B82F6",
  },
]

const TOTAL = 5

// Idle auto-rotation speed (radians per frame at 60fps)
// Negative = anticlockwise
const IDLE_SPEED     = -0.0015
const IDLE_DELAY_MS  = 3000   // wait 3s of no scroll before starting
const IDLE_FADE_IN   = 0.02   // how fast idle speed ramps up (lerp factor)

type Props = {
  dragEnabled: boolean
  onActivePanelChange?: (index: number) => void
}

export default function Cylinder({ dragEnabled, onActivePanelChange }: Props) {
  const groupRef    = useRef<THREE.Group>(null!)
  const rotationRef = useRef(0)
  const lastActive  = useRef(0)

  const [activePanel, setActivePanel] = useState(0)

  // ── Idle rotation state ───────────────────────────────────────────────────
  const idleActive      = useRef(false)   // whether idle rotation is currently on
  const idleSpeed       = useRef(0)       // current interpolated idle speed
  const idleTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollY     = useRef(0)
  const isScrolling     = useRef(false)
  const scrollStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const radius   = 5
  const height   = 3
  const segments = 64
  const videoArc = 1.2366
  const gapArc   = 0.023

  // ── Active panel / video play logic ──────────────────────────────────────
  function isActive(index: number): boolean {
    if (!dragEnabled) return true
    const left  = (activePanel - 1 + TOTAL) % TOTAL
    const right = (activePanel + 1) % TOTAL
    return index === activePanel || index === left || index === right
  }

  // ── Video textures ────────────────────────────────────────────────────────
  const tex0 = useVideoTexture(VIDEO_SOURCES[0] ?? "", isActive(0))
  const tex1 = useVideoTexture(VIDEO_SOURCES[1] ?? "", isActive(1))
  const tex2 = useVideoTexture(VIDEO_SOURCES[2] ?? "", isActive(2))
  const tex3 = useVideoTexture(VIDEO_SOURCES[3] ?? "", isActive(3))
  const tex4 = useVideoTexture(VIDEO_SOURCES[4] ?? "", isActive(4))
  const textures = [tex0, tex1, tex2, tex3, tex4]

  // ── Drag ─────────────────────────────────────────────────────────────────
  useDrag({
    enabled: dragEnabled,
    sensitivity: 0.002,
    damping: 0.88,
    onVelocity: (v) => { rotationRef.current += v },
    onDrag:     (d) => { rotationRef.current += d },
  })

  // ── Idle rotation — scroll listener ──────────────────────────────────────
  // Only active when scroll = 0 and no scroll has happened for 3s
  useEffect(() => {
    if (dragEnabled) return // drag phase handles its own rotation

    function startIdleTimer() {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        // Only start if still at scroll top
        if (window.scrollY === 0) {
          idleActive.current = true
        }
      }, IDLE_DELAY_MS)
    }

    function onScroll() {
      isScrolling.current = true
      idleActive.current  = false   // stop idle immediately on any scroll
      idleSpeed.current   = 0       // reset speed so fade-in restarts

      // Cancel any pending idle start
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

      // Detect scroll stop — restart the 3s idle timer only if back at top
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current)
      scrollStopTimer.current = setTimeout(() => {
        isScrolling.current = false
        if (window.scrollY === 0) {
          startIdleTimer()
        }
      }, 150) // 150ms after last scroll event = "stopped"
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    // Start the initial 3s timer on mount (user might not scroll at all)
    lastScrollY.current = window.scrollY
    if (window.scrollY === 0) {
      startIdleTimer()
    }

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (idleTimerRef.current)    clearTimeout(idleTimerRef.current)
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current)
      idleActive.current = false
      idleSpeed.current  = 0
    }
  }, [dragEnabled])

  // ── Panel centre angles ───────────────────────────────────────────────────
  const panelCentres: number[] = []
  let a = 0
  for (let i = 0; i < TOTAL; i++) {
    panelCentres.push(a + videoArc / 2)
    a += videoArc + gapArc
  }

  // ── Per-frame ─────────────────────────────────────────────────────────────
  useFrame(() => {
    if (!groupRef.current) return

    if (!dragEnabled) {
      // Scroll-driven rotation (from CameraRig's scroll velocity)
      if (scrollVelocity.value !== 0) {
        rotationRef.current += scrollVelocity.value
      }

      // Idle auto-rotation — fades in smoothly, stops instantly on scroll
      if (idleActive.current && !isScrolling.current && window.scrollY === 0) {
        // Lerp idleSpeed toward IDLE_SPEED for a smooth ramp-up
        idleSpeed.current += (IDLE_SPEED - idleSpeed.current) * IDLE_FADE_IN
        rotationRef.current += idleSpeed.current
      } else {
        // Fade idle speed back to 0 quickly when scrolling starts
        if (idleSpeed.current !== 0) {
          idleSpeed.current *= 0.8
          if (Math.abs(idleSpeed.current) < 0.00001) idleSpeed.current = 0
        }
      }
    }

    groupRef.current.rotation.y = rotationRef.current

    // Active panel detection (drag phase only)
    if (!dragEnabled) return

    const TWO_PI = Math.PI * 2
    let bestIdx  = 0
    let bestDist = Infinity

    panelCentres.forEach((centre, i) => {
      const effective = ((centre + rotationRef.current) % TWO_PI + TWO_PI) % TWO_PI
      const dist      = Math.min(effective, TWO_PI - effective)
      if (dist < bestDist) { bestDist = dist; bestIdx = i }
    })

    if (bestIdx !== lastActive.current) {
      lastActive.current = bestIdx
      setActivePanel(bestIdx)
      onActivePanelChange?.(bestIdx)
    }
  })

  // ── Geometry ──────────────────────────────────────────────────────────────
  const panels: { videoStart: number; gapStart: number }[] = []
  let currentAngle = 0
  for (let i = 0; i < TOTAL; i++) {
    panels.push({ videoStart: currentAngle, gapStart: currentAngle + videoArc })
    currentAngle += videoArc + gapArc
  }

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <group key={i}>
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

          <mesh>
            <cylinderGeometry
              args={[radius, radius, height, segments, 1, true, p.gapStart, gapArc]}
            />
            <meshBasicMaterial color="black" side={THREE.FrontSide} />
          </mesh>
          {/* <mesh>
            <cylinderGeometry
              args={[radius, radius, height, segments, 1, true]}
            />
            <meshBasicMaterial color="white" side={THREE.DoubleSide} />
          </mesh> */}

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