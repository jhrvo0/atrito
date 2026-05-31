import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from './Button';
import { ChipSelect } from './ChipSelect';
import { Atrito } from '../types';
import {
  CONTEXT_OPTIONS,
  INTENSITY_OPTIONS,
  FREQUENCY_OPTIONS,
  AFFECTED_OPTIONS,
  isValidContext,
  isValidIntensity,
  isValidFrequency,
  isValidAffected,
} from '../constants';

type EditFormData = {
  title: string;
  description: string;
  context: string;
  intensity: string;
  frequency: string;
  affected: string;
  improvisedSolution: string;
};

interface EditAtritoModalProps {
  atrito: Atrito;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Atrito>) => void;
  onDeleteContext: () => void;
  hasContext: boolean;
}

export function EditAtritoModal({
  atrito,
  isOpen,
  onClose,
  onSave,
  onDeleteContext,
  hasContext,
}: EditAtritoModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    title: atrito.title,
    description: atrito.description || '',
    context: atrito.context,
    intensity: atrito.intensity,
    frequency: atrito.frequency,
    affected: atrito.affected,
    improvisedSolution: atrito.improvisedSolution || '',
  });
  const [isCustomContext, setIsCustomContext] = useState(
    () => !CONTEXT_OPTIONS.some((o) => o.value === atrito.context)
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setFormData({
      title: atrito.title,
      description: atrito.description || '',
      context: atrito.context,
      intensity: atrito.intensity,
      frequency: atrito.frequency,
      affected: atrito.affected,
      improvisedSolution: atrito.improvisedSolution || '',
    });
    setIsCustomContext(!CONTEXT_OPTIONS.some((o) => o.value === atrito.context));
    setErrors([]);
  }, [atrito.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!formData.title.trim()) newErrors.push('Título');
    if (!formData.context.trim()) newErrors.push('Contexto');
    if (!formData.intensity) newErrors.push('Intensidade');
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors([]);
    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      context: isValidContext(formData.context) ? formData.context : String(formData.context).trim(),
      intensity: isValidIntensity(formData.intensity) ? formData.intensity : atrito.intensity,
      frequency: isValidFrequency(formData.frequency) ? formData.frequency : atrito.frequency,
      affected: isValidAffected(formData.affected) ? formData.affected : atrito.affected,
      improvisedSolution: formData.improvisedSolution.trim() || undefined,
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Editar observação">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            Campos obrigatórios: {errors.join(', ')}
          </div>
        )}

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">
            Título <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="O que aconteceu?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Descrição</label>
          <Textarea
            placeholder="Descreva o que aconteceu..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">
            Contexto <span className="text-destructive">*</span>
          </label>
          {isCustomContext ? (
            <div className="space-y-2">
              <Input
                placeholder="Contexto personalizado"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                className="min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => { setIsCustomContext(false); setFormData({ ...formData, context: CONTEXT_OPTIONS[0]?.value ?? '' }); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Escolher um contexto padrão
              </button>
            </div>
          ) : (
            <>
              <ChipSelect
                options={CONTEXT_OPTIONS}
                value={formData.context}
                onChange={(v) => setFormData({ ...formData, context: v })}
              />
              <button
                type="button"
                onClick={() => { setIsCustomContext(true); setFormData({ ...formData, context: '' }); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1.5"
              >
                Usar contexto personalizado
              </button>
            </>
          )}
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">
            Intensidade <span className="text-destructive">*</span>
          </label>
          <ChipSelect
            options={INTENSITY_OPTIONS}
            value={formData.intensity}
            onChange={(v) => setFormData({ ...formData, intensity: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Frequência</label>
          <ChipSelect
            options={FREQUENCY_OPTIONS}
            value={formData.frequency}
            onChange={(v) => setFormData({ ...formData, frequency: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Quem foi afetado?</label>
          <ChipSelect
            options={AFFECTED_OPTIONS}
            value={formData.affected}
            onChange={(v) => setFormData({ ...formData, affected: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Solução improvisada</label>
          <Textarea
            placeholder="Como você contornou esse problema?"
            value={formData.improvisedSolution}
            onChange={(e) => setFormData({ ...formData, improvisedSolution: e.target.value })}
            rows={2}
            className="min-h-[44px]"
          />
        </div>

        {hasContext && (
          <div className="pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDeleteContext}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
            >
              <Trash2 size={14} />
              Excluir contexto aprofundado
            </Button>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 min-h-[48px]">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1 min-h-[48px]">
            Salvar
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
