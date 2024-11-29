import { useState } from 'react';
import Button from './Button';
import styles from './Header.module.css';
import Popup from './PopUp/Popup';
import popupStyles from './PopUp/Popup.module.css';
import { useUser } from '@/stores/useUser';
import { useMetagalleryStore } from '@/providers/MetagalleryProvider';
import { useTranslation, Trans } from 'react-i18next';
import { Grab } from 'lucide-react';
import ThemeSwitcher from '@/components/DarkerMode/themeSwitcher';
import { usePopupContext } from './PopUpContext';
import { useMantineColorScheme } from '@mantine/core';

export const Header = () => {
  const { isRegisterPopupOpen, closeRegisterPopup } = usePopupContext();
  const { t } = useTranslation();
  const [loginPopup, setLoginPopup] = useState(false);
  const [registerPopup, setRegisterPopup] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [registerStep, setRegisterStep] = useState(1);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

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
    setLoginStep(1);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const resetRegisterFlow = () => {
    setRegisterPopup(false);
    setRegisterStep(1);
    setUsername('');
    setEmail('');
    setPassword('');
    setAddress('');
    setPostalCode('');
    setCardNumber('');
    setCvv('');
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
      setRegisterStep(1);
      setLoginError('Error al crear usuario');
      return;
    }
    useMetagalleryStore.getState().confetti(1000);
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Metagallery</h1>
      <p className={styles.description}>
          {t('landing_description')}
      </p>
      <div className={styles.buttonGroup}>
        <Button variant="secondary" size="large" onClick={() => setLoginPopup(true)}>
          {t('login')}
        </Button>

        <Popup trigger={loginPopup} setTrigger={resetLoginFlow}>
          {loginStep === 1 ? (
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
                <button
                  className={popupStyles.button}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className={popupStyles.title}>Bienvenido de nuevo</h3>
              <p className={popupStyles.description}>Has iniciado sesión exitosamente.</p>
              <button className={popupStyles.button} onClick={resetLoginFlow}>
                Cerrar
              </button>
            </>
          )}
        </Popup>

        <Button variant="primary" size="large" onClick={() => {
          setRegisterPopup(true);
        }}>
          {t('call_to_action')}
        </Button>

        <Popup trigger={isRegisterPopupOpen} setTrigger={closeRegisterPopup}>
          {registerStep === 1 ? (
            <>
              <h3 className={popupStyles.title}>Registro de usuario</h3>
              <p className={popupStyles.description}>Únete a una nueva forma de arte</p>
              <form onSubmit={(e) => { e.preventDefault(); setRegisterStep(2); }}>
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
                    autoComplete='email'
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
                <button className={popupStyles.button} type="submit">
                  Siguiente
                </button>
              </form>
            </>
          ) : registerStep === 2 ? (
            <>
              <h3 className={popupStyles.title}>Registro de usuario</h3>
              <p className={popupStyles.description}>Completa tus datos adicionales</p>
              <form onSubmit={handleRegister}>
                <div className={popupStyles.formgroup}>
                  <label className={popupStyles.label} htmlFor="address">
                    Dirección
                  </label>
                  <input
                    className={popupStyles.forminput}
                    id="address"
                    type="text"
                    placeholder="Dirección de Domicilio"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className={popupStyles.formgroup}>
                  <label className={popupStyles.label} htmlFor="postalcode">
                    Código Postal
                  </label>
                  <input
                    className={popupStyles.forminput}
                    id="postalcode"
                    type="text"
                    placeholder="Código Postal"
                    autoComplete="postal-code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div className={popupStyles.formgroup}>
                  <label className={popupStyles.label} htmlFor="card">
                    Número de Tarjeta
                  </label>
                  <input
                    className={popupStyles.forminput}
                    id="card"
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className={popupStyles.formgroup}>
                  <label className={popupStyles.label} htmlFor="cvv">
                    CVV
                  </label>
                  <input
                    className={popupStyles.forminput}
                    id="cvv"
                    type="text"
                    placeholder="123"
                    autoComplete="cc-csc"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
                <div className={popupStyles.buttonContainer}>
                  <button
                    className={popupStyles.buttonBack}
                    type="button"
                    onClick={() => setRegisterStep(1)}
                  >
                    Atrás
                  </button>
                  <button className={popupStyles.buttonStart} type="submit" disabled={isLoading}>
                    {
                      isLoading ? 'Registrando...' : 'Comenzar'
                    }
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 className={popupStyles.title}>Bienvenido a Metagallery</h3>
              <p className={popupStyles.description}>Has creado tu cuenta exitosamente.</p>
              <button className={popupStyles.button} onClick={resetRegisterFlow}>
                Cerrar
              </button>
            </>
          )}
        </Popup>
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
