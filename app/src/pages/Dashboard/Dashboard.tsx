import { useState } from 'react';
import { Menu, Search, Share2, Plus, Layout, Edit } from "lucide-react";
import { Link, useLocation } from 'wouter';
import styles from "./GalleryDashboard.module.css";
import { UserButton } from "@/components/UserButton";
import { NewGalleryButton } from '@/components/NewGalleryButton';
import { useUser } from '@/stores/useUser';
import { useMantineTheme } from '@mantine/core';
import { LoadingScreen } from '@/components/Overlays/LoadingScreen';

import { useEffect } from 'react';

export const GalleryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useMantineTheme();
  const [, setLocation] = useLocation();
  const { user, galleries, fetchGalleries, loading } = useUser();

  useEffect(() => {
    if (user) {
      fetchGalleries();
    } else {
      setLocation('/');
    }
  }, [user, fetchGalleries, setLocation]);

  if (!user || loading) {
    return <LoadingScreen />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
        />
      )}

      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarContent}>
          <h2 className={styles.sidebarTitle}>Menú</h2>
          <nav className={styles.sidebarNav}>
            <Link href='/new/edit' className={styles.sidebarButton}>
              <Plus className={styles.sidebarIcon} />
              <span>Nueva Galería</span>
            </Link>
            <button className={styles.sidebarButton}>
              <Layout className={styles.sidebarIcon} />
              <span>Desplegar Galería</span>
            </button>
            <button className={styles.sidebarButton}>
              <Edit className={styles.sidebarIcon} />
              <span>Editar Galería</span>
            </button>
          </nav>
        </div>
      </div>

      <header className={styles.header} style={{
        backgroundColor: theme.white,
      }}>
        <div className={styles.headerContent}>
          <button
            onClick={toggleSidebar}
            className={styles.menuButton}
          >
            <Menu className={styles.menuIcon} />
            <span className={styles.srOnly}>Dashboard</span>
          </button>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
            <NewGalleryButton />
            <UserButton />
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.profileSection}>
          <h1 className={styles.profileName}>{user.displayname}</h1>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="search"
              placeholder="¿Qué estás buscando?"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filters}>
            <button className={`${styles.filterButton} ${styles.active}`}>
              Mis proyectos
            </button>
            <button className={styles.filterButton}>
              Proyectos de la comunidad
            </button>
          </div>
        </div>

        <div className={styles.galleryGrid}>
          {galleries?.map((gallery) => (
            <div key={gallery.id} className={styles.galleryCard}>
              <img
                src={gallery.thumbnail}
                alt={gallery.title}
                className={styles.galleryImage}
              />
              <div className={styles.galleryOverlay}>
                <h2 className={styles.galleryTitle}>{gallery.title}</h2>
                <p className={styles.galleryDescription}>{gallery.description}</p>
                <div className={styles.galleryActions}>
                  <Link href={`/${gallery.slug}/edit`} className={styles.openButton}>
                    Abrir
                  </Link>
                  <button className={styles.shareButton}>
                    <Share2 className={styles.shareIcon} />
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}