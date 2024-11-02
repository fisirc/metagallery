import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme/index';
import App from './App';

import '@mantine/core/styles.css';
import './main.css';
import { MetagalleryProvider } from './providers/MetagalleryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider
    theme={theme}
    defaultColorScheme="light"
  >
    <MetagalleryProvider>
      <App />
    </MetagalleryProvider>
  </MantineProvider>
);
