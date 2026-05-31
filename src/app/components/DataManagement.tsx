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
    showToast('Backup exportado!');
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
      message: 'Todos os atritos, ideias e contextos serão removidos permanentemente.',
      confirmLabel: 'Limpar tudo',
    });
    if (!confirmed) return;

    const doubleConfirm = await showConfirm({
      title: 'Tem certeza absoluta?',
      message: 'Recomendamos fazer um backup antes.',
      confirmLabel: 'Sim, limpar tudo',
    });
    if (!doubleConfirm) return;

    clearAllData();
    showToast('Dados removidos.', 'info');
    onDataChanged?.();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button variant="secondary" size="sm" onClick={handleExport}>
        <Download size={14} />
        Exportar
      </Button>
      <Button variant="secondary" size="sm" onClick={handleImport}>
        <Upload size={14} />
        Importar
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClear}>
        <Trash2 size={14} />
        Limpar
      </Button>
    </div>
  );
}
