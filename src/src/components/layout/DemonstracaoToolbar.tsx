import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { PerfilUsuario, TurnoOperacional, EscopoMoscow } from '../../types';
import {
  RotateCcw,
  Users,
  Search,
  Store,
  ShieldCheck,
  Headphones,
  Truck,
  Smartphone,
  Wallet,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const DemonstracaoToolbar: React.FC = () => {
  const {
    perfilAtivo,
    setPerfilAtivo,
    turnoAtivo,
    setTurnoAtivo,
    escopoMoscow,
    setEscopoMoscow,
    resetarDados,
    todosPedidos,
  } = useSealogStore();
  const [confirmarReset, setConfirmarReset] = useState(false);

  const listaCompleta = todosPedidos || [];

  const personas: { id: PerfilUsuario; label: string; papel: string; icone: React.ReactNode }[] = [
    { id: 'coordenador', label: 'Coordenador', papel: 'Torre de Controle & Malha', icone: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'analista', label: 'Analista', papel: 'Galpão & Triagem de Baixas', icone: <Users className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'atendente', label: 'Atendente', papel: 'SAC & Entrada de Pedidos', icone: <Headphones className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'financeiro', label: 'Financeiro', papel: 'Fechamento & Auditoria de Cota', icone: <Wallet className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'lojista', label: 'Lojista', papel: 'Portal do Estabelecimento', icone: <Store className="w-3.5 h-3.5 text-teal-400" /> },
    { id: 'parceiro', label: 'Parceiro', papel: 'Portal da Transportadora', icone: <Truck className="w-3.5 h-3.5 text-indigo-400" /> },
    { id: 'consumidor', label: 'Rastreio Público', papel: 'Visão do Destinatário', icone: <Search className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'entregador_pwa', label: 'Simulador Entregador', papel: 'PWA de Rua sem Login', icone: <Smartphone className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  const niveisMoscow: { id: EscopoMoscow; label: string; desc: string; corAtiva: string }[] = [
    {
      id: 'must',
      label: 'Must (MVP)',
      desc: 'Must Have (14 US, 44 pts): Escopo essencial do MVP interno (Coordenador, Analista, Atendente)',
      corAtiva: 'bg-amber-400 text-slate-950 shadow-xs',
    },
    {
      id: 'should',
      label: 'Should',
      desc: 'Should Have (19 US, 73 pts): Expansão para portais (Lojistas, Parceiras, Financeiro, Contingência)',
      corAtiva: 'bg-sky-400 text-slate-950 shadow-xs',
    },
    {
      id: 'completo',
      label: 'Completo',
      desc: 'Versão Completa (+Could): PWA do Entregador sem login, Link Mágico diário e Triagem HITL',
      corAtiva: 'bg-emerald-400 text-slate-950 shadow-xs',
    },
  ];

  const personasVisiveis = personas.filter((p) => {
    if (escopoMoscow === 'must') {
      return ['coordenador', 'analista', 'atendente'].includes(p.id);
    }
    if (escopoMoscow === 'should') {
      return p.id !== 'entregador_pwa';
    }
    return true;
  });

  const turnos: { id: TurnoOperacional; label: string }[] = [
    {
      id: 'todos',
      label: `Todos os Horários (${listaCompleta.length} ped.)`,
    },
    {
      id: 'manha',
      label: `08h–11h Manhã (${listaCompleta.filter((p) => p.turno === 'manha').length} ped.)`,
    },
    {
      id: 'tarde',
      label: `11h–15h Tarde (${listaCompleta.filter((p) => p.turno === 'tarde').length} ped.)`,
    },
    {
      id: 'fim_tarde',
      label: `15h–17h Alertas (${listaCompleta.filter((p) => p.turno === 'fim_tarde').length} ped.)`,
    },
    {
      id: 'fechamento',
      label: `17h–19h Fechamento (${listaCompleta.filter((p) => p.turno === 'fechamento').length} ped.)`,
    },
  ];

  const personaAtual = personas.find((p) => p.id === perfilAtivo) || personas[0];

  const handleReset = () => {
    resetarDados();
    setConfirmarReset(false);
  };

  return (
    <aside
      aria-label="Ambiente de Demonstração"
      className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-1.5 px-3 sm:px-6 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Bloco 1: Seletor de Escopo MoSCoW */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 p-0.5 rounded-lg border border-slate-800 shrink-0">
          <div className="flex items-center gap-1 px-1.5 text-slate-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-bold hidden sm:inline">Escopo:</span>
          </div>
          <div className="flex items-center gap-0.5" role="group" aria-label="Seletor de Escopo MoSCoW">
            {niveisMoscow.map((n) => {
              const ativo = escopoMoscow === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setEscopoMoscow(n.id)}
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    ativo ? n.corAtiva : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                  title={n.desc}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bloco 2: Seletor da Persona Ativa */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
          <span className="shrink-0">{personaAtual.icone}</span>
          <label htmlFor="select-persona" className="text-[11px] font-semibold text-slate-300 hidden md:inline">
            Persona:
          </label>
          <div className="relative">
            <select
              id="select-persona"
              value={perfilAtivo}
              onChange={(e) => setPerfilAtivo(e.target.value as PerfilUsuario)}
              className="bg-transparent text-amber-300 font-bold text-[11px] focus:outline-none cursor-pointer pr-4 appearance-none"
              title="Alternar persona simulada da banca avaliadora"
            >
              {personasVisiveis.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.label} — {p.papel}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Bloco 3: Simulação de Horários / Turnos */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <label htmlFor="select-turno" className="text-[11px] font-semibold text-slate-300 hidden md:inline">
            Horário:
          </label>
          <div className="relative">
            <select
              id="select-turno"
              value={turnoAtivo || 'todos'}
              onChange={(e) => setTurnoAtivo(e.target.value as TurnoOperacional)}
              className="bg-transparent text-cyan-300 font-bold text-[11px] focus:outline-none cursor-pointer pr-4 appearance-none"
              title="Simular horários operacionais e eventos da rotina"
            >
              {turnos.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-slate-100">
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Bloco 4: Botão Restaurar Dados */}
        <div className="shrink-0">
          {!confirmarReset ? (
            <button
              onClick={() => setConfirmarReset(true)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-slate-800 transition cursor-pointer"
              title="Restaurar dados iniciais de demonstração"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-rose-950 border border-rose-700 px-2 py-0.5 rounded">
              <span className="text-[10px] text-rose-200">Resetar dados?</span>
              <button
                onClick={handleReset}
                className="px-1.5 py-0.5 text-[10px] bg-rose-600 hover:bg-rose-500 text-white rounded font-bold cursor-pointer"
              >
                Sim
              </button>
              <button
                onClick={() => setConfirmarReset(false)}
                className="px-1.5 py-0.5 text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 rounded cursor-pointer"
              >
                Não
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
