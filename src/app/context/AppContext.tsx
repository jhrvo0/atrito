import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Atrito, Opportunity, AtritoInvestigationContext } from '../types';
import {
  loadAtritos,
  saveAtritos,
  loadOpportunities,
  saveOpportunities,
  loadInvestigationContexts,
  saveInvestigationContexts,
} from '../utils/storage';

interface AppContextType {
  atritos: Atrito[];
  opportunities: Opportunity[];
  investigationContexts: AtritoInvestigationContext[];
  addAtrito: (atrito: Atrito) => void;
  updateAtrito: (id: string, atrito: Partial<Atrito>) => void;
  deleteAtrito: (id: string) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  addInvestigationContext: (context: AtritoInvestigationContext) => void;
  updateInvestigationContext: (id: string, context: Partial<AtritoInvestigationContext>) => void;
  deleteInvestigationContext: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [atritos, setAtritos] = useState<Atrito[]>(() => loadAtritos());
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => loadOpportunities());
  const [investigationContexts, setInvestigationContexts] = useState<AtritoInvestigationContext[]>(
    () => loadInvestigationContexts()
  );

  useEffect(() => {
    saveAtritos(atritos);
  }, [atritos]);

  useEffect(() => {
    saveOpportunities(opportunities);
  }, [opportunities]);

  useEffect(() => {
    saveInvestigationContexts(investigationContexts);
  }, [investigationContexts]);

  const addAtrito = (atrito: Atrito) => {
    setAtritos((prev) => [atrito, ...prev]);
  };

  const updateAtrito = (id: string, updates: Partial<Atrito>) => {
    setAtritos((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAtrito = (id: string) => {
    setAtritos((prev) => prev.filter((a) => a.id !== id));
    setInvestigationContexts((prev) => prev.filter((c) => c.atritoId !== id));
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

  const addInvestigationContext = (context: AtritoInvestigationContext) => {
    setInvestigationContexts((prev) => {
      const index = prev.findIndex((c) => c.atritoId === context.atritoId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...context, updatedAt: new Date().toISOString() };
        return updated;
      }
      return [context, ...prev];
    });
  };

  const updateInvestigationContext = (id: string, updates: Partial<AtritoInvestigationContext>) => {
    setInvestigationContexts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteInvestigationContext = (id: string) => {
    setInvestigationContexts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        atritos,
        opportunities,
        investigationContexts,
        addAtrito,
        updateAtrito,
        deleteAtrito,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        addInvestigationContext,
        updateInvestigationContext,
        deleteInvestigationContext,
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
