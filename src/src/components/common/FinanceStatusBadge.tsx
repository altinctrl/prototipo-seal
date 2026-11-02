import React from 'react';
import { ElegibilidadeFinanceira } from '../../types';
import { Check, ShieldAlert, Clock, Minus } from 'lucide-react';

interface FinanceStatusBadgeProps {
  status: ElegibilidadeFinanceira;
  className?: string;
}

export const FinanceStatusBadge: React.FC<FinanceStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const config: Record<
    ElegibilidadeFinanceira,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode; descricao: string }
  > = {
    LIBERADO: {
      label: 'Liberado',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <Check className="w-3 h-3 text-emerald-600" />,
      descricao: 'Comprovante com foto validado. Elegível para repasse.',
    },
    RETIDO_PRAZO: {
      label: 'Retido (Carência 48h)',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <Clock className="w-3 h-3 text-amber-600" />,
      descricao: 'Sem foto (baixa verbal). Aguardando expiração da janela de contestação.',
    },
    BLOQUEADO_GLOSA: {
      label: 'Bloqueado por Glosa',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: <ShieldAlert className="w-3 h-3 text-red-600" />,
      descricao: 'Contestação aberta pelo lojista ou inconsistência operacional.',
    },
    PENDENTE: {
      label: 'Em Andamento',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: <Minus className="w-3 h-3 text-slate-400" />,
      descricao: 'Entrega não finalizada.',
    },
  };

  const c = config[status] || config.PENDENTE;

  return (
    <span
      title={c.descricao}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
};
