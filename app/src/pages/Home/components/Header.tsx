import Button from './Button';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Metagallery</h1>
      <p className={styles.description}>
        Crea tu propia galería virtual, exhibe tus obras o descubre las de otros artistas. Interactúa con una comunidad creativa, conecta con compradores interesados y transforma tu visión en una experiencia visual única. ¡Únete y lleva tus creaciones a un nuevo nivel de interacción!
      </p>
      <div className={styles.buttonGroup}>
        <Button variant="secondary" size="large">Iniciar sesión</Button>
        <Button variant="primary" size="large">Comienza ahora</Button>
      </div>
      <div className={styles.imageContainer}>
        <img
          src="/galleryspace.png"
          alt="Espacio de galería con obras de arte"
          className={styles.image}
        />
      </div>
    </header>
  );
};