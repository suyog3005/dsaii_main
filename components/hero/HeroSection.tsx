"use client"

import dynamic from "next/dynamic"

const Scene = dynamic(() => import("./Scene"), { ssr: false })

export default function HeroSection() {
  return (
    <>
      <section className="hero-section h-screen w-full bg-black relative overflow-hidden">
        <Scene />

        <div className="overlay-wrapper pointer-events-none absolute inset-0 z-10">

          {/* ── Navigation arrows — top-right ── */}
          <div className="absolute top-6 right-8 flex items-center gap-3 z-20">

            {/* Left arrow */}
            <button
              className="nav-arrow-left pointer-events-auto
                         w-10 h-10 md:w-12 md:h-12
                         rounded-full border border-white/30
                         flex items-center justify-center
                         bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/20
                         cursor-pointer"
              aria-label="Previous stage"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M11 14L6 9L11 4" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Right arrow */}
            <button
              className="nav-arrow-right pointer-events-auto
                         w-10 h-10 md:w-12 md:h-12
                         rounded-full border border-white/30
                         flex items-center justify-center
                         bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/20
                         cursor-pointer"
              aria-label="Next stage"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

          </div>

          {/* ── STAGE 1: text-start ── */}
          <div className="text-start
            absolute
            md:right-0 md:top-1/2 md:-translate-y-1/2 md:w-[48%] md:pr-16 md:pl-4 md:bottom-auto md:left-auto
            left-0 bottom-[12%] w-full px-6
          ">
            <p className="main-text text-white leading-[1.2] font-light mb-6
              text-[1.25rem] md:text-[2.1rem]
            ">
              Motley Crowd was born from friendly relationships and shared
              interest in the future of events from the teams at{" "}
              <span className="link underline underline-offset-4">Hello Monday</span>,{" "}
              <span className="link underline underline-offset-4">Dogstudio</span>, and{" "}
              <span className="link underline underline-offset-4">Set Snail</span>.
            </p>
            <p className="text-white leading-[1.2] font-light mb-8
              text-[1.25rem] md:text-[2.1rem]
            ">
              This is a collection of our shared experiences re-inventing the
              possibilities of events in the digital space
            </p>
            <a
              href="#"
              className="pointer-events-auto cta text-white font-light
                         border-b border-white pb-1 inline-block hover:opacity-70
                         transition-opacity text-[0.95rem] md:text-[1.1rem]"
            >
              Contact us here!
            </a>
          </div>

          {/* ── STAGE 2: text-stop ── */}
          <div className="text-stop opacity-0
            absolute
            md:right-0 md:top-1/2 md:-translate-y-1/2 md:w-[46%] md:pr-16 md:pl-4 md:bottom-auto md:left-auto
            left-0 bottom-[12%] w-full px-6
          ">
            <p className="text-white font-bold leading-[1.05]"
               style={{ fontSize: "clamp(1.6rem, 5vw, 4.2rem)" }}>
              Motley Crowd imagines, explores and builds immersive events
              for the digital age.
            </p>
            <div className="mt-6 md:mt-8 flex items-center gap-4">
              <div className="w-10 md:w-12 h-[2px] bg-purple-400" />
              <a
                href="#"
                className="pointer-events-auto text-purple-400 tracking-wide
                           hover:opacity-70 transition-opacity
                           text-[0.8rem] md:text-[0.95rem]"
              >
                Explore our projects
              </a>
              <span className="text-purple-400">→</span>
            </div>
          </div>

          {/* ── STAGE 3: text-end ── */}
          <div className="text-end opacity-0
            absolute
            md:left-10 md:bottom-[14%] md:w-[38%]
            left-0 bottom-[10%] w-full px-6
          ">
            <p className="text-white font-bold leading-[1.05] mb-5"
               style={{ fontSize: "clamp(1.5rem, 4vw, 3.4rem)" }}>
              A virtual Open Days event featuring 12 academic islands
            </p>
            <div className="w-10 h-[2px] bg-amber-400 mb-4" />
            <div className="flex items-center gap-3 pointer-events-auto">
              <span className="text-amber-400 tracking-wide text-[0.8rem] md:text-[0.9rem]">
                SDU Open Days
              </span>
              <span className="text-amber-400">→</span>
            </div>
          </div>

          {/* ── Bottom label ── hidden on mobile */}
          <div className="text-end opacity-0
            absolute left-6 bottom-6
            hidden md:flex items-center gap-3
          ">
            <span className="text-white/40 text-[0.7rem] tracking-widest font-mono">01</span>
            <span className="text-white/40 text-[0.7rem] tracking-widest uppercase">
              Tackling Online Education
            </span>
          </div>

        </div>
      </section>
    </>
  )
}