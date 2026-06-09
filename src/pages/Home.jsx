import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LandingIntro from '../components/LandingIntro'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import TechStack from '../components/TechStack'
import Services from '../components/Services'
import SelectedWork from '../components/SelectedWork'
import Philosophy from '../components/Philosophy'
import Contact from '../components/Contact'
import ScrollProgress from '../components/ScrollProgress'
import ParallaxBackground from '../components/ParallaxBackground'

const sections = [About, TechStack, Services, SelectedWork, Philosophy, Contact]

const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Home() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="relative min-h-screen bg-black">
      <LandingIntro onReveal={() => setRevealed(true)} />

      <AnimatePresence>
        {revealed && (
          <>
            <ParallaxBackground />
            <motion.main
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrollProgress />
              <Navbar visible={revealed} />
            <Hero revealed={revealed} />

            {sections.map((Section) => (
              <motion.div
                key={Section.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={sectionVariants}
              >
                <Section />
              </motion.div>
            ))}
            </motion.main>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
