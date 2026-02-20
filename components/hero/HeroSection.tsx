"use client"

import dynamic from "next/dynamic"

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
})

export default function HeroSection() {
  return (
    <>
      <section className="hero-section h-screen w-full bg-black">
        <Scene />
      </section>
    </>
  )
}