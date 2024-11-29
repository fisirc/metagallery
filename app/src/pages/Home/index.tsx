import { Footer } from "@/components/Footer/Footer";
import { Header } from "./components/Header";
import PricingSection from "./components/PricingCardSection";
import Switcher from './components/Switcher';
import { Group, Stack } from '@mantine/core';
import ThemeSwitcher from "@/components/DarkerMode/themeSwitcher";

export const Home = () => (
  <>
    <main>
    <div style={{ marginTop: '2rem', justifyContent: 'flex-end', display: 'flex',}}>
        <Group >
          <Switcher />
          <ThemeSwitcher />
        </Group>
      </div>
      <Header />
      <PricingSection />
    </main>
    <Footer />
  </>
);
