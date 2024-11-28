import { useState, useEffect } from "react";
import { Menu, Search, Plus, Layout, Edit, Copy, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Modal, useMantineTheme } from "@mantine/core";
import { NewGalleryForm } from "@/pages/Dashboard/components/NewGalleryForm";
import { useUser } from "@/stores/useUser";
import styles from "./GalleryDashboard.module.css";
import { LoadingScreen } from "@/components/Overlays/LoadingScreen";
import Popup from "@/pages/Home/components/PopUp/Popup";
import popupStyles from "@/pages/Home/components/PopUp/Popup.module.css";
import { NewGalleryButton } from "@/components/NewGalleryButton";
import { UserButton } from "@/components/UserButton";

const ShareGalleryPopup = ({
  trigger,
  setTrigger,
  gallerySlug,
}: {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  gallerySlug: string;
}) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://metagallery.pages.dev/${gallerySlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetPopup = () => {
    setTrigger(false);
    setCopied(false);
  };

  return (
    <Popup trigger={trigger} setTrigger={resetPopup}>
      <h3 className={popupStyles.title}>Compartir Galería</h3>
      <p className={popupStyles.description}>
        Comparte el enlace de tu galería con otros
      </p>
      <div className={popupStyles.formgroup} style={{ position: "relative" }}>
        <label className={popupStyles.label} htmlFor="galleryLink">
          Enlace de la Galería
        </label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            id="galleryLink"
            className={popupStyles.forminput}
            type="text"
            value={shareLink}
            readOnly
            style={{ paddingRight: "40px", fontSize: "14px" }}
          />
          <button
            onClick={handleCopyLink}
            style={{
              position: "absolute",
              right: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {copied ? <Check color="green" size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>
      <button className={popupStyles.button} onClick={resetPopup}>
        Cerrar
      </button>
    </Popup>
  );
};

export const GalleryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [currentGallerySlug, setCurrentGallerySlug] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityGalleries, setCommunityGalleries] = useState<
    Array<{ ownerid: number; title: string; thumbnail: string, slug: string }>
  >([]);
  const [showCommunityProjects, setShowCommunityProjects] = useState(false);
  const theme = useMantineTheme();
  const [, setLocation] = useLocation();
  const {
    user,
    galleries,
    fetchUserGalleries: fetchGalleries,
    fetchCommunityGalleries,
    loading,
  } = useUser();

  useEffect(() => {
    if (user) {
      fetchGalleries();
    } else {
      setLocation("/");
    }
  }, [user, fetchGalleries, setLocation]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleShareGallery = (gallerySlug: string) => {
    setCurrentGallerySlug(gallerySlug);
    setSharePopupOpen(true);
  };

  const loadCommunityProjects = async () => {
    try {
      const communityGalleries = await fetchCommunityGalleries();
      setCommunityGalleries(communityGalleries);
      setShowCommunityProjects(true);
    } catch (error) {
      console.error("Error loading community galleries:", error);
    }
  };

  if (!user || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.container}>
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar} />
      )}
      <div
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarContent}>
          <h2 className={styles.sidebarTitle}>Menú</h2>
          <nav className={styles.sidebarNav}>
            <button
              className={styles.sidebarButton}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className={styles.sidebarIcon} />
              <span>Nueva Galería</span>
            </button>
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

      <header className={styles.header} style={{ backgroundColor: theme.white }}>
        <div className={styles.headerContent}>
          <button onClick={toggleSidebar} className={styles.menuButton}>
            <Menu className={styles.menuIcon} />
            <span className={styles.srOnly}>Dashboard</span>
          </button>
          <div style={{ display: "flex", gap: "24px" }}>
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
            <button
              className={`${styles.filterButton} ${
                !showCommunityProjects ? styles.active : ""
              }`}
              onClick={() => setShowCommunityProjects(false)}
            >
              Mis proyectos
            </button>
            <button
              className={`${styles.filterButton} ${
                showCommunityProjects ? styles.active : ""
              }`}
              onClick={loadCommunityProjects}
            >
              Proyectos de la comunidad
            </button>
          </div>
        </div>

        <div className={styles.galleryGrid}>
          {showCommunityProjects
            ? communityGalleries.map((gallery, index) => (
                <div key={index} className={styles.galleryCard}>
                  <img
                    src={gallery.thumbnail}
                    alt={gallery.title}
                    className={styles.galleryImage}
                  />
                  <div className={styles.galleryOverlay}>
                    <h2 className={styles.galleryTitle}>{gallery.title}</h2>
                    <p className={styles.galleryDescription}>
                      Creador: {gallery.ownerid}
                    </p>
                    <div className={styles.galleryActions}>
                      <Link
                        href={`/${gallery.slug}`}
                        className={styles.openButton}
                      >
                        Visitar
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            : galleries?.map((gallery) => (
                <div key={gallery.id} className={styles.galleryCard}>
                  <img
                    src={gallery.thumbnail}
                    alt={gallery.title}
                    className={styles.galleryImage}
                  />
                  <div className={styles.galleryOverlay}>
                    <h2 className={styles.galleryTitle}>{gallery.title}</h2>
                    <p className={styles.galleryDescription}>
                      {gallery.description}
                    </p>
                    <div className={styles.galleryActions}>
                      <Link
                        href={`/${gallery.slug}/edit`}
                        className={styles.openButton}
                      >
                        Abrir
                      </Link>
                      <button
                        onClick={() => handleShareGallery(gallery.slug)}
                        className={styles.shareButton}
                      >
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </main>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        withCloseButton={false}
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        style={{
          overflow: "hidden",
        }}
      >
        <NewGalleryForm modalKey={"new-gallery-modal"} />
      </Modal>

      <ShareGalleryPopup
        trigger={sharePopupOpen}
        setTrigger={setSharePopupOpen}
        gallerySlug={currentGallerySlug}
      />
    </div>
  );
};
