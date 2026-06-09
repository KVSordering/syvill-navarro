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

const sections = [About, TechStack, Services, SelectedWork, Philosophy, Contact]

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function Home() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="relative min-h-screen bg-black">
      <LandingIntro onReveal={() => setRevealed(true)} />

      <AnimatePresence>
        {revealed && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Navbar visible={revealed} />
            <Hero revealed={revealed} />

            {sections.map((Section, i) => (
              <motion.div
                key={Section.name}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
              >
                <Section />
              </motion.div>
            ))}
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}
