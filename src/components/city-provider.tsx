'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getStoredCity, setStoredCity, type CityPreference } from '@/lib/city-detection';

interface CityContextValue {
  city: CityPreference | null;
  setCity: (c: CityPreference) => void;
  loading: boolean;
}

const CityContext = createContext<CityContextValue>({
  city: null,
  setCity: () => {},
  loading: true,
});

export function useCurrentCity() {
  return useContext(CityContext);
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<CityPreference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredCity();
    if (stored) {
      setCityState(stored);
      setLoading(false);
      return;
    }

    fetch('/api/city/detect')
      .then(r => r.json())
      .then((data: CityPreference) => {
        setCityState(data);
        setStoredCity(data);
      })
      .catch(() => {
        setCityState({ slug: 'shanghai', name: '上海市' });
      })
      .finally(() => setLoading(false));
  }, []);

  function setCity(c: CityPreference) {
    setCityState(c);
    setStoredCity(c);
  }

  return (
    <CityContext.Provider value={{ city, setCity, loading }}>
      {children}
    </CityContext.Provider>
  );
}
