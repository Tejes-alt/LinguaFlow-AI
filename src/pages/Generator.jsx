import PageTransition from '../components/PageTransition.jsx';
import RandomGenerator from '../components/RandomGenerator.jsx';

export default function Generator() {
  return (
    <PageTransition>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold text-slate-800 dark:text-white sm:text-5xl">
            Random String <span className="text-gradient">Generator</span>
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Generate secure passwords, UUIDs, and custom strings in one click.
          </p>
        </div>
        <RandomGenerator />
      </section>
    </PageTransition>
  );
}
