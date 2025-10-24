import styles from './Header.module.css';
import Popup from './PopUp/Popup';
import popupStyles from './PopUp/Popup.module.css';
import { useState } from 'react';
import { ActionIcon, Button } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { useUser } from '@/stores/useUser';
import { useTranslation } from 'react-i18next';
import { usePopupContext } from './PopUpContext';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';

export const Header = () => {
  const { isRegisterPopupOpen, closeRegisterPopup, openRegisterPopup } = usePopupContext();
  const { t } = useTranslation();
  const [loginPopup, setLoginPopup] = useState(false);
  const [username, setUsername] = useState('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('12345');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    const user = await useUser.getState().loginWithCredentials(username, password);
    if (user) {
      setLoginPopup(false);
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
    setIsLoading(false);
  };

  const resetLoginFlow = () => {
    setLoginPopup(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newUser = await useUser.getState().register({
      username,
      password,
      email,
      displayname: 'Unknown user',
    });

    setIsLoading(false);
    if (!newUser) {
      setLoginError('Error al crear usuario');
      return;
    }
    useMetagalleryStore.getState().confetti(1000);
    closeRegisterPopup();
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Metagallery</h1>
      <a
        href="https://github.com/fisirc/metagallery"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
      >
        <IconBrandGithub size={20} />
        <span>{t('view_on_github')}</span>
      </a>
      <p className={styles.description}>{t('landing_description')}</p>
      <div className={styles.buttonGroup}>
        <Button variant="default" size="md" onClick={() => setLoginPopup(true)}>
          {t('login')}
        </Button>

        <Popup trigger={loginPopup} setTrigger={resetLoginFlow}>
          <>
            <h3 className={popupStyles.title}>Inicio de sesión</h3>
            <p className={popupStyles.description}>Descubre tu experiencia Metagallery</p>
            <form onSubmit={handleLogin}>
              <div className={popupStyles.formgroup}>
                <label className={popupStyles.label} htmlFor="username">
                  Nombre de usuario
                </label>
                <input
                  className={popupStyles.forminput}
                  id="username"
                  type="text"
                  placeholder="usuario"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={popupStyles.formgroup}>
                <label className={popupStyles.label} htmlFor="password">
                  Contraseña
                </label>
                <input
                  className={popupStyles.forminput}
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {loginError && (
                <div className={popupStyles.errorMessage}>
                  {loginError}
                </div>
              )}
              <p className={popupStyles.guestNote}>{t('guest_login_note')}</p>
              <button
                className={popupStyles.button}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
              </button>
            </form>
          </>
        </Popup>

        <Button variant="filled" size="md" onClick={openRegisterPopup}>
          {t('call_to_action')}
        </Button>

        <Popup trigger={isRegisterPopupOpen} setTrigger={closeRegisterPopup}>
          <>
            <h3 className={popupStyles.title}>Registro de usuario</h3>
            <p className={popupStyles.description}>Únete a una nueva forma de arte</p>
            <form onSubmit={handleRegister}>
              <div className={popupStyles.formgroup}>
                <label className={popupStyles.label} htmlFor="username">
                  Nombre de usuario
                </label>
                <input
                  className={popupStyles.forminput}
                  id="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={popupStyles.formgroup}>
                <label className={popupStyles.label} htmlFor="mail">
                  Correo electrónico
                </label>
                <input
                  className={popupStyles.forminput}
                  id="mail"
                  type="email"
                  placeholder="user@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={popupStyles.formgroup}>
                <label className={popupStyles.label} htmlFor="password">
                  Contraseña
                </label>
                <input
                  className={popupStyles.forminput}
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className={popupStyles.button} type="submit" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
          </>
        </Popup>
      </div>
      <p className={styles.guestNote}>{t('guest_login_note')}</p>
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
