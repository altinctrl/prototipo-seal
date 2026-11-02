import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { PerfilUsuario } from '../../types';
import {
  Truck,
  AlertTriangle,
  CalendarClock,
  Building,
  MessageSquare,
  Warehouse,
  ShieldAlert,
  Search,
  AlertCircle,
  FilePlus,
  Wallet,
  FileText,
  Package,
  PlusCircle,
  Route,
  ClipboardCheck,
  QrCode,
  Menu,
  X,
  SplitSquareVertical,
  ChevronDown,
} from 'lucide-react';
import mascotLogo from '../../assets/mascot_with_box.svg';

interface ItemAba {
  id: string;
  label: string;
  icone: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const {
    perfilAtivo,
    abaAtiva,
    setAbaAtiva,
    escopoMoscow,
    lojistas,
    lojistaSelecionadoId,
    setLojistaSelecionadoId,
    parceiras,
    parceiraSelecionadaId,
    setParceiraSelecionadaId,
    alertaContingencia,
  } = useSealogStore();

  const [mobileMenuAberto, setMobileMenuAberto] = useState(false);

  // Mapeamento de abas por perfil filtrado pelo escopo MoSCoW
  const obterAbasDoPerfil = (perfil: PerfilUsuario): ItemAba[] => {
    switch (perfil) {
      case 'coordenador':
        return [
          { id: 'despacho', label: 'Despacho & Malha', icone: <Truck className="w-4 h-4" /> },
          ...(escopoMoscow !== 'must'
            ? [
                { id: 'contingencia', label: 'Alertas de Contingência', icone: <AlertTriangle className="w-4 h-4" /> },
                { id: 'mesa_decisao', label: 'Mesa de Decisão', icone: <CalendarClock className="w-4 h-4" /> },
              ]
            : []),
          { id: 'cadastros', label: 'Lojistas e Parceiras', icone: <Building className="w-4 h-4" /> },
        ];
      case 'analista':
        return [
          ...(escopoMoscow === 'completo'
            ? [{ id: 'triagem_parceiras', label: 'Triagem de Baixas', icone: <MessageSquare className="w-4 h-4" /> }]
            : []),
          { id: 'atribuicao', label: 'Atribuição de Coletas', icone: <Truck className="w-4 h-4" /> },
          { id: 'galpao', label: 'Galpão Central', icone: <Warehouse className="w-4 h-4" /> },
          { id: 'ocorrencias', label: 'Ocorrências de Campo', icone: <ShieldAlert className="w-4 h-4" /> },
        ];
      case 'atendente':
        return [
          ...(escopoMoscow === 'completo'
            ? [{ id: 'triagem', label: 'Triagem Split-Screen', icone: <SplitSquareVertical className="w-4 h-4" /> }]
            : []),
          { id: 'pendentes', label: 'Pedidos Incompletos', icone: <AlertCircle className="w-4 h-4" /> },
          { id: 'localizador', label: 'Localizador de Entregas', icone: <Search className="w-4 h-4" /> },
          { id: 'novo_pedido', label: 'Novo Pedido / Importar', icone: <FilePlus className="w-4 h-4" /> },
        ];
      case 'financeiro':
        return [
          { id: 'fechamento_parceiras', label: 'Fechamento de Parceiras', icone: <Wallet className="w-4 h-4" /> },
          { id: 'faturamento_lojistas', label: 'Faturamento de Lojistas', icone: <FileText className="w-4 h-4" /> },
        ];
      case 'lojista':
        return [
          { id: 'meus_envios', label: 'Meus Envios', icone: <Package className="w-4 h-4" /> },
          { id: 'novo_envio', label: 'Novo Envio', icone: <PlusCircle className="w-4 h-4" /> },
        ];
      case 'parceiro':
        return [
          { id: 'rotas', label: 'Rotas Atribuídas', icone: <Route className="w-4 h-4" /> },
          { id: 'prestacao_contas', label: 'Prestação de Contas', icone: <ClipboardCheck className="w-4 h-4" /> },
          ...(escopoMoscow === 'completo'
            ? [{ id: 'link_magico', label: 'Link Mágico (Entregador)', icone: <QrCode className="w-4 h-4" /> }]
            : []),
        ];
      default:
        return [];
    }
  };

