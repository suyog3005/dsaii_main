import { useRef, useEffect, useCallback } from "react"

type UseDragOptions = {
  enabled: boolean
  sensitivity?: number
  damping?: number
  onDrag?: (delta: number) => void
  onVelocity?: (velocity: number) => void
}

// Custom cursors — transparent white circle
const CURSOR_OPEN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='16' stroke='rgba(255,255,255,0.55)' stroke-width='1.5' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E") 20 20, crosshair`

const CURSOR_DRAG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='12' stroke='rgba(255,255,255,0.7)' stroke-width='1.5' fill='rgba(255,255,255,0.18)'/%3E%3C/svg%3E") 16 16, crosshair`

// Apply cursor to BOTH html and body so no element can override it
function setCursor(cursor: string) {
  document.documentElement.style.cursor = cursor
  document.body.style.cursor = cursor
}

// Inject a <style> tag that forces cursor on every element while dragging
// This prevents child elements (like canvas, svg) from resetting the cursor
let styleTag: HTMLStyleElement | null = null

function lockCursor(cursor: string) {
  if (!styleTag) {
    styleTag = document.createElement("style")
    styleTag.id = "drag-cursor-lock"
    document.head.appendChild(styleTag)
  }
  // The !important on * ensures no child element can override
  styleTag.textContent = `* { cursor: ${cursor} !important; }`
}

function unlockCursor() {
  if (styleTag) {
    styleTag.textContent = ""
  }
}

export function useDrag({
  enabled,
  sensitivity = 0.002,
  damping     = 0.88,
  onDrag,
  onVelocity,
}: UseDragOptions) {
  const isDragging  = useRef(false)
  const previousX   = useRef(0)
  const velocityRef = useRef(0)
  const rafRef      = useRef<number | null>(null)
  const enabledRef  = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) {
      isDragging.current  = false
      velocityRef.current = 0
      unlockCursor()
      setCursor("default")
    } else {
      // As soon as drag is enabled, lock the open circle cursor
      lockCursor(CURSOR_OPEN)
      setCursor(CURSOR_OPEN)
    }
  }, [enabled])

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
      isDragging.current  = true
      previousX.current   = e.clientX
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      velocityRef.current = 0
      // Switch to drag circle — still locked via style tag
      lockCursor(CURSOR_DRAG)
      setCursor(CURSOR_DRAG)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!enabledRef.current || !isDragging.current) return
      const delta = e.clientX - previousX.current
      previousX.current   = e.clientX
      velocityRef.current = delta * sensitivity
      onDrag?.(delta * sensitivity)
    }

    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      // Return to open circle — NOT default
      if (enabledRef.current) {
        lockCursor(CURSOR_OPEN)
        setCursor(CURSOR_OPEN)
      }
      startInertia()
    }

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return
      isDragging.current  = true
      previousX.current   = e.touches[0].clientX
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      velocityRef.current = 0
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!enabledRef.current || !isDragging.current) return
      e.preventDefault()
      const delta = e.touches[0].clientX - previousX.current
      previousX.current   = e.touches[0].clientX
      velocityRef.current = delta * sensitivity
      onDrag?.(delta * sensitivity)
    }

    const onTouchEnd = () => {
      if (!isDragging.current) return
      isDragging.current = false
      startInertia()
    }

    window.addEventListener("mousedown",  onMouseDown)
    window.addEventListener("mousemove",  onMouseMove)
    window.addEventListener("mouseup",    onMouseUp)
    window.addEventListener("touchstart", onTouchStart, { passive: false })
    window.addEventListener("touchmove",  onTouchMove,  { passive: false })
    window.addEventListener("touchend",   onTouchEnd)

    return () => {
      window.removeEventListener("mousedown",  onMouseDown)
      window.removeEventListener("mousemove",  onMouseMove)
      window.removeEventListener("mouseup",    onMouseUp)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove",  onTouchMove)
      window.removeEventListener("touchend",   onTouchEnd)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      unlockCursor()
      setCursor("default")
    }
  }, [sensitivity, onDrag, startInertia])

  return { velocityRef }
}