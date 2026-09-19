import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import WhatIBuild from '../components/WhatIBuild'
import SelectedWork from '../components/SelectedWork'
import HowIWork from '../components/HowIWork'
import Contact from '../components/Contact'
import ScrollProgress from '../components/ScrollProgress'
import ParallaxBackground from '../components/ParallaxBackground'

export default function Home() {
  return (
    <div id="top" className="relative min-h-screen bg-page text-ink">
      <ParallaxBackground />
      <div className="relative z-10">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <About />
          <WhatIBuild />
          <SelectedWork />
          <HowIWork />
          <Contact />
        </main>
      </div>
    </div>
  )
}
