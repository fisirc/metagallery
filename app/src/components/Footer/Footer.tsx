import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={styles.title}>Metagallery</h3>
          <p className={styles.description}>
            Convierte tus creaciones en una <br></br>
            experiencia visual única con<br></br>
            Metagallery.
          </p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Enlaces</h4>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>Inicio</a></li>
            <li><a href="#" className={styles.link}>Precios</a></li>
            <li><a href="#" className={styles.link}>Contacto</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Legal</h4>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>Términos de servicio</a></li>
            <li><a href="#" className={styles.link}>Política de privacidad</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>Síguenos</h4>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>Twitter</a></li>
            <li><a href="#" className={styles.link}>Facebook</a></li>
            <li><a href="#" className={styles.link}>Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copyright}>&copy; 2024 Metagallery. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
