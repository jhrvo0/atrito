import { Check } from 'lucide-react';

interface ChipSelectOption {
  value: string;
  label: string;
}

interface ChipSelectProps {
  options: ChipSelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ChipSelect({ options, value, onChange, label }: ChipSelectProps) {
  return (
    <div>
      {label && <label className="block text-xs text-muted-foreground mb-2 font-medium">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-full text-xs font-medium transition-all duration-150 border min-h-[36px] md:min-h-0 active:scale-95 ${
              value === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground'
            }`}
          >
            {value === opt.value && <Check size={12} strokeWidth={2.5} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
