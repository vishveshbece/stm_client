import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import HighlightsSection from './components/HighlightsSection';
import PricingSection from './components/PricingSection';
import RegistrationSection from './components/RegistrationSection';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function App() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      <Navbar onRegister={() => setShowRegistration(true)} />
      <HeroSection onRegister={() => setShowRegistration(true)} />
      <HighlightsSection />
      <PricingSection onRegister={() => setShowRegistration(true)} />
      <Footer />
      {showRegistration && (
        <RegistrationSection onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
}
