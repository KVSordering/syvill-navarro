import { motion } from 'framer-motion'
import BookingCalendar from './BookingCalendar'
import ToolsFooter from './ToolsFooter'
import { viewport, useFadeUp } from '../lib/motion'

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
  {
    label: 'LinkedIn',
    value: 'syvill-navarro',
    href: 'https://www.linkedin.com/in/syvill-navarro',
    external: true,
  },
]

export default function Contact() {
  const fadeUp = useFadeUp()

  return (
    <section id="contact" className="relative pt-24 sm:pt-32 px-5 sm:px-6">
      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <p className="text-xs tracking-[0.28em] uppercase text-accent mb-5">Contact</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-ink tracking-tight mb-6 leading-[1.15]">
            Let’s build something useful
          </h2>
          <p className="text-base sm:text-lg text-muted leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you need a website, an internal tool, automation, a dashboard,
            or a custom business system — pick a time.
          </p>

          <div className="mb-10">
            <BookingCalendar />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {contactDetails.map((detail) => (
              <motion.a
                key={detail.label}
                href={detail.href}
                {...(detail.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-card hover:border-ink/10 transition-colors duration-300"
              >
                <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">
                  {detail.label}
                </p>
                <p className="text-base text-ink break-all">{detail.value}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <ToolsFooter />
    </section>
  )
}
