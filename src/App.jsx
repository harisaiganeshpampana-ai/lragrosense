import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsCounter from './components/StatsCounter';
import AboutSection from './components/AboutSection';
import VisionMission from './components/VisionMission';
import SmartFarmMonitor from './components/SmartFarmMonitor';
import FounderSection from './components/FounderSection';
import WhyAgroSense from './components/WhyAgroSense';
import InternshipSection from './components/InternshipSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-agri-500 selection:text-slate-950">
      <Navbar />
      <main>
        <Hero />
        <StatsCounter />
        <AboutSection />
        <VisionMission />
        <SmartFarmMonitor />
        <FounderSection />
        <WhyAgroSense />
        <InternshipSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
