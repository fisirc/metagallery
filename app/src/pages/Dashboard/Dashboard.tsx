import { useEffect, useState } from "react";
import { Menu, Search, Plus, Copy, Check, Trash, SkipBack, ChevronLeft } from "lucide-react";
import { Link, Route } from "wouter";
import { Box, Button, Loader, Modal, ScrollArea, Text, Title } from "@mantine/core";
import { NewGalleryForm } from "@/pages/Dashboard/components/NewGalleryForm";
import { useUser } from "@/stores/useUser";
import styles from "./GalleryDashboard.module.css";
import { LoadingScreen } from "@/components/Overlays/LoadingScreen";
import Popup from "@/pages/Home/components/PopUp/Popup";
import popupStyles from "@/pages/Home/components/PopUp/Popup.module.css";
import { NewGalleryButton } from "@/components/NewGalleryButton";
import { UserButton } from "@/components/UserButton";
import { useApi } from "@/hooks/useApi";
import { StillerGallery } from "@/types";
import { thumbnailSrcFromTemplateId } from "@/utils";
import { set } from "zod";

export const TrashView = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [currentGallerySlug, setCurrentGallerySlug] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletedGalleries, setDeletedGalleries] = useState<StillerGallery[]>([]);
  const { user, loading } = useUser();
  const [selectedGallery, setSelectedGallery] = useState<StillerGallery | null>(null);


  const { response: initialUserGalleries, isLoading: galleryLoading } = useApi<StillerGallery[]>('/gallery');

  useEffect(() => {
    if (initialUserGalleries?.data) {
      setDeletedGalleries(initialUserGalleries.data);
    }
  }, [initialUserGalleries]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRestoreGallery = (gallery: StillerGallery) => {
    const updatedDeletedGalleries = deletedGalleries.filter(g => g.id !== gallery.id);
    setDeletedGalleries(updatedDeletedGalleries);
  };

  const handlePermanentDelete = (gallery: StillerGallery) => {
    const updatedDeletedGalleries = deletedGalleries.filter(g => g.id !== gallery.id);
    setDeletedGalleries(updatedDeletedGalleries);
  };

  if (!user || loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollArea className={styles.container}>
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
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
            <button onClick={() => window.location.href = "/"} className={styles.sidebarButton}>
              <ChevronLeft className={styles.sidebarIcon} />
              <span>Volver al Dashboard</span>
            </button>
          </nav>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={toggleSidebar} className={styles.menuButton}>
            <Menu className={styles.menuIcon} />
            <span className={styles.srOnly}>Papelera</span>
          </button>
          <div style={{ display: 'flex', gap: '24px' }}>
            <NewGalleryButton />
            <UserButton />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.profileSection}>
          <h1 className={styles.profileName}>Papelera</h1>
          <p className={styles.profileDescription}>Galerías eliminadas (se borrarán en 30 días)</p>
        </div>

        {galleryLoading && (
          <Box mt={72} display={'flex'} style={{ justifyContent: 'center' }}>
            <Loader size={30} />
          </Box>
        )}

        {deletedGalleries.length === 0 && (
          <Box mt={72} display={'flex'} style={{ alignItems: 'center', flexDirection: 'column', gap: 18 }}>
            <Title order={5}>No hay galerías en la papelera 🗑️</Title>
          </Box>
        )}

        <div className={styles.galleryGrid}>
          {deletedGalleries.map((gallery) => (
            <div
              key={gallery.id}
              className={styles.galleryCard}
            >
              <img
                src={thumbnailSrcFromTemplateId(gallery.templateid)}
                alt={gallery.title}
                className={styles.galleryImage}
              />
              <div className={styles.galleryOverlay}>
                <h2 className={styles.galleryTitle}>{gallery.title}</h2>
                <p className={styles.galleryDescription}>
                  {gallery.description}
                </p>
                <div className={styles.galleryActions}>
                <button
                    onClick={() => handleRestoreGallery(gallery)}
                    className={styles.openButton}
                    aria-label="Restaurar"
                  >
                    <SkipBack size={16} /> Restaurar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGallery(gallery);
                      setDeletePopupOpen(true);
                    }}
                    className={styles.shareButton}
                    aria-label="Eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <DeleteGalleryPopUp
        trigger={deletePopupOpen}
        setTrigger={setDeletePopupOpen}
        onConfirm={() => {
          if (selectedGallery) {
            const updatedDeletedGalleries = deletedGalleries.filter(g => g.id !== selectedGallery.id);
            setDeletedGalleries(updatedDeletedGalleries);
            setSelectedGallery(null);
          }
        }}
      />

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
          overflow: 'hidden',
        }}
      >
        <NewGalleryForm modalKey={'new-gallery-modal'} />
      </Modal>
    </ScrollArea>
  );
};

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

