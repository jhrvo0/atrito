import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';
import { useApp } from '../context/AppContext';
import { Atrito } from '../types';

interface NovoAtritoProps {
  onNavigate: (page: string) => void;
}

export function NovoAtrito({ onNavigate }: NovoAtritoProps) {
  const { addAtrito } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    context: '',
    intensity: '',
    frequency: '',
    affected: '',
    improvisedSolution: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.context || !formData.intensity || !formData.frequency || !formData.affected) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newAtrito: Atrito = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      context: formData.context as any,
      intensity: formData.intensity as any,
      frequency: formData.frequency as any,
      affected: formData.affected as any,
      improvisedSolution: formData.improvisedSolution || undefined,
      status: 'observado',
      createdAt: new Date().toISOString().split('T')[0]
    };

    addAtrito(newAtrito);
    onNavigate('atritos');
  };

  const handleCancel = () => {
    if (
      formData.title ||
      formData.description ||
      formData.context ||
      formData.intensity ||
      formData.frequency ||
      formData.affected ||
      formData.improvisedSolution
    ) {
      if (confirm('Deseja descartar as alterações?')) {
        onNavigate('atritos');
      }
    } else {
      onNavigate('atritos');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => onNavigate('atritos')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">Novo Atrito</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Registre um problema, incômodo ou fricção que você observou no seu dia a dia
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título curto <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ex: Fila lenta no caixa do supermercado"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Descreva o que aconteceu, o contexto e por que isso foi um problema"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contexto <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Selecione o contexto"
                  options={[
                    { value: 'casa', label: 'Casa' },
                    { value: 'rua', label: 'Rua' },
                    { value: 'faculdade', label: 'Faculdade' },
                    { value: 'trabalho', label: 'Trabalho' },
                    { value: 'transporte', label: 'Transporte' },
                    { value: 'app/site', label: 'App/Site' },
                    { value: 'compra', label: 'Compra' },
                    { value: 'atendimento', label: 'Atendimento' },
                    { value: 'outro', label: 'Outro' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Intensidade <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                  placeholder="Qual o impacto?"
                  options={[
                    { value: 'baixa', label: 'Baixa' },
                    { value: 'média', label: 'Média' },
                    { value: 'alta', label: 'Alta' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Frequência <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  placeholder="Com que frequência?"
                  options={[
                    { value: 'uma vez', label: 'Aconteceu uma vez' },
                    { value: 'às vezes', label: 'Às vezes' },
                    { value: 'frequentemente', label: 'Frequentemente' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quem foi afetado <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.affected}
                  onChange={(e) => setFormData({ ...formData, affected: e.target.value })}
                  placeholder="Quem sentiu isso?"
                  options={[
                    { value: 'eu', label: 'Eu' },
                    { value: 'outra pessoa', label: 'Outra pessoa' },
                    { value: 'grupo', label: 'Grupo' },
                    { value: 'público geral', label: 'Público geral' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Solução improvisada (opcional)</label>
              <Textarea
                placeholder="Como você ou outros contornaram esse problema na hora?"
                value={formData.improvisedSolution}
                onChange={(e) => setFormData({ ...formData, improvisedSolution: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Salvar atrito
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={handleCancel} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
