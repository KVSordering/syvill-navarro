import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'

const links = [
  { label: 'Email', href: 'mailto:hello@carlsyvill.com', variant: 'primary' },
  { label: 'GitHub', href: 'https://github.com/carlsyvill', variant: 'outline' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/carlsyvill', variant: 'outline' },
  { label: 'Schedule a Call', href: 'mailto:hello@carlsyvill.com?subject=Schedule%20a%20Call', variant: 'primary' },
]

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 sm:py-40 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.04)_0%,transparent_60%)]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Contact</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight mb-8">
            Let&apos;s Build Something Useful
          </h2>
          <p className="text-base sm:text-lg text-white/40 leading-relaxed font-light mb-12 max-w-xl mx-auto">
            Whether you need a website, internal platform, automation system, CRM,
            dashboard, or custom business solution, let&apos;s talk.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <MagneticButton
                  href={link.href}
                  variant={link.variant}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </MagneticButton>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 pt-8 border-t border-white/5"
        >
          <p className="text-xs text-white/25 tracking-widest uppercase">
            © {new Date().getFullYear()} Syvill Navarro
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
