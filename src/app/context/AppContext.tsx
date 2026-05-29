import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Atrito, Opportunity } from '../types';
import { loadAtritos, saveAtritos, loadOpportunities, saveOpportunities } from '../utils/storage';

interface AppContextType {
  atritos: Atrito[];
  opportunities: Opportunity[];
  addAtrito: (atrito: Atrito) => void;
  updateAtrito: (id: string, atrito: Partial<Atrito>) => void;
  deleteAtrito: (id: string) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [atritos, setAtritos] = useState<Atrito[]>(() => loadAtritos());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => loadOpportunities());

  useEffect(() => {
    saveAtritos(atritos);
  }, [atritos]);

  useEffect(() => {
    saveOpportunities(opportunities);
  }, [opportunities]);

  const addAtrito = (atrito: Atrito) => {
    setAtritos((prev) => [atrito, ...prev]);
  };

  const updateAtrito = (id: string, updates: Partial<Atrito>) => {
    setAtritos((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAtrito = (id: string) => {
    setAtritos((prev) => prev.filter((a) => a.id !== id));
  };

  const addOpportunity = (opportunity: Opportunity) => {
    setOpportunities((prev) => [opportunity, ...prev]);
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        atritos,
        opportunities,
        addAtrito,
        updateAtrito,
        deleteAtrito,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
