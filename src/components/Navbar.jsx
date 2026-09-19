import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from './LogoMark'
import { BOOK_HREF } from './MagneticButton'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'What I build', href: '#what-i-build' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled || mobileOpen
          ? 'bg-surface border-b border-line shadow-card'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 group" aria-label="Syvill Navarro">
          <LogoMark className="w-10 h-10 sm:w-11 sm:h-11" />
          <span className="hidden sm:block text-sm tracking-wide text-ink/80 group-hover:text-ink transition-colors">
            Syvill Navarro
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted hover:text-ink transition-colors duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={BOOK_HREF}
              className="inline-flex items-center rounded-xl bg-accent text-white text-sm px-4 py-2 hover:bg-accent-hover transition-colors duration-300"
            >
              Book a chat
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-ink transition-transform ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-ink transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-line bg-surface overflow-hidden"
          >
            <ul className="px-5 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-muted hover:text-ink transition-colors block py-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <a
                  href={BOOK_HREF}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center rounded-xl bg-accent text-white text-sm px-4 py-2"
                >
                  Book a chat
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
