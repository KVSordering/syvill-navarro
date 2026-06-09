import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

export default function LandingIntro({ onReveal }) {
  const [phase, setPhase] = useState('idle')
  const isHovered = phase === 'hovered'

  const handleClick = () => {
    if (phase !== 'idle' && phase !== 'hovered') return
    setPhase('expanding')
    setTimeout(() => setPhase('exiting'), 900)
    setTimeout(() => {
      setPhase('done')
      onReveal()
    }, 1400)
  }

  if (phase === 'done') return null

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{
            opacity: phase === 'exiting' ? 0 : 1,
            background:
              phase === 'expanding' || phase === 'exiting'
                ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, #000 65%)'
                : '#000000',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            onClick={handleClick}
            onMouseEnter={() => phase === 'idle' && setPhase('hovered')}
            onMouseLeave={() => phase === 'hovered' && setPhase('idle')}
            className="relative cursor-pointer bg-transparent border-none outline-none focus:outline-none"
            aria-label="Reveal profile"
            animate={{
              scale:
                phase === 'expanding' || phase === 'exiting'
                  ? 1.2
                  : isHovered
                    ? 1.08
                    : 1,
              y: phase === 'expanding' || phase === 'exiting' ? -120 : 0,
              opacity: phase === 'exiting' ? 0 : 1,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {(phase === 'idle' || phase === 'hovered') && (
                <>
                  <span className="ripple-ring absolute w-32 h-32 rounded-full border border-white/10" />
                  <span className="ripple-ring-delayed absolute w-32 h-32 rounded-full border border-white/5" />
                </>
              )}
            </div>

            <div
              className={`relative logo-breathe logo-glow logo-sweep overflow-hidden rounded-2xl p-4 ${
                isHovered ? 'drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]' : ''
              }`}
            >
              <img
                src={logo}
                alt="Syvill Navarro"
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 select-none"
                draggable={false}
              />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
