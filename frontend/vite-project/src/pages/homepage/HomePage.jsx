import React from 'react';

import CollabClinic from './sections/Partners/CollabClinic';
import HeroSections from './sections/Hero/HeroSections';
import Stats from './sections/StatsSections/Stats';
import SpecialtyServices from './sections/Specialty/SpecialtySections';
import FeedBack from './sections/FeedBack/FeedBack';
import DoctorSections from './sections/Doctors/DoctorSections';
import CtaSection from './sections/Cta/CtaSection';
import ServicesPage from './sections/Services/ServicesPage';
import DoctorsPage from './sections/Doctors/DoctorsPage';
import AboutPage from './sections/About/AboutPage';
import ContactPage from './sections/Contact/Contact';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <HeroSections />
      <CollabClinic />
      <Stats />
      <SpecialtyServices />
      <FeedBack />
      <DoctorSections />
      <CtaSection />
    </div>
  );
};

export { ServicesPage, DoctorsPage, AboutPage, ContactPage };
export default HomePage;
