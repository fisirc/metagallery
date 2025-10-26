import Switcher from './components/Switcher';
import ColorThemeSwitcher from "@/components/DarkerMode/themeSwitcher";
import PricingSection from "./components/PricingCardSection";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "./components/Header";
import { Group } from '@mantine/core';
import { AppIcon } from "@/components/AppIcon";
import { MobileMenu } from './components/MobileMenu';
import styles from './Home.module.css';

export const Home = () => (
  <>
    <main>
      <div className={styles.navbar}>
        <Group ml={24} style={{ marginLeft: 'clamp(12px, 3vw, 24px)' }}>
          <div className={styles.appIconContainer}>
            <AppIcon withText="Metagallery" size={36} />
          </div>
        </Group>
        <Group mr={24} gap={12} style={{ marginRight: 'clamp(12px, 3vw, 24px)', gap: 'clamp(8px, 2vw, 12px)' }}>
          <div className={styles.desktopMenu}>
            <Switcher />
            <ColorThemeSwitcher />
          </div>
          <MobileMenu />
        </Group>
      </div>
      <Header />
      <PricingSection />
    </main>
    <Footer />
  </>
);
