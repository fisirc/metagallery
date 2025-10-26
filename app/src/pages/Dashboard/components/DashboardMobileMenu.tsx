import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ActionIcon } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { NewGalleryButton } from '@/components/NewGalleryButton';
import { UserButton } from '@/components/UserButton';
import styles from './DashboardMobileMenu.module.css';

export const DashboardMobileMenu = () => {
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
                <span className={styles.menuLabel}>GitHub</span>
                <ActionIcon
                  component="a"
                  href="https://github.com/fisirc/metagallery"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="default"
                  aria-label="GitHub repository"
                >
                  <IconBrandGithub size={20} />
                </ActionIcon>
              </div>
              <div className={styles.menuItem} onClick={closeMenu}>
                <span className={styles.menuLabel}>Nueva Galería</span>
                <NewGalleryButton />
              </div>
              <div className={styles.menuItem} onClick={closeMenu}>
                <span className={styles.menuLabel}>Cuenta</span>
                <UserButton />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
