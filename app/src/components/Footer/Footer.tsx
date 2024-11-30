import React from 'react';
import styles from './Footer.module.css';
import { useTranslation, Trans } from 'react-i18next';
import { useMantineColorScheme } from '@mantine/core';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <footer className={`${styles.footer} ${dark ? styles.darkFooter : ''}`}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={`${styles.title} ${dark ? styles.darkTitle : ''}`}>Metagallery</h3>
          <p className={`${styles.description} ${dark ? styles.darkDescription : ''}`}>
            {t('footer_description_line1')}<br />
            {t('footer_description_line2')}<br />
            {t('footer_description_line3')}
          </p>
        </div>
        <div className={styles.column}>
          <h4 className={`${styles.subtitle} ${dark ? styles.darkSubtitle : ''}`}>{t('footer_links')}</h4>
          <ul className={styles.list}>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_link1')}</a></li>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_link2')}</a></li>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_link3')}</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={`${styles.subtitle} ${dark ? styles.darkSubtitle : ''}`}>{t('footer_legal')}</h4>
          <ul className={styles.list}>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_legal1')}</a></li>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_legal2')}</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4 className={`${styles.subtitle} ${dark ? styles.darkSubtitle : ''}`}>{t('footer_socialmedia')}</h4>
          <ul className={styles.list}>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_socialmedia1')}</a></li>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_socialmedia2')}</a></li>
            <li><a href="#" className={`${styles.link} ${dark ? styles.darkLink : ''}`}>{t('footer_socialmedia3')}</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={`${styles.copyright} ${dark ? styles.darkCopyright : ''}`}>&copy; {t('footer_finalmessage')}</p>
      </div>
    </footer>
  );
};
