import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { HistoryProvider } from './context/HistoryContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import ToastContainer from './components/Toast.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Route-level code splitting: each page ships as its own chunk and is only
// fetched when the person actually navigates there.
const Home = lazy(() => import('./pages/Home.jsx'));
const Translator = lazy(() => import('./pages/Translator.jsx'));
const Generator = lazy(() => import('./pages/Generator.jsx'));
const History = lazy(() => import('./pages/History.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Error404 = lazy(() => import('./pages/Error404.jsx'));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size={32} />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HistoryProvider>
          <BrowserRouter>
            <div className="relative flex min-h-screen flex-col">
              <AnimatedBackground />
              <Navbar />
              <main className="flex-1">
                <AnimatedRoutes />
              </main>
              <Footer />
              <ToastContainer />
            </div>
          </BrowserRouter>
        </HistoryProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
