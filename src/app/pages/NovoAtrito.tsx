import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { useApp } from '../context/AppContext';
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
import { toISOStringNow } from '../utils/date';
import { showConfirm } from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';

type FormData = {
  title: string;
  description: string;
  context: string;
  intensity: string;
  frequency: string;
  affected: string;
  improvisedSolution: string;
};

function ChipSelect({ options, value, onChange, label }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div>
      {label && <label className="block text-xs text-muted-foreground mb-2 font-medium">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border ${
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

export function NovoAtrito() {
  const navigate = useNavigate();
  const { addAtrito } = useApp();
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    context: '',
    intensity: '',
    frequency: '',
    affected: '',
    improvisedSolution: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];
    if (!formData.title.trim()) newErrors.push('Título');
    if (!formData.description.trim()) newErrors.push('Descrição');
    if (!formData.context) newErrors.push('Contexto');
    if (!formData.intensity) newErrors.push('Intensidade');
    if (!formData.frequency) newErrors.push('Frequência');
    if (!formData.affected) newErrors.push('Afetado');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    const newAtrito: Atrito = {
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      context: isValidContext(formData.context) ? formData.context : 'outro',
      intensity: isValidIntensity(formData.intensity) ? formData.intensity : 'média',
      frequency: isValidFrequency(formData.frequency) ? formData.frequency : 'às vezes',
      affected: isValidAffected(formData.affected) ? formData.affected : 'eu',
      improvisedSolution: formData.improvisedSolution.trim() || undefined,
      status: 'observado',
      createdAt: toISOStringNow(),
    };

    addAtrito(newAtrito);
    showToast('Observação registrada!');
    navigate('/atritos');
  };

  const handleCancel = async () => {
    const hasData =
      formData.title ||
      formData.description ||
      formData.context ||
      formData.intensity ||
      formData.frequency ||
      formData.affected ||
      formData.improvisedSolution;

    if (hasData) {
      const confirmed = await showConfirm({
        title: 'Descartar observação?',
        message: 'Você tem dados não salvos. Deseja sair?',
        confirmLabel: 'Sair',
        cancelLabel: 'Continuar editando',
      });
      if (confirmed) navigate('/atritos');
    } else {
      navigate('/atritos');
    }
  };

  const filledCount = [formData.context, formData.intensity, formData.frequency, formData.affected].filter(Boolean).length;
  const totalRequired = 4;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/atritos')}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">Nova observação</p>
            <h1 className="text-2xl mb-1 leading-tight">Ficha de observação</h1>
            <p className="text-sm text-muted-foreground">
              Registe o que aconteceu, onde e como isso impactou seu dia.
            </p>
          </div>

          {errors.length > 0 && (
            <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              Campos obrigatórios: {errors.join(', ')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="space-y-5">
              <div>
                <label className="block text-xs text-muted-foreground mb-2 font-medium">
                  O que aconteceu? <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Ex: Fila lenta no caixa do supermercado"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  Um título curto e direto descrevendo a fricção.
                </p>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-2 font-medium">
                  Descrição <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Descreva o que aconteceu, o contexto e por que isso foi um problema..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  Contextualize: o que você esperava vs. o que aconteceu.
                </p>
              </div>
            </Card>

            <Card className="space-y-5">
              <div>
                <label className="block text-xs text-muted-foreground mb-2 font-medium">
                  Onde esse atrito apareceu? <span className="text-destructive">*</span>
                </label>
                <ChipSelect
                  options={CONTEXT_OPTIONS}
                  value={formData.context}
                  onChange={(v) => setFormData({ ...formData, context: v })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2 font-medium">
                    Qual foi o peso disso? <span className="text-destructive">*</span>
                  </label>
                  <ChipSelect
                    options={INTENSITY_OPTIONS}
                    value={formData.intensity}
                    onChange={(v) => setFormData({ ...formData, intensity: v })}
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-2 font-medium">
                    Com que frequência acontece? <span className="text-destructive">*</span>
                  </label>
                  <ChipSelect
                    options={FREQUENCY_OPTIONS}
                    value={formData.frequency}
                    onChange={(v) => setFormData({ ...formData, frequency: v })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-2 font-medium">
                  Quem foi afetado? <span className="text-destructive">*</span>
                </label>
                <ChipSelect
                  options={AFFECTED_OPTIONS}
                  value={formData.affected}
                  onChange={(v) => setFormData({ ...formData, affected: v })}
                />
              </div>
            </Card>

            <Card>
              <div>
                <label className="block text-xs text-muted-foreground mb-2 font-medium">Houve alguma solução improvisada?</label>
                <Textarea
                  placeholder="Como você ou outros contornaram esse problema na hora?"
                  value={formData.improvisedSolution}
                  onChange={(e) => setFormData({ ...formData, improvisedSolution: e.target.value })}
                  rows={2}
                />
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  Workarounds revelam oportunidades reais de produto.
                </p>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto">
                Salvar observação
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel} className="w-full sm:w-auto">
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-8 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">Resumo</p>
              <div className="space-y-2.5 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Título</p>
                  <p className="font-medium text-sm truncate">{formData.title || <span className="text-muted-foreground/40">—</span>}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Contexto</p>
                  <p className="font-medium text-sm capitalize">{formData.context || <span className="text-muted-foreground/40">—</span>}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Intensidade</p>
                  <p className="font-medium text-sm capitalize">{formData.intensity || <span className="text-muted-foreground/40">—</span>}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Frequência</p>
                  <p className="font-medium text-sm capitalize">{formData.frequency || <span className="text-muted-foreground/40">—</span>}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(filledCount / totalRequired) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{filledCount}/{totalRequired}</span>
              </div>
              <p className="text-[11px] text-muted-foreground/60">Campos obrigatórios preenchidos</p>
            </div>

            <div className="border-t border-border/50 pt-3">
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                Quanto mais contexto você adicionar, mais útil será para identificar padrões e gerar oportunidades.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
