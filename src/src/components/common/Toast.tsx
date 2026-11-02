import React, { useEffect } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notificacao, fecharNotificacao } = useSealogStore();

  useEffect(() => {
    if (!notificacao) return;
    const timer = setTimeout(() => {
      fecharNotificacao();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notificacao, fecharNotificacao]);

  if (!notificacao) return null;

  const config = {
    success: {
      bg: 'bg-emerald-600',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
    info: {
      bg: 'bg-sealog-blue',
      icon: <Info className="w-5 h-5 text-white" />,
    },
    warning: {
      bg: 'bg-amber-600',
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
    },
    error: {
      bg: 'bg-rose-600',
      icon: <XCircle className="w-5 h-5 text-white" />,
    },
  }[notificacao.tipo];

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-in shadow-xl rounded-lg overflow-hidden flex items-start text-white bg-slate-900 border border-slate-700">
      <div className={`p-3 flex items-center justify-center ${config.bg}`}>
        {config.icon}
      </div>
      <div className="p-3 pr-2 flex-1 text-sm font-medium">
        {notificacao.mensagem}
      </div>
      <button
        onClick={fecharNotificacao}
        className="p-3 text-slate-400 hover:text-white transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
