import ReactDOM from 'react-dom/client';
import './i18n.js';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme/theme';
import App from './App';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './main.css';
import { MetagalleryProvider } from './providers/MetagalleryProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider
      theme={theme}
      defaultColorScheme="light"
    >
      <MetagalleryProvider>
        <App />
        <Notifications />
      </MetagalleryProvider>
    </MantineProvider>
  </QueryClientProvider>
);
