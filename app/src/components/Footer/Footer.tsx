import React from 'react';
import styles from './Footer.module.css';
import { useTranslation, Trans } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={styles.title}>Metagallery</h3>
          <p className={styles.description}>
            {t('footer_description_line1')}<br></br>
            {t('footer_description_line2')}<br></br>
            {t('footer_description_line3')}
          </p>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>{t('footer_links')}</h4>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>{t('footer_link1')}</a></li>
            <li><a href="#" className={styles.link}>{t('footer_link2')}</a></li>
            <li><a href="#" className={styles.link}>{t('footer_link3')}</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>{t('footer_legal')}</h4>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>{t('footer_legal1')}</a></li>
            <li><a href="#" className={styles.link}>{t('footer_legal2')}</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={styles.subtitle}>{t('footer_socialmedia')}</h4>
          <ul className={styles.list}>
            <li><a href="#" className={styles.link}>{t('footer_socialmedia1')}</a></li>
            <li><a href="#" className={styles.link}>{t('footer_socialmedia2')}</a></li>
            <li><a href="#" className={styles.link}>{t('footer_socialmedia3')}</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copyright}>&copy; {t('footer_finalmessage')}</p>
      </div>
    </footer>
  );
};