  // Informações de contexto do usuário simulado
  const obterInfoUsuario = () => {
    switch (perfilAtivo) {
      case 'coordenador':
        return { nome: 'Carlos Mendes', cargo: 'Coordenador de Operações', departamento: 'Torre de Controle' };
      case 'analista':
        return { nome: 'Mariana Costa', cargo: 'Analista de Logística', departamento: 'Triagem e Hub Central' };
      case 'atendente':
        return { nome: 'Beatriz Lima', cargo: 'Atendimento ao Cliente', departamento: 'Central SAC / Entrada' };
      case 'financeiro':
        return { nome: 'Roberto Alves', cargo: 'Analista Financeiro', departamento: 'Controladoria e Repasses' };
      case 'lojista': {
        const lojistaAtual = lojistas.find((l) => l.id === lojistaSelecionadoId) || lojistas[0];
        return {
          nome: lojistaAtual ? lojistaAtual.nome : 'Lojista Credenciado',
          cargo: 'Portal do Estabelecimento',
          departamento: lojistaAtual ? `${lojistaAtual.bairro} (${lojistaAtual.cidade})` : 'Recife',
        };
      }
      case 'parceiro': {
        const parceiraAtual = parceiras.find((p) => p.id === parceiraSelecionadaId) || parceiras[0];
        return {
          nome: parceiraAtual ? parceiraAtual.nome : 'Empresa Parceira',
          cargo: 'Portal da Transportadora',
          departamento: parceiraAtual ? parceiraAtual.contato : 'Operação Terceirizada',
        };
      }
      default:
        return { nome: 'Usuário SEALog', cargo: 'Colaborador', departamento: 'SEALog' };
    }
  };

  const abas = obterAbasDoPerfil(perfilAtivo);
  const infoUsuario = obterInfoUsuario();

  return (
    <>
      {/* Botão de Menu Mobile para alternar Sidebar */}
      <div className="lg:hidden bg-sealog-blue text-white px-4 py-3 flex items-center justify-between border-b border-sealog-blue-800">
        <div className="flex items-center gap-2.5">
          <img src={mascotLogo} alt="SEALog" className="h-7 w-auto" />
          <span className="font-black text-lg tracking-tight">
            SEAL<span className="text-sealog-cream font-bold">og</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuAberto(!mobileMenuAberto)}
          className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-sealog-blue-800"
          aria-label="Alternar menu de navegação"
        >
          {mobileMenuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Barra Lateral (Sidebar) */}
      <aside
        className={`${
          mobileMenuAberto ? 'block' : 'hidden'
        } lg:block w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between shadow-2xs z-30`}
      >
        <div className="p-4 sm:p-5 space-y-5">
          {/* Cabeçalho da Empresa (Logo + Mascote) */}
          <div className="hidden lg:flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="bg-sealog-cream rounded-xl p-1.5 shadow-2xs shrink-0 flex items-center justify-center">
              <img src={mascotLogo} alt="Mascote SEALog" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-sealog-blue">
                SEAL<span className="text-sealog-blue-600 font-bold">og</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400">Logística Urbana Inteligente</p>
            </div>
          </div>

          {/* Cartão de Contexto do Usuário / Perfil Ativo */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sessão Ativa
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Online" />
            </div>
            <div className="font-bold text-xs text-slate-900 truncate">{infoUsuario.nome}</div>
            <div className="text-[11px] font-medium text-sealog-blue truncate">{infoUsuario.cargo}</div>
            <div className="text-[10px] text-slate-500 truncate">{infoUsuario.departamento}</div>

            {/* Seletor inline específico para Lojista */}
            {perfilAtivo === 'lojista' && (
              <div className="pt-2 mt-2 border-t border-slate-200">
                <label htmlFor="select-lojista-sidebar" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Mudar Loja:
                </label>
                <div className="relative">
                  <select
                    id="select-lojista-sidebar"
                    value={lojistaSelecionadoId}
                    onChange={(e) => setLojistaSelecionadoId(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-1.5 pr-6 focus:ring-1 focus:ring-sealog-blue focus:outline-none appearance-none cursor-pointer"
                  >
                    {lojistas.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Seletor inline específico para Empresa Parceira */}
            {perfilAtivo === 'parceiro' && (
              <div className="pt-2 mt-2 border-t border-slate-200">
                <label htmlFor="select-parceiro-sidebar" className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Mudar Parceira:
                </label>
                <div className="relative">
                  <select
                    id="select-parceiro-sidebar"
                    value={parceiraSelecionadaId}
                    onChange={(e) => setParceiraSelecionadaId(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-1.5 pr-6 focus:ring-1 focus:ring-sealog-blue focus:outline-none appearance-none cursor-pointer"
                  >
                    {parceiras.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Alerta de Contingência Ativo (Se Houver) */}
          {alertaContingencia && alertaContingencia.ativo && (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Contingência Ativa</span>
              </div>
              <p className="text-[10px] text-amber-700 leading-tight">
                {alertaContingencia.regiao}: {alertaContingencia.mensagem}
              </p>
            </div>
          )}

          {/* Menu de Abas Internas da Persona */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Menu de Operações
            </div>
            <nav className="space-y-1">
              {abas.map((aba) => {
                const ativa = abaAtiva === aba.id;
                return (
                  <button
                    key={aba.id}
                    onClick={() => {
                      setAbaAtiva(aba.id);
                      setMobileMenuAberto(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      ativa
                        ? 'bg-sealog-blue text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <span className={ativa ? 'text-sealog-cream' : 'text-slate-400'}>
                      {aba.icone}
                    </span>
                    <span>{aba.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>SEALog v1.0 • Desafio SEAL</span>
          <span className="font-mono text-[10px]">2026.2</span>
        </div>
      </aside>
    </>
  );
};
