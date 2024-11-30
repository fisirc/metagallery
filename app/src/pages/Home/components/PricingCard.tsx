import { useMantineColorScheme } from '@mantine/core';
import Button from './Button';
import { usePopupContext } from './PopUpContext';
import styles from './PricingCard.module.css';
import { useTranslation, Trans } from 'react-i18next';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
}

const PricingCard = ({ title, price, features }: PricingCardProps) => {
  const { openRegisterPopup } = usePopupContext();
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <div className={`${styles.card} ${dark ? styles.darkCard : ''}`}>
      <h3 className={`${styles.title} ${dark ? styles.darkTitle : ''}`}>{title}</h3>
      <p className={`${styles.price} ${dark ? styles.darkPrice : ''}`}>{price}</p>
      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li key={index} className={`${styles.feature} ${dark ? styles.darkFeature : ''}`}>{feature}</li>
        ))}
      </ul>
      <Button variant="primary" className={`${styles.button} ${dark ? styles.darkButton : ''}`} onClick={openRegisterPopup}>
        {t('call_to_action')}
      </Button>
    </div>
  );
};

export default PricingCard;

