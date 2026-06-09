import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll()

  const glowY = useTransform(scrollYProgress, [0, 1], [80, -120])
  const glowX = useTransform(scrollYProgress, [0, 1], [40, -60])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 90])
  const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.12, 1.28])
  const innerRingY = useTransform(scrollYProgress, [0, 1], [30, -80])
  const gridY = useTransform(scrollYProgress, [0, 1], [50, -100])
  const slashRotate = useTransform(scrollYProgress, [0, 1], [35, 55])
  const slashY = useTransform(scrollYProgress, [0, 1], [20, -140])

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute bottom-0 right-0 w-[520px] h-[520px] sm:w-[640px] sm:h-[640px] translate-x-[18%] translate-y-[18%]">
        {/* Core glow */}
        <motion.div
          style={{ y: glowY, x: glowX }}
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_35%,transparent_68%)]"
        />

        {/* Dot cluster */}
        <motion.div
          style={{ y: gridY }}
          className="absolute bottom-[18%] right-[18%] w-[280px] h-[280px] opacity-40"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
            }}
          />
        </motion.div>

        {/* Outer ring */}
        <motion.div
          style={{ rotate: ringRotate, scale: ringScale }}
          className="absolute inset-[8%] rounded-full border border-white/[0.12]"
        />

        {/* Middle ring */}
        <motion.div
          style={{ rotate: ringRotate, scale: ringScale, y: innerRingY }}
          className="absolute inset-[22%] rounded-full border border-white/[0.08]"
        />

        {/* Inner ring */}
        <motion.div
          style={{ rotate: ringRotate, scale: ringScale }}
          className="absolute inset-[36%] rounded-full border border-white/[0.18] bg-white/[0.02]"
        />

        {/* SN-style slash accent */}
        <motion.div
          style={{ rotate: slashRotate, y: slashY }}
          className="absolute bottom-[28%] right-[22%] w-[220px] h-[3px] bg-gradient-to-r from-transparent via-white/30 to-white/50 origin-right"
        />

        {/* Corner highlight */}
        <motion.div
          style={{ y: glowY }}
          className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.2)_0%,transparent_70%)]"
        />
      </div>

      {/* Soft fade so it blends into black */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.03)_0%,transparent_45%)]" />
    </div>
  )
}
