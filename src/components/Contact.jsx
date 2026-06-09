import { motion } from 'framer-motion'

const contactDetails = [
  {
    label: 'Email',
    value: 'carlsyvillnavarro@gmail.com',
    href: 'mailto:carlsyvillnavarro@gmail.com',
  },
  {
    label: 'Phone',
    value: '780 975 3056',
    href: 'tel:+17809753056',
  },
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {contactDetails.map((detail, i) => (
              <motion.a
                key={detail.label}
                href={detail.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 text-center"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-3">
                  {detail.label}
                </p>
                <p className="text-base sm:text-lg font-light text-white/60 group-hover:text-white/90 transition-colors duration-300">
                  {detail.value}
                </p>
              </motion.a>
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
