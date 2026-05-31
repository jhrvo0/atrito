import { Card } from './Card';
import { Tag } from './Tag';
import { Atrito } from '../types';
import { formatDate } from '../utils/date';

interface AtritoCardProps {
  atrito: Atrito;
  hasContext: boolean;
  onClick: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'observado':
      return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300';
    case 'investigando':
      return 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300';
    case 'virou ideia':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    case 'descartado':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function AtritoCard({ atrito, hasContext, onClick }: AtritoCardProps) {
  return (
    <Card className="py-3 px-4" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-medium leading-snug">{atrito.title}</h3>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 hidden md:inline">
              {formatDate(atrito.createdAt)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{atrito.description}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag variant="context">{atrito.context}</Tag>
            <Tag variant="intensity">{atrito.intensity}</Tag>
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${getStatusColor(atrito.status)}`}>
              {atrito.status}
            </span>
            {hasContext && (
              <Tag variant="investigated">aprofundado</Tag>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
