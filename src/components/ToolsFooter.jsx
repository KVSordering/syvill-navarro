import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const groups = [
  { label: 'Frontend', detail: 'React, TypeScript, Tailwind' },
  { label: 'Backend', detail: 'Node, Python, REST APIs' },
  { label: 'Data', detail: 'SQL, Postgres, file feeds' },
  { label: 'Cloud', detail: 'Railway, Docker, CI' },
  { label: 'Integrations', detail: 'SFTP, CSV, SQL, webhooks' },
]

export default function ToolsFooter() {
  const [open, setOpen] = useState(false)

  return (
    <footer className="max-w-6xl mx-auto mt-20 sm:mt-28 pt-8 pb-10 border-t border-line">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="text-xs text-muted tracking-wide">
            © {new Date().getFullYear()} Syvill Navarro
          </p>
          <p className="text-sm text-muted mt-2">
            <a
              href="https://www.linkedin.com/in/syvill-navarro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-line mx-2">·</span>
            Modern web stack — details on request.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="self-start sm:self-auto text-sm text-muted hover:text-ink transition-colors"
          aria-expanded={open}
        >
          {open ? 'Hide tools' : 'Tools'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ul className="flex flex-wrap gap-2 pt-6">
              {groups.map((group) => (
                <li
                  key={group.label}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted"
                  title={group.detail}
                >
                  {group.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
