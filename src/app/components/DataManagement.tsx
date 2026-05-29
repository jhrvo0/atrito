import { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { downloadBackup, importBackup, clearAllData } from '../utils/storage';
import { showConfirm } from './ConfirmDialog';
import { showToast } from './Toast';

interface DataManagementProps {
  onDataChanged?: () => void;
}

export function DataManagement({ onDataChanged }: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadBackup();
    showToast('Backup exportado com sucesso!');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = importBackup(text);

    if (result.success) {
      showToast(result.message, 'success');
      onDataChanged?.();
    } else {
      showToast(result.message, 'error');
    }

    e.target.value = '';
  };

  const handleClear = async () => {
    const confirmed = await showConfirm({
      title: 'Limpar todos os dados?',
      message: 'Esta ação irá remover permanentemente todos os atritos, oportunidades e contextos de investigação. Esta ação não pode ser desfeita.',
      confirmLabel: 'Limpar tudo',
    });
    if (!confirmed) return;

    const doubleConfirm = await showConfirm({
      title: 'Tem certeza absoluta?',
      message: 'Todos os seus dados serão perdidos permanentemente. Recomendamos fazer um backup antes.',
      confirmLabel: 'Sim, limpar tudo',
    });
    if (!doubleConfirm) return;

    clearAllData();
    showToast('Todos os dados foram removidos.', 'info');
    onDataChanged?.();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button variant="secondary" onClick={handleExport}>
        <Download size={18} />
        Exportar backup
      </Button>
      <Button variant="secondary" onClick={handleImport}>
        <Upload size={18} />
        Importar backup
      </Button>
      <Button variant="ghost" onClick={handleClear}>
        <Trash2 size={18} />
        Limpar dados
      </Button>
    </div>
  );
}
