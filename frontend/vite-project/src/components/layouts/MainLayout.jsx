// layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import HomeHeader from '../../pages/homepage/HomeHeader';
import Footer from '../../pages/homepage/sections/Footer/Footer';
export default function MainLayout() {
  return (
    <div className=" website-layout min-h-screen flex flex-col">
      <header>
        <HomeHeader />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
