import { useRef, useEffect, useCallback } from "react"

type UseDragOptions = {
  enabled: boolean
  sensitivity?: number
  damping?: number
  onDrag?: (delta: number) => void
  onVelocity?: (velocity: number) => void
}

export function useDrag({
  enabled,
  sensitivity = 0.005,
  damping = 0.92,
  onDrag,
  onVelocity,
}: UseDragOptions) {
  const isDragging = useRef(false)
  const previousX = useRef(0)
  const velocityRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const enabledRef = useRef(enabled)

  // Keep enabledRef in sync
  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) {
      isDragging.current = false
      velocityRef.current = 0
    }
  }, [enabled])

  // Inertia loop — runs independently of React re-renders
  const startInertia = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const loop = () => {
      if (Math.abs(velocityRef.current) < 0.0001) {
        velocityRef.current = 0
        return
      }
      velocityRef.current *= damping
      onVelocity?.(velocityRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [damping, onVelocity])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!enabledRef.current) return
      isDragging.current = true
      previousX.current = e.clientX
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      velocityRef.current = 0
      document.body.style.cursor = "grabbing"
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!enabledRef.current || !isDragging.current) return
      const delta = e.clientX - previousX.current
      previousX.current = e.clientX
      velocityRef.current = delta * sensitivity
      onDrag?.(delta * sensitivity)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = enabledRef.current ? "grab" : "default"
      startInertia()
    }

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return
      isDragging.current = true
      previousX.current = e.touches[0].clientX
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      velocityRef.current = 0
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!enabledRef.current || !isDragging.current) return
      e.preventDefault()
      const delta = e.touches[0].clientX - previousX.current
      previousX.current = e.touches[0].clientX
      velocityRef.current = delta * sensitivity
      onDrag?.(delta * sensitivity)
    }

    const onTouchEnd = () => {
      if (!isDragging.current) return
      isDragging.current = false
      startInertia()
    }

    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchstart", onTouchStart, { passive: false })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)

    return () => {
      window.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.cursor = "default"
    }
  }, [sensitivity, onDrag, startInertia])

  // Update cursor when enabled changes
  useEffect(() => {
    document.body.style.cursor = enabled ? "grab" : "default"
  }, [enabled])

  return { velocityRef }
}