const DeleteGalleryPopUp = ({
  trigger,
  setTrigger,
  onConfirm,
}: {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  onConfirm: () => void;
}) => {
  return (
    <Popup trigger={trigger} setTrigger={() => setTrigger(false)}>
      <h4 className={popupStyles.title}>¿Quieres borrar esta galería?</h4>
      <p className={popupStyles.description}>
        Será enviada a la papelera, donde permanecerá por 30 días.
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "20px" }}>
        <button
          className={popupStyles.button}
          onClick={() => window.location.href = "/trash"}
        >
          Sí
        </button>
        <button className={popupStyles.button} onClick={() => setTrigger(false)}>
          No
        </button>
      </div>
    </Popup>
  );
};


export const GalleryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [currentGallerySlug, setCurrentGallerySlug] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCommunityProjects, setShowCommunityProjects] = useState(false);
  const { user, loading } = useUser();

  const { response: userGalleries, isLoading: galleryLoading } = useApi<StillerGallery[]>('/gallery');
  const { response: communityGalleries, isLoading: galleryallLoading } = useApi<StillerGallery[]>('/galleryall');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleShareGallery = (gallerySlug: string) => {
    setCurrentGallerySlug(gallerySlug);
    setSharePopupOpen(true);
  };

  const handleDeleteGallery = () => {
    setDeletePopupOpen(true);
  };

  if (!user || loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollArea className={styles.container}>
      <Route path="/dashboard">
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
        />
      )}
      <div
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
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
            <button onClick={() => window.location.href = "/trash"} className={styles.sidebarButton}>
                <Trash className={styles.sidebarIcon} />
                <span>Papelera</span>
              </button>
          </nav>
        </div>
      </div>

      <header
        className={styles.header}
      >
        <div className={styles.headerContent}>
          <button onClick={toggleSidebar} className={styles.menuButton}>
            <Menu className={styles.menuIcon} />
            <span className={styles.srOnly}>Dashboard</span>
          </button>
          <div style={{ display: 'flex', gap: '24px' }}>
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
            <Button
              variant={showCommunityProjects ? 'light' : 'default'}
              className={`${styles.filterButton} ${!showCommunityProjects ? styles.active : ''}`}
              onClick={() => setShowCommunityProjects(false)}
            >
              Mis proyectos
            </Button>
            <Button
              variant={showCommunityProjects ? 'default' : 'light'}
              className={`${styles.filterButton} ${showCommunityProjects ? styles.active : ''}`}
              onClick={() => setShowCommunityProjects(true)}
            >
              Proyectos de la comunidad
            </Button>
          </div>
        </div>
        {
          (galleryLoading || galleryallLoading) && (
            <Box mt={72} display={'flex'} style={{ justifyContent: 'center' }}>
              <Loader size={30} />
            </Box>
          )
        }
        {
          (showCommunityProjects && communityGalleries && communityGalleries.data.length === 0) && (
            <Box mt={72} display={'flex'} style={{ justifyContent: 'center' }}>
              <p>No hay proyectos de la comunidad</p>
            </Box>
          )
        }
        {
          (!showCommunityProjects && userGalleries && userGalleries.data.length === 0) && (
            <Box mt={72} display={'flex'} style={{ alignItems: 'center', flexDirection: 'column', gap: 18 }}>
              <Title order={5}>Aquí aparecerán tus proyectos 🖼️</Title>
              <Text td="underline" c={'orange'} style={{ cursor: 'pointer' }} onClick={() => {
                setIsModalOpen(true);
              }}>Crea tu primera galería</Text>
            </Box>
          )
        }
        <div className={styles.galleryGrid}>
          {showCommunityProjects
            ? communityGalleries && communityGalleries.data.map((gallery, index) => (
              <div
                key={index}
                className={styles.galleryCard}
              >
                <img
                  src={thumbnailSrcFromTemplateId(gallery.templateid)}
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
                      href={`https://metagallery.pages.dev/${gallery.slug}`}
                      className={styles.openButton}
                    >
                      Visitar
                    </Link>
                  </div>
                </div>
              </div>
            ))
            : userGalleries && userGalleries.data.map((gallery) => (
              <div
                key={gallery.id}
                className={styles.galleryCard}
              >
                <img
                  src={thumbnailSrcFromTemplateId(gallery.templateid)}
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
                    <button
                      onClick={() => handleDeleteGallery()}
                      className={styles.deleteButton}
                      aria-label="Delete gallery">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
      </Route>

      <Route path="/trash">
        <TrashView />
      </Route>

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
          overflow: 'hidden',
        }}
      >
        <NewGalleryForm modalKey={'new-gallery-modal'} />
      </Modal>

      <ShareGalleryPopup
        trigger={sharePopupOpen}
        setTrigger={setSharePopupOpen}
        gallerySlug={currentGallerySlug}
      />
      <DeleteGalleryPopUp
        trigger={deletePopupOpen}
        setTrigger={setDeletePopupOpen}
        onConfirm={() => {
          // ...
        }}
      />
    </ScrollArea>
  );
};
