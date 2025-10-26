import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Switcher from './Switcher';
import ColorThemeSwitcher from '@/components/DarkerMode/themeSwitcher';
import styles from './MobileMenu.module.css';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} />
          <div className={styles.menuPanel}>
            <div className={styles.menuContent}>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>Language</span>
                <Switcher />
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuLabel}>Theme</span>
                <ColorThemeSwitcher />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
