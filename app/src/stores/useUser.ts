import { TOKEN_LC_KEY } from '@/constants';
import { create } from 'zustand';

type MetagalleryUser = {
  id: number;
  username: string;
  tierId: number;
  displayname: string;
  mail: string;
};

/**
 * Represents the state of the editor and the global actions that can be performed.
 * There is no 'dragging' state. Use {draggingFile != null} instead.
 */
interface MetagalleryUserState {
  // Represents a sidebar element being dragged.
  user: MetagalleryUser | null,
  token: string | null,
  loading: boolean,
  loginWithCredentials: (username: string, password: string) => Promise<MetagalleryUser | null>,
  loginWithToken: (token: string) => Promise<MetagalleryUser | null>,
  logout: () => void,
}

const token = window.localStorage.getItem(TOKEN_LC_KEY);

export const useUser = create<MetagalleryUserState>()(
  (set, get) => ({
    user: null,
    token: token,
    loading: Boolean(token), // No loading if no token
    loginWithCredentials: async (username, password) => {
      try {
        const response = await fetch('https://pandadiestro.xyz/services/stiller/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, pwd: password }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json() as {
          token: string,
          userdata: MetagalleryUser,
        };

        console.log({ data });
        window.localStorage.setItem(TOKEN_LC_KEY, data.token);

        set({ user: data.userdata, token: data.token, loading: false });
        return data.userdata;
      } catch (e) {
        console.error('Failed to log in:', e);
        get().logout();
        return null;
      }
    },
    loginWithToken: async (token) => {
      try {
        const response = await fetch('https://pandadiestro.xyz/services/stiller/auth/profile/', {
          headers: {
            'Content-Type': 'application/json',
            'token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const user = await response.json() as MetagalleryUser;

        window.localStorage.setItem(TOKEN_LC_KEY, token);
        set({ user: user, token: token, loading: false });
        return user;
      } catch (e) {
        get().logout();
        console.error('Failed to log in:', e);
        return null;
      }
    },
    logout() {
      window.localStorage.removeItem(TOKEN_LC_KEY);
      set({ user: null, loading: false, token: null });
    },
  }),
);
