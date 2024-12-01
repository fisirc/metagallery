import { Button } from '@mantine/core';
import { usePopupContext } from './PopUpContext';
import styles from './PricingCard.module.css';
import { useTranslation } from 'react-i18next';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
}

const PricingCard = ({ title, price, features }: PricingCardProps) => {
  const { openRegisterPopup } = usePopupContext();
  const { t } = useTranslation();

  return (
    <div className={`${styles.card}`}>
      <h3 className={`${styles.title}`}>{title}</h3>
      <p className={`${styles.price}`}>{price}</p>
      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li key={index} className={`${styles.feature}`}>{feature}</li>
        ))}
      </ul>
      <Button variant="primary" className={`${styles.button}`} onClick={openRegisterPopup}>
        {t('call_to_action')}
      </Button>
    </div>
  );
};

export default PricingCard;
