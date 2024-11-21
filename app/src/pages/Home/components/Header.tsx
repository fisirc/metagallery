import { useState } from 'react';
import Button from './Button';
import styles from './Header.module.css';
import Popup from './PopUp/Popup';
import popupStyles from './PopUp/Popup.module.css';

export const Header = () => {
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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/services/stiller/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pwd: password }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(errorDetails || 'Failed to log in');
      }

      const token = await response.text();
      console.log('Login successful. Token:', token);

      localStorage.setItem('authToken', token);
    } catch (error: any) {
      console.error('Login error details:', error);
    }

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

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Metagallery</h1>
      <p className={styles.description}>
        Crea tu propia galería virtual, exhibe tus obras o descubre las de otros artistas. Interactúa con una comunidad creativa, conecta con compradores interesados y transforma tu visión en una experiencia visual única. ¡Únete y lleva tus creaciones a un nuevo nivel de interacción!
      </p>
      <div className={styles.buttonGroup}>
        <Button variant="secondary" size="large" onClick={() => setLoginPopup(true)}>Iniciar sesión</Button>

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
                    placeholder="Nombre de usuario"
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

        <Button variant="primary" size="large" onClick={() => setRegisterPopup(true)}>Comienza ahora</Button>

        <Popup trigger={registerPopup} setTrigger={resetRegisterFlow}>
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
              <form onSubmit={(e) => {
                e.preventDefault();
                setRegisterStep(3);
              }}>
                <div className={popupStyles.formgroup}>
                  <label className={popupStyles.label} htmlFor="address">
                    Dirección
                  </label>
                  <input
                    className={popupStyles.forminput}
                    id="address"
                    type="text"
                    placeholder="Dirección de Domicilio"
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
                  <button className={popupStyles.buttonStart} type="submit">
                    Comenzar
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
