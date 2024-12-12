"use client";

import React, { useEffect } from 'react';
import { useDataStore } from '@/lib/store/dataStore';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const fetchData = useDataStore(state => state.fetchData);

  useEffect(() => {
    // Only fetch initial data for commonly used types
    fetchData('tracks');
  }, [fetchData]);

  return <>{children}</>;
}