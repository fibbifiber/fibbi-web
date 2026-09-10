import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { trackEvent } from './lib/supabase';
import { useSEO } from './lib/seo';

import Announce from './components/Announce';
import Topbar from './components/Topbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

import Home from './pages/Home';
import Journal from './pages/Journal'; // POSTS is shared with seo.js + Home, so this can't split

const Shop = lazy(() => import('./pages/Shop'));
const Product = lazy(() => import('./pages/Product'));
const Science = lazy(() => import('./pages/Science'));
const Story = lazy(() => import('./pages/Story'));
const Policies = lazy(() => import('./pages/Policies'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function PageViews() {
  const location = useLocation();
  useSEO(); // must run before the tracking effect so document.title is current
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    trackEvent('page_view', {
      path: location.pathname,
      search: location.search || null,
      title: document.title,
      referrer: document.referrer || null,
    });
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <PageViews />
      <Announce />
      <div className="nav-shell">
        <Topbar />
      </div>
      <CartDrawer />
      <main>
        <Suspense fallback={<div className="route-loading"><span className="spinner" /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:sku" element={<Product />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<Journal />} />
            <Route path="/science" element={<Science />} />
            <Route path="/story" element={<Story />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </CartProvider>
  );
}
