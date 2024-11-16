import Button from './Button';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
}

const PricingCard = ({ title, price, features }: PricingCardProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.price}>{price}</p>
      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li key={index} className={styles.feature}>{feature}</li>
        ))}
      </ul>
      <Button variant="primary" className={styles.button}>Comienza ahora</Button>
    </div>
  );
};

export default PricingCard;
