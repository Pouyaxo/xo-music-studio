import { useEffect } from 'react';
import { useDataStore } from '@/lib/store/dataStore';

export function useLicenses() {
  const licenses = useDataStore(state => state.licenses);
  const fetchLicenses = useDataStore(state => state.fetchLicenses);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  return licenses;
} 