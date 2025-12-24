import React from 'react';

import HotDeals from './sections/HotDeals/HotDeals';
import CollabClinic from './sections/Partners/CollabClinic';
import HomeHeader from './HomeHeader';
import HeroSections from './sections/Hero/HeroSections';
import Footer from './sections/Footer/Footer';
import ServiceSections from './sections/Services/ServiceSection';
import Stats from './sections/StatsSections/Stats';
import Statis from './sections/StatsSections/Statis';
import SpecialtyServices from './sections/Specialty/SpecialtySections';
import FeedBack from './sections/FeedBack/FeedBack';
import DoctorSections from './sections/Doctors/DoctorSections';
import Contact from './sections/Contact/Contact';
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      {/* <HomeHeader /> */}
      {/* Hero Section */}
      <HeroSections />
      {/* Stats Section */}
      <Stats />
      {/* Services Section - Slider */}
      <ServiceSections />
      {/* Specialty Section - Slider */}
      <SpecialtyServices />
      {/* Partner */}
      <CollabClinic />
      {/* HotDeals */}
      <HotDeals />
      {/* FeedBack */}
      <FeedBack />
      {/* Doctors Section - Slider */}
      <DoctorSections />
      {/* Statis Section */}
      <Statis />
      {/* Contact Section */}
      <Contact />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
