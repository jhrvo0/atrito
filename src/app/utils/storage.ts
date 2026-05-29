import { Atrito, Opportunity, AtritoInvestigationContext } from '../types';

const ATRITOS_KEY = 'atrito-atritos';
const OPPORTUNITIES_KEY = 'atrito-opportunities';
const FILTERS_KEY = 'atrito-filters';
const OPPORTUNITY_FILTERS_KEY = 'atrito-opportunity-filters';
const INVESTIGATION_CONTEXTS_KEY = 'atrito-investigation-contexts';

export interface FiltersState {
  searchTerm: string;
  contextFilter: string;
  intensityFilter: string;
  frequencyFilter: string;
  statusFilter: string;
}

export interface OpportunityFiltersState {
  searchTerm: string;
  statusFilter: string;
  priorityFilter: string;
}

export function loadAtritos(): Atrito[] {
  try {
    const data = localStorage.getItem(ATRITOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAtritos(atritos: Atrito[]): void {
  localStorage.setItem(ATRITOS_KEY, JSON.stringify(atritos));
}

export function loadOpportunities(): Opportunity[] {
  try {
    const data = localStorage.getItem(OPPORTUNITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveOpportunities(opportunities: Opportunity[]): void {
  localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities));
}

export function loadFilters(): FiltersState {
  try {
    const data = localStorage.getItem(FILTERS_KEY);
    return data ? JSON.parse(data) : {
      searchTerm: '',
      contextFilter: '',
      intensityFilter: '',
      frequencyFilter: '',
      statusFilter: '',
    };
  } catch {
    return {
      searchTerm: '',
      contextFilter: '',
      intensityFilter: '',
      frequencyFilter: '',
      statusFilter: '',
    };
  }
}

export function saveFilters(filters: FiltersState): void {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

const defaultOpportunityFilters: OpportunityFiltersState = {
  searchTerm: '',
  statusFilter: '',
  priorityFilter: '',
};

export function loadOpportunityFilters(): OpportunityFiltersState {
  try {
    const data = localStorage.getItem(OPPORTUNITY_FILTERS_KEY);
    return data ? JSON.parse(data) : defaultOpportunityFilters;
  } catch {
    return defaultOpportunityFilters;
  }
}

export function saveOpportunityFilters(filters: OpportunityFiltersState): void {
  localStorage.setItem(OPPORTUNITY_FILTERS_KEY, JSON.stringify(filters));
}

export function loadInvestigationContexts(): AtritoInvestigationContext[] {
  try {
    const data = localStorage.getItem(INVESTIGATION_CONTEXTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveInvestigationContexts(contexts: AtritoInvestigationContext[]): void {
  localStorage.setItem(INVESTIGATION_CONTEXTS_KEY, JSON.stringify(contexts));
}

export function findInvestigationContextByAtritoId(
  atritoId: string
): AtritoInvestigationContext | undefined {
  const contexts = loadInvestigationContexts();
  return contexts.find((c) => c.atritoId === atritoId);
}

export function saveOrUpdateInvestigationContext(
  context: AtritoInvestigationContext
): void {
  const contexts = loadInvestigationContexts();
  const index = contexts.findIndex((c) => c.atritoId === context.atritoId);

  if (index >= 0) {
    contexts[index] = { ...contexts[index], ...context, updatedAt: new Date().toISOString() };
  } else {
    contexts.push(context);
  }

  saveInvestigationContexts(contexts);
}

export function removeInvestigationContext(atritoId: string): void {
  const contexts = loadInvestigationContexts();
  const filtered = contexts.filter((c) => c.atritoId !== atritoId);
  saveInvestigationContexts(filtered);
}

export function hasInvestigationContext(
  atritoId: string,
  contexts?: AtritoInvestigationContext[]
): boolean {
  const list = contexts ?? loadInvestigationContexts();
  return list.some((c) => c.atritoId === atritoId);
}

interface BackupData {
  version: number;
  exportedAt: string;
  atritos: Atrito[];
  opportunities: Opportunity[];
  investigationContexts: AtritoInvestigationContext[];
}

export function exportBackup(): BackupData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    atritos: loadAtritos(),
    opportunities: loadOpportunities(),
    investigationContexts: loadInvestigationContexts(),
  };
}

export function downloadBackup(): void {
  const data = exportBackup();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `atrito-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString) as Partial<BackupData>;

    if (!data.version || !Array.isArray(data.atritos) || !Array.isArray(data.opportunities)) {
      return { success: false, message: 'Formato de backup inválido.' };
    }

    if (data.investigationContexts && !Array.isArray(data.investigationContexts)) {
      return { success: false, message: 'Formato de backup inválido.' };
    }

    saveAtritos(data.atritos);
    saveOpportunities(data.opportunities);
    saveInvestigationContexts(data.investigationContexts || []);

    return {
      success: true,
      message: `Backup importado: ${data.atritos.length} atritos, ${data.opportunities.length} oportunidades.`,
    };
  } catch {
    return { success: false, message: 'Não foi possível ler o arquivo JSON.' };
  }
}

export function clearAllData(): void {
  localStorage.removeItem(ATRITOS_KEY);
  localStorage.removeItem(OPPORTUNITIES_KEY);
  localStorage.removeItem(FILTERS_KEY);
  localStorage.removeItem(OPPORTUNITY_FILTERS_KEY);
  localStorage.removeItem(INVESTIGATION_CONTEXTS_KEY);
}
