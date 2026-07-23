import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function App() {
  // Simple routing
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default App;
