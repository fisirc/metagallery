import { Footer } from "@/components/Footer/Footer";
import { Header } from "./components/Header";
import PricingSection from "./components/PricingCardSection";
import Switcher from './components/Switcher';
import { Stack } from '@mantine/core';

export const Home = () => (
  <>
    <main>
      <div style={{ marginTop: '2rem' }}> {/* Espaciado antes del Switcher */}
        <Switcher />
      </div>
      <Header />
      <PricingSection />
    </main>
    <Footer />
  </>
);
