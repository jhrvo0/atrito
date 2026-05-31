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

function safeLoadJson<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return parsed ?? fallback;
  } catch {
    console.warn(`Failed to parse localStorage key "${key}", using fallback.`);
    return fallback;
  }
}

function safeSaveJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save to localStorage key "${key}".`);
  }
}

export function loadAtritos(): Atrito[] {
  return safeLoadJson<Atrito[]>(ATRITOS_KEY, []);
}

export function saveAtritos(atritos: Atrito[]): void {
  safeSaveJson(ATRITOS_KEY, atritos);
}

export function loadOpportunities(): Opportunity[] {
  return safeLoadJson<Opportunity[]>(OPPORTUNITIES_KEY, []);
}

export function saveOpportunities(opportunities: Opportunity[]): void {
  safeSaveJson(OPPORTUNITIES_KEY, opportunities);
}

const defaultFilters: FiltersState = {
  searchTerm: '',
  contextFilter: '',
  intensityFilter: '',
  frequencyFilter: '',
  statusFilter: '',
};

export function loadFilters(): FiltersState {
  return safeLoadJson<FiltersState>(FILTERS_KEY, defaultFilters);
}

export function saveFilters(filters: FiltersState): void {
  safeSaveJson(FILTERS_KEY, filters);
}

const defaultOpportunityFilters: OpportunityFiltersState = {
  searchTerm: '',
  statusFilter: '',
  priorityFilter: '',
};

export function loadOpportunityFilters(): OpportunityFiltersState {
  return safeLoadJson<OpportunityFiltersState>(OPPORTUNITY_FILTERS_KEY, defaultOpportunityFilters);
}

export function saveOpportunityFilters(filters: OpportunityFiltersState): void {
  safeSaveJson(OPPORTUNITY_FILTERS_KEY, filters);
}

export function loadInvestigationContexts(): AtritoInvestigationContext[] {
  return safeLoadJson<AtritoInvestigationContext[]>(INVESTIGATION_CONTEXTS_KEY, []);
}

export function saveInvestigationContexts(contexts: AtritoInvestigationContext[]): void {
  safeSaveJson(INVESTIGATION_CONTEXTS_KEY, contexts);
}

export function clearAllData(): void {
  localStorage.removeItem(ATRITOS_KEY);
  localStorage.removeItem(OPPORTUNITIES_KEY);
  localStorage.removeItem(FILTERS_KEY);
  localStorage.removeItem(OPPORTUNITY_FILTERS_KEY);
  localStorage.removeItem(INVESTIGATION_CONTEXTS_KEY);
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
      message: `Backup importado: ${data.atritos.length} atritos, ${data.opportunities.length} ideias.`,
    };
  } catch {
    return { success: false, message: 'Não foi possível ler o arquivo JSON.' };
  }
}
