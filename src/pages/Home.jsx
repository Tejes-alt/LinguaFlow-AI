import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGlobe, FiShield, FiZap, FiClock, FiMoon, FiMic } from 'react-icons/fi';
import PageTransition from '../components/PageTransition.jsx';
import StatCard from '../components/StatCard.jsx';
import StatsChart from '../components/StatsChart.jsx';
import GreetingWave from '../components/GreetingWave.jsx';
import { useHistory } from '../context/HistoryContext.jsx';
import { getLanguageName } from '../utils/languages';

const FEATURES = [
  { icon: FiGlobe, title: '29 Languages', desc: 'Translate across dozens of languages with automatic detection.' },
  { icon: FiZap, title: 'Instant Results', desc: 'Fast, reliable translations powered by a production-grade API.' },
  { icon: FiMic, title: 'Voice Ready', desc: 'Speak to translate, and listen to translations read aloud.' },
  { icon: FiClock, title: 'Full History', desc: 'Every translation is saved locally so you can search and reuse it.' },
  { icon: FiShield, title: 'Private by Design', desc: 'Your history lives in your browser — never on a server.' },
  { icon: FiMoon, title: 'Day & Night', desc: 'A beautiful light and dark mode that remembers your preference.' },
];

function getMostUsedLanguageCode(history) {
  if (history.length === 0) return null;
  const counts = {};
  history.forEach((item) => {
    counts[item.toLang] = (counts[item.toLang] || 0) + 1;
  });
  const [topCode] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return topCode;
}

export default function Home() {
  const { history } = useHistory();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const topCode = getMostUsedLanguageCode(history);
    return {
      total: history.length,
      characters: history.reduce((sum, item) => sum + (item.sourceText?.length || 0), 0),
      today: history.filter((item) => new Date(item.timestamp).toDateString() === today).length,
      topLanguage: topCode ? getLanguageName(topCode) : '—',
    };
  }, [history]);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 text-center sm:px-6 sm:pt-36 lg:px-8">
        <GreetingWave />
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display relative z-10 mx-auto max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-slate-800 dark:text-white sm:text-6xl"
        >
          Your words, in <span className="text-gradient">every language.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="relative z-10 mx-auto mt-6 max-w-xl text-lg text-slate-500 dark:text-slate-400"
        >
          Type, paste, or speak — LinguaFlow AI translates it instantly, keeps a searchable history, and reads it
          back to you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/translator"
            className="focus-ring group flex items-center gap-2 rounded-xl bg-brand-gradient px-7 py-3.5 font-semibold text-white shadow-glow transition hover:scale-[1.03]"
          >
            Start translating <FiArrowRight className="transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/generator"
            className="focus-ring rounded-xl border border-slate-200 bg-white/70 px-7 py-3.5 font-semibold text-slate-600 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
          >
            Try the generator
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Everything you need, in one place</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="glass rounded-2xl p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
                  <Icon size={22} />
                </div>
                <h3 className="mb-1.5 text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Your translation dashboard</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">A live look at how you use LinguaFlow AI.</p>
          </div>
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FiGlobe} label="Total translations" value={stats.total} gradient="from-brand-500 to-brand-700" />
            <StatCard icon={FiZap} label="Characters translated" value={stats.characters} gradient="from-sky-500 to-cyan-500" />
            <StatCard icon={FiClock} label="Translations today" value={stats.today} gradient="from-rose-500 to-pink-500" />
            <StatCard icon={FiShield} label="Most used language" value={stats.topLanguage} gradient="from-emerald-500 to-teal-500" />
          </div>
          <StatsChart history={history} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl rounded-3xl bg-brand-gradient bg-[length:200%_200%] p-12 text-center text-white shadow-glow animate-gradient-shift"
        >
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to break the language barrier?</h2>
          <p className="mt-3 text-white/90">Jump in and translate your first phrase in seconds.</p>
          <Link
            to="/translator"
            className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-brand-700 transition hover:scale-[1.03]"
          >
            Get started <FiArrowRight />
          </Link>
        </motion.div>
      </section>
    </PageTransition>
  );
}
