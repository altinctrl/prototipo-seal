import React from 'react';
import { StatusPedido } from '../../types';
import {
  Clock,
  AlertTriangle,
  Send,
  Truck,
  Warehouse,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

interface StatusBadgeProps {
  status: StatusPedido;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  const config: Record<
    StatusPedido,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    CRIADO: {
      label: 'Criado',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    PENDENTE_DADOS: {
      label: 'Dados Incompletos',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
    },
    ATRIBUIDO: {
      label: 'Atribuído',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <Send className="w-3.5 h-3.5" />,
    },
    EM_TRANSITO: {
      label: 'Em Trânsito',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    NO_GALPAO: {
      label: 'No Galpão',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <Warehouse className="w-3.5 h-3.5" />,
    },
    LIBERADO_PERNA_2: {
      label: 'Liberado p/ Entrega',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    CONCLUIDO: {
      label: 'Entregue',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    OCORRENCIA: {
      label: 'Ocorrência',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    },
    DEVOLVIDO: {
      label: 'Devolvido',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <RotateCcw className="w-3.5 h-3.5" />,
    },
  };

  const c = config[status] || {
    label: status,
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: <XCircle className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      {showIcon && c.icon}
      <span>{c.label}</span>
    </span>
  );
};
