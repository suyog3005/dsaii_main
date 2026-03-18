"use client"

import dynamic from "next/dynamic"

const Scene = dynamic(() => import("./Scene"), { ssr: false })

export default function HeroSection() {
  return (
    <>
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
      `}</style>

      <section className="hero-section h-screen w-full bg-black relative overflow-hidden">
        <Scene />

        <div className="overlay-wrapper pointer-events-none absolute inset-0 z-10">

          {/* ── Navigation arrows ── */}
          <div className="absolute top-6 right-8 flex items-center gap-3 z-20">
            <button
              className="nav-arrow-left pointer-events-auto
                         w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30
                         flex items-center justify-center bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/20 cursor-pointer"
              aria-label="Previous stage"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 14L6 9L11 4" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="nav-arrow-right pointer-events-auto
                         w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30
                         flex items-center justify-center bg-white/10 backdrop-blur-sm
                         transition-all duration-300 hover:bg-white/20 cursor-pointer"
              aria-label="Next stage"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* ── STAGE 1: text-start ──
               left: 50%  → starts exactly at the screen centre line
               width: 50% → fills the right half
               pr-12      → breathing room from right edge
          ── */}
          <div className="text-start
            absolute
            md:left-[50%] md:top-[18%] md:w-[50%] md:pr-12
            left-0 bottom-[8%] w-full px-6
          ">
            <h1 className="anim-fade-up anim-d1
                           text-white font-black leading-[0.9] tracking-tight
                           text-[4rem] md:text-[7rem] mb-0">
              DSAII
            </h1>

            <p className="anim-fade-up anim-d2
                          text-white font-bold leading-tight
                          text-[1.2rem] md:text-[1.8rem] mt-1 mb-3">
              Technovation 4.0
            </p>

            {/* Rule — ends just after "Technovation 4.0" */}
            <div
              className="anim-fade anim-d2 h-[1px] bg-white/60 mb-5"
              style={{ width: "clamp(200px, 55%, 380px)" }}
            />

            <p className="anim-fade-up anim-d3
                          text-white/90 font-light leading-[1.65]
                          text-[0.88rem] md:text-[1rem] mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum. Sed ut
              perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo
              inventore veritatis et quasi architecto beatae vitae dicta sunt.
            </p>

            <a
              href="#"
              className="anim-fade-up anim-d4
                         pointer-events-auto text-white font-light
                         border-b border-white pb-1 inline-block
                         hover:opacity-70 transition-opacity
                         text-[0.95rem] md:text-[1.05rem]"
            >
              Contact us here!
            </a>
          </div>

          {/* ── STAGE 2: text-stop ──
               Same horizontal anchor — left: 50%
          ── */}
          <div className="text-stop opacity-0
            absolute
            md:left-[50%] md:top-[18%] md:w-[50%] md:pr-12
            left-0 bottom-[8%] w-full px-6
          ">
            <h2 className="text-white font-black leading-[0.9] tracking-tight
                           text-[3rem] md:text-[5.5rem] mb-6">
              MIRAI{" "}
              <span className="font-black">未来</span>
            </h2>

            <p className="text-white/90 font-light leading-[1.65]
                          text-[0.88rem] md:text-[1rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum. Sed ut
              perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo
              inventore veritatis et quasi architecto beatae vitae dicta sunt.
            </p>
          </div>

          {/* ── STAGE 3: text-end (PanelOverlay in Scene.tsx handles content) ── */}
          <div className="text-end opacity-0
            absolute
            md:left-[50%] md:bottom-[14%] md:w-[45%] md:pr-12
            left-0 bottom-[10%] w-full px-6
          " />

          {/* ── Bottom label ── */}
          <div className="text-end opacity-0
            absolute left-6 bottom-6
            hidden md:flex items-center gap-3">
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