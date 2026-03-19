"use client"

import dynamic from "next/dynamic"
import Navbar from "./Navbar"

const Scene = dynamic(() => import("./Scene"), { ssr: false })

export default function HeroSection() {
  return (
    <>
      <Navbar />
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .anim-fade-up { animation: fadeSlideUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade    { animation: fadeIn 0.7s ease both; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.2s; }
        .anim-d3 { animation-delay: 0.32s; }
        .anim-d4 { animation-delay: 0.48s; }

        @keyframes scrollDot {
          0%   { top: 0;    opacity: 0.8; }
          80%  { top: 100%; opacity: 0;   }
          100% { top: 0;    opacity: 0;   }
        }
        .scroll-dot {
          animation: scrollDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <section className="hero-section h-screen w-full bg-black relative overflow-hidden">
        <Scene />

        <div className="overlay-wrapper pointer-events-none absolute inset-0 z-10">

          {/* ── Navigation arrows — below navbar ── */}
          <div className="absolute top-[3.5rem] md:top-[4.5rem] right-4 md:right-6
                          flex items-center gap-2 md:gap-3 z-20">
            <button
              className="nav-arrow-left pointer-events-auto
                         w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/30
                         flex items-center justify-center bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/20 cursor-pointer"
              aria-label="Previous stage"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M11 14L6 9L11 4" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="nav-arrow-right pointer-events-auto
                         w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/30
                         flex items-center justify-center bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/20 cursor-pointer"
              aria-label="Next stage"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STAGE 1 — text-start
              Desktop: right half from 45%, top 18%
              Mobile:  bottom of screen, full width
          ════════════════════════════════════════════════════════════════ */}
          <div className="text-start absolute
            md:left-[45%] md:top-[18%] md:w-[43%] md:pr-10 md:bottom-auto
            left-0 bottom-[6%] w-full px-5
          ">
            {/* ── Desktop text ── */}
            <div className="hidden md:block">
              <h1 className="anim-fade-up anim-d1
                             text-white font-black leading-[0.9] tracking-tight
                             text-[7rem] mb-0">
                DSAII
              </h1>
              <p className="anim-fade-up anim-d2
                            text-white font-bold leading-tight
                            text-[1.8rem] mt-1 mb-3">
                Technovation 4.0
              </p>
              <div className="anim-fade anim-d2 h-[1px] bg-white/60 mb-5"
                   style={{ width: "clamp(200px, 55%, 380px)" }} />
              <p className="anim-fade-up anim-d3
                            text-white/90 font-light leading-[1.65]
                            text-[1rem] mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <a href="#"
                 className="anim-fade-up anim-d4 pointer-events-auto text-white font-light
                            border-b border-white pb-1 inline-block hover:opacity-70
                            transition-opacity text-[1.05rem]">
                Contact us here!
              </a>
            </div>

            {/* ── Mobile text — shorter ── */}
             {/* Mobile */}
              <div className="md:hidden">
                <h1 className="anim-fade-up anim-d1
                              text-white font-black leading-[0.9] tracking-tight
                              text-[2.2rem] mb-0">
                  DSAII
                </h1>
                <p className="anim-fade-up anim-d2
                              text-white font-bold leading-tight
                              text-[0.8rem] mt-1 mb-2">
                  Technovation 4.0
                </p>
                <div className="anim-fade anim-d2 h-[1px] bg-white/60 mb-3 w-[80px]" />
                <p className="anim-fade-up anim-d3
                              text-white/85 font-light leading-[1.5]
                              text-[0.75rem] mb-4">
                  We craft immersive digital events that reimagine how the world
                  gathers, connects and experiences together.
                </p>
                <a href="#"
                  className="anim-fade-up anim-d4 pointer-events-auto text-white font-light
                              border-b border-white pb-1 inline-block hover:opacity-70
                              transition-opacity text-[0.75rem]">
                  Contact us here!
                </a>
              </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STAGE 2 — text-stop
              Desktop: right half from 54%, top 18%
              Mobile:  bottom of screen, full width
          ════════════════════════════════════════════════════════════════ */}
          <div className="text-stop opacity-0 absolute
            md:left-[54%] md:top-[18%] md:w-[43%] md:pr-10 md:bottom-auto
            left-0 bottom-[6%] w-full px-5
          ">
            {/* ── Desktop text ── */}
            <div className="hidden md:block">
              <h2 className="text-white font-black leading-[0.9] tracking-tight
                             text-[5.5rem] mb-6">
                MIRAI <span className="font-black">未来</span>
              </h2>
              <div className="h-[1px] bg-white/60 mb-5"
                   style={{ width: "clamp(200px, 55%, 380px)" }} />
              <p className="text-white/90 font-light leading-[1.65] text-[1rem]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>

            {/* ── Mobile text — shorter ── */}
            {/* Mobile */}
            <div className="md:hidden">
              <h2 className="text-white font-black leading-[0.9] tracking-tight
                            text-[1.8rem] mb-3">
                MIRAI <span className="font-black">未来</span>
              </h2>
              <div className="h-[1px] bg-white/60 mb-3 w-[70px]" />
              <p className="text-white/85 font-light leading-[1.5] text-[0.75rem]">
                The future of events is here — immersive, digital, and
                built for the next generation of audiences.
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              STAGE 3 — text-end
              PanelOverlay in Scene.tsx handles dynamic content.
              This div is the GSAP fade-in anchor only.
          ════════════════════════════════════════════════════════════════ */}
          <div className="text-end opacity-0 absolute
            md:left-[50%] md:bottom-[14%] md:w-[45%] md:pr-12
            left-0 bottom-[10%] w-full px-5
          " />

          {/* ── Bottom label — desktop only ── */}
          <div className="text-end opacity-0 absolute left-6 bottom-6
                          hidden md:flex items-center gap-3">
            <span className="text-white/40 text-[0.7rem] tracking-widest font-mono">01</span>
            <span className="text-white/40 text-[0.7rem] tracking-widest uppercase">
              Tackling Online Education
            </span>
          </div>

          {/* ── Scroll indicator — bottom center ── */}
          <div className="scroll-indicator absolute bottom-6 md:bottom-8
                          left-1/2 -translate-x-1/2
                          flex flex-col items-center pointer-events-none">
            <span className="text-white/30 text-[0.55rem] md:text-[0.6rem]
                             tracking-[0.25em] uppercase mb-2">
              Scroll
            </span>
            <div className="relative w-[1px] h-10 md:h-12"
                 style={{ background: "rgba(255,255,255,0.15)" }}>
              <div className="scroll-dot absolute left-1/2 -translate-x-1/2
                              w-[3px] h-[3px] rounded-full"
                   style={{ background: "rgba(255,255,255,0.7)" }} />
            </div>
          </div>

        </div>
      </section>
    </>
  )
}