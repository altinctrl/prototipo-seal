import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { BAIRROS_ATENDIDOS_RMR } from '../../data/initialData';
import { DespachoMalhaModule } from '../common/DespachoMalhaModule';
import { StatusBadge } from '../common/StatusBadge';
import {
  Package,
  Truck,
  AlertTriangle,
  Warehouse,
  CheckCircle,
  CloudRain,
  Send,
  Building,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  Flame,
  RotateCcw,
  FileText,
  Printer,
  Check,
  X,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Pedido, Lojista, ParceiraTransporte } from '../../types';

export const CoordenadorView: React.FC = () => {
  const {
    pedidos,
    parceiras,
    lojistas,
    abaAtiva,
    escopoMoscow,
    alertaContingencia,
    dispararAlertaMassa,
    revogarAlertaMassa,
    reagendarEntrega,
    devolverAoRemetente,
    mostrarNotificacao,
    adicionarLojista,
    atualizarLojista,
    removerLojista,
    adicionarParceira,
    atualizarParceira,
    removerParceira,
  } = useSealogStore();

  // Estados de CRUD para Lojistas
  const [modalLojistaAberto, setModalLojistaAberto] = useState(false);
  const [lojistaEmEdicao, setLojistaEmEdicao] = useState<Lojista | null>(null);
  const [formLojista, setFormLojista] = useState({
    nome: '',
    cnpj: '',
    responsavel: '',
    telefone: '',
    bairro: 'Boa Viagem',
    cidade: 'Recife',
  });

  // Estados de CRUD para Parceiras de Transporte
  const [modalParceiraAberto, setModalParceiraAberto] = useState(false);
  const [parceiraEmEdicao, setParceiraEmEdicao] = useState<ParceiraTransporte | null>(null);
  const [formParceira, setFormParceira] = useState({
    nome: '',
    tipoOperacao: 'PLANILHA' as 'PLANILHA' | 'WHATSAPP',
    limiteDiario: 60,
    contato: '',
    telefone: '',
    regioesAtendidas: ['Boa Viagem', 'Pina'],
  });

  // Estado de seleção múltipla de bairros para contingência
  const [bairrosSelecionados, setBairrosSelecionados] = useState<string[]>(['Boa Viagem', 'Pina']);
  const [motivoAlerta, setMotivoAlerta] = useState('Fortes chuvas e alagamentos na RMR');
  const [mensagemAlerta, setMensagemAlerta] = useState(
    'Alagamento de vias nos bairros selecionados. Prazos estendidos em 24h para segurança das equipes.'
  );
  const [lojistaExpandidoId, setLojistaExpandidoId] = useState<string | null>(null);

  // Estados da Mesa de Decisão (Fim do Dia)
  const [pedidoTratativaId, setPedidoTratativaId] = useState<string | null>(null);
  const [tipoAcaoDecisao, setTipoAcaoDecisao] = useState<'reagendar' | 'devolver' | null>(null);
  const [novaDataReentrega, setNovaDataReentrega] = useState('29/10/2026 às 10:00');
  const [parceiraReentregaId, setParceiraReentregaId] = useState('');
  const [motivoDevolucao, setMotivoDevolucao] = useState(
    'Destinatário ausente após tentativa em horário comercial; mercadoria perecível.'
  );
  const [guiaDevolucaoExibida, setGuiaDevolucaoExibida] = useState<{
    pedido: Pedido;
    numeroGuia: string;
    dataHora: string;
    motivo: string;
  } | null>(null);

  // Indicadores Numéricos Globais
  const totalPedidos = pedidos.length;
  const concluidos = pedidos.filter((p) => p.status === 'CONCLUIDO').length;
  const emTransito = pedidos.filter((p) => p.status === 'EM_TRANSITO' || p.status === 'ATRIBUIDO').length;
  const ocorrencias = pedidos.filter((p) => p.status === 'OCORRENCIA').length;
  const noGalpao = pedidos.filter((p) => p.status === 'NO_GALPAO').length;

  // Pedidos impactados pelos bairros selecionados no Alerta de Contingência
  const pedidosImpactados = pedidos.filter((p) =>
    bairrosSelecionados.includes(p.destinatario.endereco.bairro)
  );

  const totalPereciveisImpactados = pedidosImpactados.filter((p) => p.perecivel).length;

  // Agrupamento reativo de pedidos por Lojista
  const lojistasImpactados = lojistas
    .map((loj) => {
      const pedidosDoLojista = pedidosImpactados.filter((p) => p.lojistaId === loj.id);
      return {
        lojista: loj,
        pedidos: pedidosDoLojista,
        temPerecivel: pedidosDoLojista.some((p) => p.perecivel),
      };
    })
    .filter((item) => item.pedidos.length > 0);

  // Alternar seleção de bairro na lista múltipla
  const alternarBairro = (bairro: string) => {
    setBairrosSelecionados((ant) =>
      ant.includes(bairro) ? ant.filter((b) => b !== bairro) : [...ant, bairro]
    );
  };

  const handleEmitirAlerta = (e: React.FormEvent) => {
    e.preventDefault();
    if (bairrosSelecionados.length === 0) {
      mostrarNotificacao('warning', 'Selecione pelo menos um bairro afetado para disparar a contingência.');
      return;
    }
    dispararAlertaMassa(
      bairrosSelecionados.join(', '),
      motivoAlerta,
      mensagemAlerta,
      pedidosImpactados.map((p) => p.codigoCurto)
    );
  };

  // Pedidos na Mesa de Decisão
  const pedidosEmOcorrencia = pedidos.filter((p) => p.status === 'OCORRENCIA');
  const pedidosDevolvidos = pedidos.filter((p) => p.status === 'DEVOLVIDO');

  const handleExecutarReagendamento = (pedidoId: string) => {
    reagendarEntrega(pedidoId, novaDataReentrega, parceiraReentregaId || undefined);
    setPedidoTratativaId(null);
    setTipoAcaoDecisao(null);
  };

  const handleExecutarDevolucao = (pedido: Pedido) => {
    devolverAoRemetente(pedido.id, motivoDevolucao);
    const numeroGuia = `DEV-2026-${pedido.codigoCurto.replace('SL-', '')}`;
    setGuiaDevolucaoExibida({
      pedido,
      numeroGuia,
      dataHora: new Date().toLocaleString('pt-BR'),
      motivo: motivoDevolucao,
    });
    setPedidoTratativaId(null);
    setTipoAcaoDecisao(null);
  };

  return (
    <div className="space-y-6">
      {/* Indicadores Principais de Operação */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total do Dia
            </span>
            <Package className="w-4 h-4 text-sealog-blue" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalPedidos}</p>
          <span className="text-[11px] text-slate-500">Monitorados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Entregues
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{concluidos}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Baixas confirmadas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide">
              Em Rota
            </span>
            <Truck className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{emTransito}</p>
          <span className="text-[11px] text-slate-500">Com parceiras</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Transbordo
            </span>
            <Warehouse className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{noGalpao}</p>
          <span className="text-[11px] text-purple-600 font-medium">No Galpão Central</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
              Ocorrências
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-700 mt-2">{ocorrencias}</p>
          <span className="text-[11px] text-rose-600 font-medium">Mesa de decisão</span>
        </div>
      </div>

      {/* Aba: Despacho & Malha (Atribuição de Coleta no Lojista e Entrega) */}
      {(abaAtiva === 'despacho' || !abaAtiva) && (
        <DespachoMalhaModule
          titulo="Torre de Controle — Despacho & Alocação de Malha"
          subtitulo="Selecione coletas pendentes para atribuir à transportadora parceira mais adequada, com recomendação baseada em bairros e capacidade diária."
        />
      )}

      {/* Aba: Alertas de Contingência */}
      {abaAtiva === 'contingencia' && escopoMoscow !== 'must' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Central de Alertas de Contingência em Massa
                </h3>
                <p className="text-xs text-slate-500">
                  Selecione os bairros atingidos por intempéries para mapear os lojistas e cargas perecíveis impactadas.
                </p>
              </div>
            </div>
          </div>

          {alertaContingencia && alertaContingencia.ativo ? (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase">
                  Alerta Ativo no Sistema ({alertaContingencia.dataHora})
                </span>
                <button
                  onClick={revogarAlertaMassa}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Revogar Alerta
                </button>
              </div>
              <p className="text-xs font-semibold text-amber-900">
                Bairros Afetados: {alertaContingencia.regiao}
              </p>
              <p className="text-xs text-amber-800 bg-white p-2.5 rounded-lg border border-amber-200">
                "{alertaContingencia.mensagem}"
              </p>
            </div>
          ) : (
            <form onSubmit={handleEmitirAlerta} className="space-y-5">
              {/* Seleção Múltipla de Bairros Atendidos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    1. Bairros com Vias Alagadas / Bloqueadas:
                  </label>
                  <span className="text-[11px] font-semibold text-sealog-blue">
                    {bairrosSelecionados.length} selecionados
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {BAIRROS_ATENDIDOS_RMR.map((bairro) => {
                    const marcado = bairrosSelecionados.includes(bairro);
                    return (
                      <label
                        key={bairro}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer transition border ${
                          marcado
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={marcado}
                          onChange={() => alternarBairro(bairro)}
                          className="rounded text-amber-600 focus:ring-amber-500 h-3.5 w-3.5 cursor-pointer"
                        />
                        <span>{bairro}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Resumo Reativo dos Lojistas e Cargas Perecíveis Impactadas */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    2. Lojistas e Pedidos Impactados na Malha:
                  </label>
                  {totalPereciveisImpactados > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
                      <Flame className="w-3.5 h-3.5 text-rose-600" /> {totalPereciveisImpactados} carga(s) perecível(is) em risco!
                    </span>
                  )}
                </div>

                {lojistasImpactados.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                    Nenhum pedido ativo nos bairros selecionados.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lojistasImpactados.map(({ lojista, pedidos: peds, temPerecivel }) => {
                      const expandido = lojistaExpandidoId === lojista.id;
                      return (
                        <div
                          key={lojista.id}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs shadow-2xs"
                        >
                          <button
                            type="button"
                            onClick={() => setLojistaExpandidoId(expandido ? null : lojista.id)}
                            className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition"
                          >
                            <div className="flex items-center gap-2">
                              {expandido ? (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                              )}
                              <span className="font-bold text-slate-900">{lojista.nome}</span>
                              <span className="text-slate-500 text-[11px]">({lojista.bairro})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {temPerecivel && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                                  <Flame className="w-2.5 h-2.5 text-rose-600" /> Perecível
                                </span>
                              )}
                              <span className="font-bold text-sealog-blue bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[11px]">
                                {peds.length} encomenda(s)
                              </span>
                            </div>
                          </button>

                          {expandido && (
                            <div className="p-3 divide-y divide-slate-100 bg-white">
                              {peds.map((ped) => (
                                <div key={ped.id} className="py-2 flex items-center justify-between text-[11px]">
                                  <div>
                                    <span className="font-mono font-bold text-sealog-blue mr-2">
                                      {ped.codigoCurto}
                                    </span>
                                    <span className="text-slate-800 font-semibold">{ped.destinatario.nome}</span>
                                    <span className="text-slate-500 ml-1">
                                      ({ped.destinatario.endereco.bairro})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {ped.perecivel && (
                                      <span className="text-rose-700 font-bold text-[10px] flex items-center gap-1">
                                        <Flame className="w-3 h-3" /> Perecível (Buquê/Medicamento)
                                      </span>
                                    )}
                                    <span className="text-slate-500">Agendado: {ped.dataDesejada}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mensagem e Disparo */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    3. Motivo da Contingência:
                  </label>
                  <input
                    type="text"
                    value={motivoAlerta}
                    onChange={(e) => setMotivoAlerta(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    4. Mensagem Explicativa para os Lojistas e Atendimento:
                  </label>
                  <textarea
                    value={mensagemAlerta}
                    onChange={(e) => setMensagemAlerta(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bairrosSelecionados.length === 0}
                  className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Disparar Alerta em Massa ({pedidosImpactados.length} Entregas Afetadas)
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Aba: Mesa de Decisão do Fim do Dia */}
      {abaAtiva === 'mesa_decisao' && escopoMoscow !== 'must' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-sealog-blue" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Mesa de Decisão do Fim do Dia (17h–19h)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Arbitragem dos insucessos operacionais de campo: reagende nova tentativa para o dia seguinte ou autorize devolução formal ao remetente.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                {pedidosEmOcorrencia.length} pendente(s) de decisão
              </span>
            </div>

            {/* Lista de Insucessos em Aberto */}
            {pedidosEmOcorrencia.length === 0 ? (
              <div className="py-10 text-center bg-emerald-50/50 rounded-xl border border-emerald-200 text-emerald-800 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Nenhuma ocorrência pendente de decisão!</p>
                <p className="text-xs text-emerald-700">
                  Todas as entregas do dia foram concluídas, reagendadas ou devolvidas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidosEmOcorrencia.map((pedido) => {
                  const lojista = lojistas.find((l) => l.id === pedido.lojistaId);
                  const estaEmTratativa = pedidoTratativaId === pedido.id;

                  return (
                    <div
                      key={pedido.id}
                      className="p-5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-rose-900 text-base">
                              {pedido.codigoCurto}
                            </span>
                            <StatusBadge status={pedido.status} />
                            {pedido.perecivel && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                                <Flame className="w-3 h-3 text-rose-600" /> Carga Perecível
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-800 font-semibold">
                            Destinatário: {pedido.destinatario.nome} ({pedido.destinatario.telefone})
                          </div>
                          <div className="text-xs text-slate-600">
                            Endereço: {pedido.destinatario.endereco.logradouro}, {pedido.destinatario.endereco.numero} — {pedido.destinatario.endereco.bairro}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Remetente: <strong>{lojista?.nome || pedido.lojistaId}</strong> • Volume: {pedido.volume} ({pedido.pesoKg} kg)
                          </div>
                        </div>

                        {/* Detalhe da Ocorrência */}
                        <div className="bg-white p-3 rounded-lg border border-rose-200 text-xs text-rose-900 max-w-sm w-full space-y-1">
                          <span className="font-bold uppercase text-[10px] tracking-wide text-rose-700 block">
                            Motivo Reportado:
                          </span>
                          <p className="font-medium">
                            {pedido.ocorrencia?.tipo || 'DESTINATARIO_AUSENTE'}: {pedido.ocorrencia?.descricao}
                          </p>
                        </div>
                      </div>

                      {/* Botões de Ação da Mesa */}
                      {!estaEmTratativa ? (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-200/80">
                          <button
                            type="button"
                            onClick={() => {
                              setPedidoTratativaId(pedido.id);
                              setTipoAcaoDecisao('reagendar');
                              setParceiraReentregaId(pedido.atribuicao?.parceiraPerna1Id || 'fretes_seu_ze');
                            }}
                            className="px-3.5 py-2 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reagendar Nova Tentativa (Amanhã)
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPedidoTratativaId(pedido.id);
                              setTipoAcaoDecisao('devolver');
                            }}
                            className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> Devolver ao Remetente
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-3 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              {tipoAcaoDecisao === 'reagendar'
                                ? `Reagendar Reentrega (${pedido.codigoCurto})`
                                : `Autorizar Devolução ao Lojista (${pedido.codigoCurto})`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPedidoTratativaId(null);
                                setTipoAcaoDecisao(null);
                              }}
                              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              Cancelar
                            </button>
                          </div>

                          {tipoAcaoDecisao === 'reagendar' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Nova Data e Janela Desejada:
                                </label>
                                <input
                                  type="text"
                                  value={novaDataReentrega}
                                  onChange={(e) => setNovaDataReentrega(e.target.value)}
                                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sealog-blue"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Transportadora Responsável:
                                </label>
                                <select
                                  value={parceiraReentregaId}
                                  onChange={(e) => setParceiraReentregaId(e.target.value)}
                                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sealog-blue cursor-pointer"
                                >
                                  {parceiras.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.nome}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="sm:col-span-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleExecutarReagendamento(pedido.id)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Confirmar Reagendamento e Liberar para Rota
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 text-xs">
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                  Justificativa / Motivo da Devolução:
                                </label>
                                <textarea
                                  value={motivoDevolucao}
                                  onChange={(e) => setMotivoDevolucao(e.target.value)}
                                  rows={2}
                                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-sealog-blue"
                                />
                              </div>

                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleExecutarDevolucao(pedido)}
                                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Confirmar Devolução e Gerar Guia
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Histórico de Devoluções do Dia */}
            {pedidosDevolvidos.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Devoluções Autorizadas Hoje ({pedidosDevolvidos.length}):
                </h4>
                <div className="space-y-2">
                  {pedidosDevolvidos.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-900 mr-2">{dev.codigoCurto}</span>
                        <StatusBadge status={dev.status} />
                        <span className="text-slate-600 ml-2">{dev.destinatario.nome}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{dev.observacoes}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setGuiaDevolucaoExibida({
                            pedido: dev,
                            numeroGuia: `DEV-2026-${dev.codigoCurto.replace('SL-', '')}`,
                            dataHora: new Date().toLocaleString('pt-BR'),
                            motivo: dev.observacoes || 'Insucesso na entrega.',
                          })
                        }
                        className="px-2.5 py-1 text-[11px] font-bold text-sealog-blue bg-white border border-slate-300 rounded hover:bg-slate-50 transition shrink-0"
                      >
                        Visualizar Guia DEV
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal / Card da Guia Oficial de Devolução SEALog */}
          {guiaDevolucaoExibida && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sealog-blue" />
                    <h5 className="font-black text-slate-900 text-sm">
                      Guia Oficial de Devolução ao Remetente
                    </h5>
                  </div>
                  <button
                    onClick={() => setGuiaDevolucaoExibida(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span>Nº DA GUIA:</span>
                    <strong className="text-sealog-blue">{guiaDevolucaoExibida.numeroGuia}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>CÓDIGO PEDIDO:</span>
                    <strong>{guiaDevolucaoExibida.pedido.codigoCurto}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>DATA/HORA EMISSÃO:</span>
                    <span>{guiaDevolucaoExibida.dataHora}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>LOJISTA REMETENTE:</span>
                    <strong>
                      {lojistas.find((l) => l.id === guiaDevolucaoExibida.pedido.lojistaId)?.nome ||
                        guiaDevolucaoExibida.pedido.lojistaId}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>VOLUME / CARGA:</span>
                    <span>
                      {guiaDevolucaoExibida.pedido.volume} ({guiaDevolucaoExibida.pedido.pesoKg} kg)
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase">Motivo Formal:</span>
                    <span>{guiaDevolucaoExibida.motivo}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                  ⚠️ O motorista parceiro deve coletar a assinatura do lojista no retorno físico da mercadoria para comprovação de custódia.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      mostrarNotificacao('info', 'Guia de devolução pronta para impressão.');
                      window.print();
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir Guia
                  </button>
                  <button
                    onClick={() => setGuiaDevolucaoExibida(null)}
                    className="px-4 py-2 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aba: Cadastros */}
      {abaAtiva === 'cadastros' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-sealog-blue" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gestão de Lojistas e Empresas Parceiras
                </h3>
                <p className="text-xs text-slate-500">
                  Cadastre, edite e remova lojas conveniadas e transportadoras terceirizadas da malha regional.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setLojistaEmEdicao(null);
                  setFormLojista({
                    nome: '',
                    cnpj: '',
                    responsavel: '',
                    telefone: '',
                    bairro: 'Boa Viagem',
                    cidade: 'Recife',
                  });
                  setModalLojistaAberto(true);
                }}
                className="px-3 py-1.5 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Lojista
              </button>
              <button
                type="button"
                onClick={() => {
                  setParceiraEmEdicao(null);
                  setFormParceira({
                    nome: '',
                    tipoOperacao: 'PLANILHA',
                    limiteDiario: 60,
                    contato: '',
                    telefone: '',
                    regioesAtendidas: ['Boa Viagem', 'Pina'],
                  });
                  setModalParceiraAberto(true);
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Transportadora
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Lojistas Credenciados */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Lojistas Conveniados ({lojistas.length})</h5>
                  <span className="text-[11px] text-slate-500 font-medium">Lojas que emitem coletas na malha</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLojistaEmEdicao(null);
                    setFormLojista({
                      nome: '',
                      cnpj: '',
                      responsavel: '',
                      telefone: '',
                      bairro: 'Boa Viagem',
                      cidade: 'Recife',
                    });
                    setModalLojistaAberto(true);
                  }}
                  className="text-sealog-blue hover:underline text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Cadastrar Loja
                </button>
              </div>

              <div className="divide-y divide-slate-200">
                {lojistas.map((l) => (
                  <div key={l.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{l.nome}</span>
                        <span className="text-[10px] bg-blue-50 text-sealog-blue font-semibold px-2 py-0.5 rounded border border-blue-200">
                          {l.totalPedidosMes} envios/mês
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        {l.bairro} ({l.cidade}) • CNPJ: {l.cnpj}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Responsável: <strong>{l.responsavel}</strong> ({l.telefone})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        title="Editar lojista"
                        onClick={() => {
                          setLojistaEmEdicao(l);
                          setFormLojista({
                            nome: l.nome,
                            cnpj: l.cnpj,
                            responsavel: l.responsavel,
                            telefone: l.telefone,
                            bairro: l.bairro,
                            cidade: l.cidade,
                          });
                          setModalLojistaAberto(true);
                        }}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-sealog-blue rounded-lg border border-slate-300 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Remover lojista"
                        onClick={() => {
                          if (window.confirm(`Deseja remover o lojista "${l.nome}"?`)) {
                            removerLojista(l.id);
                          }
                        }}
                        className="p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-300 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transportadoras Credenciadas */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">Transportadoras Credenciadas ({parceiras.length})</h5>
                  <span className="text-[11px] text-slate-500 font-medium">Empresas e frotas terceirizadas</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setParceiraEmEdicao(null);
                    setFormParceira({
                      nome: '',
                      tipoOperacao: 'PLANILHA',
                      limiteDiario: 60,
                      contato: '',
                      telefone: '',
                      regioesAtendidas: ['Boa Viagem', 'Pina'],
                    });
                    setModalParceiraAberto(true);
                  }}
                  className="text-emerald-700 hover:underline text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Credenciar Frota
                </button>
              </div>

              <div className="space-y-3">
                {parceiras.map((p) => (
                  <div key={p.id} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-sealog-blue" />
                        <span className="font-bold text-slate-900 text-sm">{p.nome}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-sealog-blue px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          {p.entregasAtribuidasHoje} coletas hoje
                        </span>
                        <button
                          type="button"
                          title="Editar transportadora"
                          onClick={() => {
                            setParceiraEmEdicao(p);
                            setFormParceira({
                              nome: p.nome,
                              tipoOperacao: p.tipoOperacao,
                              limiteDiario: p.limiteDiario,
                              contato: p.contato,
                              telefone: p.telefone,
                              regioesAtendidas: [...p.regioesAtendidas],
                            });
                            setModalParceiraAberto(true);
                          }}
                          className="p-1 text-slate-400 hover:text-sealog-blue transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Remover transportadora"
                          onClick={() => {
                            if (window.confirm(`Deseja descredenciar a parceira "${p.nome}"?`)) {
                              removerParceira(p.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 flex justify-between">
                      <span>Capacidade: <strong>{p.limiteDiario}/dia</strong></span>
                      <span>Canal: <strong>{p.tipoOperacao}</strong></span>
                      <span>Contato: <strong>{p.contato}</strong> ({p.telefone})</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Áreas Atendidas (Bairros):
                        </span>
                        {p.regioesAtendidas.includes('Santo Antônio') && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Sobreposição: Santo Antônio
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.regioesAtendidas.map((r) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              r === 'Santo Antônio'
                                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal CRUD: Lojista */}
          {modalLojistaAberto && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-xs">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-sealog-blue" />
                    <h5 className="font-bold text-slate-900 text-sm">
                      {lojistaEmEdicao ? `Editar Lojista: ${lojistaEmEdicao.nome}` : 'Cadastrar Novo Lojista'}
                    </h5>
                  </div>
                  <button
                    onClick={() => setModalLojistaAberto(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!formLojista.nome.trim() || !formLojista.cnpj.trim() || !formLojista.responsavel.trim()) {
                      mostrarNotificacao('warning', 'Preencha os campos obrigatórios do lojista.');
                      return;
                    }
                    if (lojistaEmEdicao) {
                      atualizarLojista(lojistaEmEdicao.id, formLojista);
                    } else {
                      adicionarLojista(formLojista);
                    }
                    setModalLojistaAberto(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nome Fantasia / Razão Social *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Livraria & Café do Recife"
                      value={formLojista.nome}
                      onChange={(e) => setFormLojista({ ...formLojista, nome: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">CNPJ *</label>
                      <input
                        type="text"
                        required
                        placeholder="00.000.000/0001-00"
                        value={formLojista.cnpj}
                        onChange={(e) => setFormLojista({ ...formLojista, cnpj: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="(81) 98888-0000"
                        value={formLojista.telefone}
                        onChange={(e) => setFormLojista({ ...formLojista, telefone: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Responsável / Gerente *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo do contato da loja"
                      value={formLojista.responsavel}
                      onChange={(e) => setFormLojista({ ...formLojista, responsavel: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Bairro *</label>
                      <select
                        value={formLojista.bairro}
                        onChange={(e) => setFormLojista({ ...formLojista, bairro: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      >
                        {BAIRROS_ATENDIDOS_RMR.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Cidade *</label>
                      <input
                        type="text"
                        required
                        value={formLojista.cidade}
                        onChange={(e) => setFormLojista({ ...formLojista, cidade: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setModalLojistaAberto(false)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar Lojista
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal CRUD: Transportadora Parceira */}
          {modalParceiraAberto && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-xs">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-sealog-blue" />
                    <h5 className="font-bold text-slate-900 text-sm">
                      {parceiraEmEdicao ? `Editar Parceira: ${parceiraEmEdicao.nome}` : 'Credenciar Nova Transportadora'}
                    </h5>
                  </div>
                  <button
                    onClick={() => setModalParceiraAberto(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!formParceira.nome.trim() || !formParceira.contato.trim() || !formParceira.telefone.trim()) {
                      mostrarNotificacao('warning', 'Preencha os campos obrigatórios da transportadora.');
                      return;
                    }
                    if (formParceira.regioesAtendidas.length === 0) {
                      mostrarNotificacao('warning', 'Selecione pelo menos um bairro na área de cobertura.');
                      return;
                    }
                    if (parceiraEmEdicao) {
                      atualizarParceira(parceiraEmEdicao.id, formParceira);
                    } else {
                      adicionarParceira(formParceira);
                    }
                    setModalParceiraAberto(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nome da Transportadora *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Expresso Litoral PE"
                      value={formParceira.nome}
                      onChange={(e) => setFormParceira({ ...formParceira, nome: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Canal de Comunicação *</label>
                      <select
                        value={formParceira.tipoOperacao}
                        onChange={(e) =>
                          setFormParceira({
                            ...formParceira,
                            tipoOperacao: e.target.value as 'PLANILHA' | 'WHATSAPP',
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="PLANILHA">Planilha / EDI (Empresa)</option>
                        <option value="WHATSAPP">WhatsApp Gestão (Autônomo/Regional)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Capacidade Diária (Entregas) *</label>
                      <input
                        type="number"
                        required
                        min={5}
                        max={300}
                        value={formParceira.limiteDiario}
                        onChange={(e) =>
                          setFormParceira({ ...formParceira, limiteDiario: Number(e.target.value) || 30 })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Contato / Despachante *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome do coordenador"
                        value={formParceira.contato}
                        onChange={(e) => setFormParceira({ ...formParceira, contato: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Telefone com DDD *</label>
                      <input
                        type="text"
                        required
                        placeholder="(81) 99999-0000"
                        value={formParceira.telefone}
                        onChange={(e) => setFormParceira({ ...formParceira, telefone: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-700 font-semibold">
                        Área de Cobertura (Bairros Atendidos) *
                      </label>
                      <span className="text-[11px] text-sealog-blue font-bold">
                        {formParceira.regioesAtendidas.length} selecionados
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {BAIRROS_ATENDIDOS_RMR.map((bairro) => {
                        const checked = formParceira.regioesAtendidas.includes(bairro);
                        return (
                          <label
                            key={bairro}
                            className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer transition text-[11px] ${
                              checked ? 'bg-blue-100 text-sealog-blue font-bold' : 'hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setFormParceira((ant) => ({
                                  ...ant,
                                  regioesAtendidas: checked
                                    ? ant.regioesAtendidas.filter((b) => b !== bairro)
                                    : [...ant.regioesAtendidas, bairro],
                                }));
                              }}
                              className="rounded text-sealog-blue focus:ring-sealog-blue h-3.5 w-3.5"
                            />
                            <span>{bairro}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setModalParceiraAberto(false)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar Transportadora
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
