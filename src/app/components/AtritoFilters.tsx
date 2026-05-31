import { X } from 'lucide-react';
import { Select } from './Select';
import { Button } from './Button';
import {
  INTENSITY_OPTIONS,
  FREQUENCY_OPTIONS,
  ATRITO_STATUS_OPTIONS,
} from '../constants';
import { FiltersState } from '../utils/storage';

interface AtritoFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  contextOptions: { value: string; label: string }[];
}

export function AtritoFilters({ filters, onFiltersChange, contextOptions }: AtritoFiltersProps) {
  const hasActiveFilters =
    filters.searchTerm ||
    filters.contextFilter ||
    filters.intensityFilter ||
    filters.frequencyFilter ||
    filters.statusFilter;

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      contextFilter: '',
      intensityFilter: '',
      frequencyFilter: '',
      statusFilter: '',
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={filters.contextFilter}
          onChange={(e) => onFiltersChange({ ...filters, contextFilter: e.target.value })}
          options={[{ value: '', label: 'Contexto' }, ...contextOptions]}
        />
        <Select
          value={filters.intensityFilter}
          onChange={(e) => onFiltersChange({ ...filters, intensityFilter: e.target.value })}
          options={[{ value: '', label: 'Intensidade' }, ...INTENSITY_OPTIONS]}
        />
        <Select
          value={filters.frequencyFilter}
          onChange={(e) => onFiltersChange({ ...filters, frequencyFilter: e.target.value })}
          options={[{ value: '', label: 'Frequência' }, ...FREQUENCY_OPTIONS]}
        />
        <Select
          value={filters.statusFilter}
          onChange={(e) => onFiltersChange({ ...filters, statusFilter: e.target.value })}
          options={[{ value: '', label: 'Status' }, ...ATRITO_STATUS_OPTIONS]}
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} size="sm" className="w-full">
          <X size={14} />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
