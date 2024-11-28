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
  register: ({
    username,
    password,
    email,
    displayname,
  }: {
    username: string,
    password: string,
    email: string,
    displayname: string
  }) => Promise<MetagalleryUser | null>,
  logout: () => void,
  galleries: Array<{ id: number; title: string; description: string, slug: string, templateid: number, thumbnail: string }> | null;
  fetchUserGalleries: () => Promise<void>;
  fetchCommunityGalleries: () => Promise<Array<{ ownerid: number; title: string; thumbnail: string, slug: string }>>;
}

const token = window.localStorage.getItem(TOKEN_LC_KEY);

export const useUser = create<MetagalleryUserState>()(
  (set, get) => ({
    user: null,
    token: token,
    loading: Boolean(token), // No loading if no token
    galleries: null,
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
    register: async ({ username, password, email, displayname }) => {
      try {
        const response = await fetch('https://pandadiestro.xyz/services/stiller/auth/newuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tier_id: 0,
            username,
            // displayname: displayname,
            mail: email,
            pwd: password,
          }),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to register: ${errorDetails}`);
        }

        const data = await response.json() as {
          token: string,
          userdata: MetagalleryUser,
        };
        return get().loginWithToken(data.token);
      } catch (e) {
        get().logout();
        console.error('Failed to register:', e);
        return null;
      }
    },
    logout() {
      window.localStorage.removeItem(TOKEN_LC_KEY);
      set({ user: null, loading: false, token: null });
    },
    fetchUserGalleries: async () => {
      try {
        const { token } = get();
        if (!token) throw new Error('No token available');
        const galleryResponse = await fetch('https://pandadiestro.xyz/services/stiller/gallery', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        });
        if (!galleryResponse.ok) throw new Error('Failed to fetch galleries');
        const galleries = await galleryResponse.json();
        const galleriesWithThumbnails = await Promise.all(
          galleries.map(async (gallery: any) => {
            try {
              const thumbnailResponse = await fetch(
                `https://pandadiestro.xyz/services/stiller/template/info/${gallery.templateid}/thumbnail`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    token,
                  },
                }
              );

              if (!thumbnailResponse.ok) {
                console.warn(`Failed to fetch thumbnail for template ID ${gallery.templateid}`);
                return { ...gallery, thumbnail: '/assets/examples/thumbnail.png' };
              }

              const blob = await thumbnailResponse.blob();
              const thumbnail = URL.createObjectURL(blob);
              return { ...gallery, thumbnail };

            } catch (error) {
              console.error(`Error fetching thumbnail for template ID ${gallery.templateid}:`, error);
              return { ...gallery, thumbnail: '/assets/examples/thumbnail.png' };
            }
          })
        );

        set({ galleries: galleriesWithThumbnails });
      } catch (error) {
        console.error('Error fetching galleries:', error);
        set({ galleries: null });
      }
    },
    fetchCommunityGalleries: async () => {
      try {
        const { token } = get();
        if (!token) throw new Error('No token available');

        const response = await fetch('https://pandadiestro.xyz/services/stiller/galleryall', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch community galleries');

        const galleries = await response.json();

        const communityGalleriesWithThumbnails = await Promise.all(
          galleries.map(async (gallery: any) => {
            try {
              const thumbnailResponse = await fetch(
                `https://pandadiestro.xyz/services/stiller/template/info/${gallery.templateid}/thumbnail`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    token,
                  },
                }
              );
              if (!thumbnailResponse.ok) {
                console.warn(`Failed to fetch thumbnail for template ID ${gallery.templateid}`);
                return { ...gallery, thumbnail: '/assets/examples/thumbnail.png' };
              }

              const blob = await thumbnailResponse.blob();
              const thumbnail = URL.createObjectURL(blob);

              return { ownerid: gallery.ownerid, title: gallery.title, thumbnail, slug: gallery.slug };
            } catch (error) {
              console.error(`Error fetching thumbnail for template ID ${gallery.templateid}:`, error);
              return { ownerid: gallery.ownerid, title: gallery.title, thumbnail: '/assets/examples/thumbnail.png' };
            }
          })
        );

        return communityGalleriesWithThumbnails;
      } catch (error) {
        console.error('Error fetching community galleries:', error);
        return [];
      }
    },
  }),
);
