import Switcher from './components/Switcher';
import ColorThemeSwitcher from "@/components/DarkerMode/themeSwitcher";
import PricingSection from "./components/PricingCardSection";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "./components/Header";
import { Group } from '@mantine/core';
import { AppIcon } from "@/components/AppIcon";

export const Home = () => (
  <>
    <main>
      <div style={{
        paddingTop: '1rem',
        paddingBottom: '1rem',
        justifyContent: 'space-between',
        display: 'flex',
        position: 'sticky',
        zIndex: 1,
        backgroundColor: 'var(--mantine-color-body)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
        top: 0,
      }}>
        <Group ml={24}>
          <AppIcon withText="Metagallery" size={36} />
        </Group>
        <Group mr={24}>
          <Switcher />
          <ColorThemeSwitcher />
        </Group>
      </div>
      <Header />
      <PricingSection />
    </main>
    <Footer />
  </>
);
