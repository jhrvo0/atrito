import { Atrito, Opportunity } from '../types';

const ATRITOS_KEY = 'atrito-atritos';
const OPPORTUNITIES_KEY = 'atrito-opportunities';
const FILTERS_KEY = 'atrito-filters';

export interface FiltersState {
  searchTerm: string;
  contextFilter: string;
  intensityFilter: string;
  frequencyFilter: string;
  statusFilter: string;
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
