import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import publicSettingsService from '@/services/publicSettingsService';
import type { PublicSiteSettingsResponse } from '@/types/api';

interface PublicSettingsContextType {
  settings: PublicSiteSettingsResponse | undefined;
  isLoading: boolean;
}

const PublicSettingsContext = createContext<PublicSettingsContextType>({
  settings: undefined,
  isLoading: true,
});

export const usePublicSettings = () => useContext(PublicSettingsContext);

export function PublicSettingsProvider({ children }: { children: ReactNode }) {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: publicSettingsService.getPublicSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Dynamically update document head
  useEffect(() => {
    if (settings) {
      if (settings.defaultMetaTitle) {
        document.title = settings.defaultMetaTitle;
      }
      if (settings.defaultMetaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', settings.defaultMetaDescription);
      }
      if (settings.faviconUrl) {
        let linkFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!linkFavicon) {
          linkFavicon = document.createElement('link');
          linkFavicon.setAttribute('rel', 'icon');
          document.head.appendChild(linkFavicon);
        }
        linkFavicon.setAttribute('href', settings.faviconUrl);
      }
    }
  }, [settings]);

  return (
    <PublicSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </PublicSettingsContext.Provider>
  );
}
