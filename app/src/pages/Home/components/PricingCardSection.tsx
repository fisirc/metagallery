import PricingCard from './PricingCard';
import styles from './PricingSection.module.css';

const PricingSection = () => {
  const pricingPlans = [
    {
      title: 'Da Vinci',
      price: 'FREE',
      features: [
        '• Soporte para subir archivos 2D (PNG, JPG)',
        '• Acceso a plantillas gratuitas',
        '• Enlace para compartir tu galería',
        '• 1GB de almacenamiento',
      ],
    },
    {
      title: 'Van Gogh',
      price: 'USD 6/month',
      features: [
        '• Soporte para subir archivos 2D (PNG, JPG) y 3D (.OBJ, .FBX)',
        '• Personalización de elementos dentro de la galería',
        '• Enlace personalizable para compartir la galería',
        '• 50GB de almacenamiento',
        '• Acceso a plantillas premium',
      ],
    },
    {
      title: 'Picasso',
      price: 'USD 15/month',
      features: [
        '• Soporte para subir archivos 2D (PNG, JPG) y 3D (BLENDER, OBJ, FBX)',
        '• Personalización de elementos dentro de la galería',
        '• Enlace personalizable para compartir la galería',
        '• Almacenamiento ilimitado',
        '• Acceso a plantillas premium',
        '• Mayor visibilidad en la comunidad',
      ],
    },
  ];

  return (
    <section className={styles.pricingSection}>
      <div className={styles.imageContainer}>
        <img src="./left.png" alt="Imagen izquierda" />
      </div>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>Crea tu galería hoy mismo</h2>
        <p className={styles.description}>
          Crea tu propia galería virtual, exhibe tus obras o descubre las de otros artistas. Interactúa con una comunidad creativa, conecta con compradores interesados y transforma tu visión en una experiencia visual única
        </p>
        <div className={styles.cardContainer}>
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src="./right.png" alt="Imagen derecha" />
      </div>
    </section>
  );
};

export default PricingSection;
