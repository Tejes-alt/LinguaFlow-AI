import { useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import TranslatorCard from '../components/TranslatorCard.jsx';

export default function Translator() {
  const location = useLocation();
  const reuseData = location.state?.reuse || null;

  return (
    <PageTransition>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold text-slate-800 dark:text-white sm:text-5xl">
            AI <span className="text-gradient">Translator</span>
          </h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Translate text instantly across dozens of languages, with detection and confidence built in.
          </p>
        </div>
        <TranslatorCard initialData={reuseData} />
      </section>
    </PageTransition>
  );
}
