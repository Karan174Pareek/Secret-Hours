import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedCollection from '../components/home/FeaturedCollection';
import NewArrivals from '../components/home/NewArrivals';
import BrandCraft from '../components/home/BrandCraft';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import PageTransition from '../motion/PageTransition';
import { useCart } from '../context/CartContext';

export const Home = () => {
  const { addToCart } = useCart();

  return (
    <PageTransition>
      <main id="main-content">
        <Hero />
        <FeaturedCollection />
        <NewArrivals onAddToCart={addToCart} />
        <BrandCraft />
        <Testimonials />
        <Newsletter />
      </main>
    </PageTransition>
  );
};

export default Home;
