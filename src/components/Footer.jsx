import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiHeart, FiGlobe } from 'react-icons/fi';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/translator', label: 'Translator' },
  { to: '/generator', label: 'Generator' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-ink/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-800 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <FiGlobe size={16} />
              </span>
              LinguaFlow AI
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A premium translation experience with history, voice, and a built-in string generator.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Navigate</h4>
            <ul className="space-y-2">
              {LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="focus-ring text-sm text-slate-600 hover:text-brand-500 dark:text-slate-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/your-username/linguaflow-ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-500 dark:border-slate-700 dark:text-slate-400"
              >
                <FiGithub size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-500 dark:border-slate-700 dark:text-slate-400"
              >
                <FiTwitter size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200/50 pt-6 text-sm text-slate-400 dark:border-slate-800/50 sm:flex-row">
          <p>© {new Date().getFullYear()} LinguaFlow AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <FiHeart className="text-rose-400" /> using React &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
