import { motion } from 'framer-motion';
import { FiGithub, FiHeart, FiCode, FiZap } from 'react-icons/fi';
import PageTransition from '../components/PageTransition.jsx';

const TECH_STACK = ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Framer Motion', 'Axios', 'React Icons', 'Recharts', 'jsPDF'];

const VALUES = [
  { icon: FiZap, label: 'Fast', desc: 'Instant translations powered by a robust API layer.' },
  { icon: FiCode, label: 'Open source', desc: 'Clean, well-documented code you can build on.' },
  { icon: FiHeart, label: 'Crafted with care', desc: 'Every detail, from motion to color, was intentional.' },
];

export default function About() {
  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-slate-800 dark:text-white sm:text-5xl">
            About <span className="text-gradient">LinguaFlow AI</span>
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Breaking language barriers, one translation at a time.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass mb-8 rounded-2xl p-8">
          <h2 className="mb-3 text-xl font-bold text-slate-700 dark:text-slate-200">Our mission</h2>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            LinguaFlow AI was built to make translation feel effortless rather than transactional. Beyond
            translating text, it doubles as a handy toolkit — a random string and password generator, a
            searchable history of everything you've translated, and a dashboard that shows how you use language
            every day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass mb-8 rounded-2xl p-8"
        >
          <h2 className="mb-4 text-xl font-bold text-slate-700 dark:text-slate-200">Built with</h2>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-brand-gradient-soft px-3 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {VALUES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-2xl p-6 text-center">
              <Icon className="mx-auto mb-3 text-brand-500" size={26} />
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">{label}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href="https://github.com/your-username/linguaflow-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiGithub /> View source
          </a>
        </div>
      </section>
    </PageTransition>
  );
}
