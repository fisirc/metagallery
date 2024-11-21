import { Menu, Search, Share2 } from "lucide-react";
import styles from "./GalleryDashboard.module.css";

const galleries = [
  {
    title: "Salón cúpula",
    description: "Una colección que refleja el alma de la expresión",
    image: "/placeholder.svg",
  },
  {
    title: "Habitación de los muros",
    description: "Muros y más muros",
    image: "/placeholder.svg",
  },
  {
    title: "Salón vintage",
    description: "La colección perfecta para tu arte vintage",
    image: "/placeholder.svg",
  },
  {
    title: "Golden room",
    description: "Un espacio al estilo del golden hour",
    image: "/placeholder.svg",
  },
  {
    title: "Arte conexo",
    description: "Conectando el arte con la realidad",
    image: "/placeholder.svg",
  },
  {
    title: "Ronda de 3D",
    description: "Experiencia inmersiva en 3D",
    image: "/placeholder.svg",
  },
];

export const GalleryDashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.menuButton}>
            <Menu className={styles.menuIcon} />
            <span className={styles.srOnly}>Dashboard</span>
          </button>
          <div className={styles.headerRight}>
            <span className={styles.userName}>Van Gogh</span>
            <button className={styles.upgradeButton}>Mejora tu plan</button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.profileSection}>
          <h1 className={styles.profileName}>Rodrigo Alva</h1>
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
          {galleries.map((gallery) => (
            <div key={gallery.title} className={styles.galleryCard}>
              <img
                src={gallery.image}
                alt={gallery.title}
                className={styles.galleryImage}
              />
              <div className={styles.galleryOverlay}>
                <h2 className={styles.galleryTitle}>{gallery.title}</h2>
                <p className={styles.galleryDescription}>
                  {gallery.description}
                </p>
                <div className={styles.galleryActions}>
                  <button className={styles.openButton}>Abrir</button>
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

