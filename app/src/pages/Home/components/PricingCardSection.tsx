import PricingCard from './PricingCard';
import styles from './PricingSection.module.css';
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const { t } = useTranslation();
  const pricingPlans = [
    {
      title: t('davinci_title'),
      price: t('davinci_price'),
      features: [
        t('davinci_feature1'),
        t('davinci_feature2'),
        t('davinci_feature3'),
        t('davinci_feature4'),
      ]
    },
    {
      title: t('vangogh_title'),
      price: t('vangogh_price'),
      features: [
        t('vangogh_feature1'),
        t('vangogh_feature2'),
        t('vangogh_feature3'),
        t('vangogh_feature4'),
        t('vangogh_feature5'),
      ],
    },
    {
      title: t('picasso_title'),
      price: t('picasso_price'),
      features: [
        t('picasso_feature1'),
        t('picasso_feature2'),
        t('picasso_feature3'),
        t('picasso_feature4'),
        t('picasso_feature5'),
        t('picasso_feature6'),
      ],
    },
  ];

  return (
    <section className={styles.pricingSection}>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>
          {t('pricing_title')}
        </h2>
        <p className={styles.description}>
          {t('pricing_description')}
        </p>
        <div className={styles.cardContainer}>
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
