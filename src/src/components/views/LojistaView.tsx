import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { StatusBadge } from '../common/StatusBadge';
import { FinanceStatusBadge } from '../common/FinanceStatusBadge';
import { BAIRROS_ATENDIDOS_RMR } from '../../data/initialData';
import { TipoPrazoEntrega } from '../../types';
import {
  Store,
  Package,
  ShieldAlert,
  FileText,
  Clock,
  ExternalLink,
  PlusCircle,
  Flame,
  Plus,
  Calendar,
} from 'lucide-react';

export const LojistaView: React.FC = () => {
  const {
    pedidos,
    lojistas,
    lojistaSelecionadoId,
    abaAtiva,
    contestarEntrega,
    adicionarPedido,
    mostrarNotificacao,
  } = useSealogStore();

  const lojistaAtual =
    lojistas.find((l) => l.id === lojistaSelecionadoId) || lojistas[0];

  const pedidosDoLojista = pedidos.filter(
    (p) => p.lojistaId === lojistaAtual.id
  );

  // Estados do Formulário de Novo Envio
  const [nomeDestinatario, setNomeDestinatario] = useState('');
  const [telefoneDestinatario, setTelefoneDestinatario] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numeroPredial, setNumeroPredial] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('Boa Viagem');
  const cidade = 'Recife';
  const [volume, setVolume] = useState('1 caixa pequena');
  const [pesoKg, setPesoKg] = useState('1.0');
  const [perecivel, setPerecivel] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [tipoPrazo, setTipoPrazo] = useState<TipoPrazoEntrega>('D_MAIS_1');
  const [dataAgendadaCustom, setDataAgendadaCustom] = useState('2026-10-31');
  const [temHorarioMarcado, setTemHorarioMarcado] = useState(false);
  const [horarioMarcadoCustom, setHorarioMarcadoCustom] = useState('14:30');

  const handleCadastrarEnvio = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeDestinatario.trim() || !logradouro.trim()) {
      mostrarNotificacao('warning', 'Informe o nome do destinatário e a rua de entrega.');
      return;
    }

    if (!numeroPredial.trim()) {
      mostrarNotificacao('warning', 'Informe o número predial para cadastrar o pedido pelo portal.');
      return;
    }

    let dataDesejadaFormatada = '30/10/2026 (D+1 - Padrão)';
    if (tipoPrazo === 'AGENDADA') {
      const partes = dataAgendadaCustom.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        dataDesejadaFormatada = `${dia}/${mes}/${ano} (Agendada)`;
      } else {
        dataDesejadaFormatada = `${dataAgendadaCustom} (Agendada)`;
      }
    }

    if (temHorarioMarcado && horarioMarcadoCustom.trim()) {
      dataDesejadaFormatada += ` às ${horarioMarcadoCustom.trim()} (Horário Marcado)`;
    } else {
      dataDesejadaFormatada += ` até 18:00`;
    }

    const novo = adicionarPedido({
      lojistaId: lojistaAtual.id,
      destinatario: {
        nome: nomeDestinatario.trim(),
        telefone: telefoneDestinatario.trim() || '(81) 99999-0000',
        endereco: {
          logradouro: logradouro.trim(),
          numero: numeroPredial.trim(),
          complemento: complemento.trim() || undefined,
          bairro,
          cidade,
        },
      },
      volume: volume.trim() || '1 pacote',
      pesoKg: parseFloat(pesoKg) || 1.0,
      dataCriacao: new Date().toISOString(),
      dataDesejada: dataDesejadaFormatada,
      prazoEntrega: tipoPrazo,
      dataAgendada: tipoPrazo === 'AGENDADA' ? dataAgendadaCustom : undefined,
      horarioAgendado: temHorarioMarcado && horarioMarcadoCustom.trim() ? horarioMarcadoCustom.trim() : undefined,
      temHorarioMarcado,
      observacoes: observacoes.trim() || undefined,
      perecivel,
      status: 'CRIADO',
      tipoTransporte: 'DIRETO',
      elegibilidadeFinanceira: 'PENDENTE',
    });

    // Limpeza
    setNomeDestinatario('');
    setTelefoneDestinatario('');
    setLogradouro('');
    setNumeroPredial('');
    setComplemento('');
    setObservacoes('');

    mostrarNotificacao(
      'success',
      `Pedido ${novo.codigoCurto} cadastrado com sucesso e encaminhado para o despacho!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Informações da Empresa Lojista */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-700">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{lojistaAtual.nome}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                CNPJ: {lojistaAtual.cnpj}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Responsável: {lojistaAtual.responsavel} | Bairro: {lojistaAtual.bairro} ({lojistaAtual.cidade})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-500 block">Envios no Mês:</span>
            <span className="font-bold text-slate-900 text-sm">
              {lojistaAtual.totalPedidosMes} pacotes
            </span>
          </div>
          <div className="border-l border-slate-300 pl-3">
            <span className="text-slate-500 block">Janela de Contestação:</span>
            <span className="font-bold text-slate-700 text-sm">48 horas úteis</span>
          </div>
        </div>
      </div>

      {/* Aba: Meus Envios */}
      {(abaAtiva === 'meus_envios' || !abaAtiva) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-sealog-blue" />
              <h4 className="font-bold text-slate-900 text-sm">
                Envios Cadastrados ({pedidosDoLojista.length})
              </h4>
            </div>
          </div>

          {pedidosDoLojista.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Nenhum pedido ativo cadastrado para este estabelecimento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pedidosDoLojista.map((pedido) => (
                <div
                  key={pedido.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-sealog-blue">
                        {pedido.codigoCurto}
                      </span>
                      <StatusBadge status={pedido.status} />
                      <FinanceStatusBadge status={pedido.elegibilidadeFinanceira} />
                      {pedido.perecivel && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          <Flame className="w-3 h-3 text-rose-600" /> Perecível
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-slate-900">
                      Destinatário: {pedido.destinatario.nome} ({pedido.destinatario.telefone})
                    </p>
                    <p className="text-slate-600">
                      Endereço: {pedido.destinatario.endereco.logradouro},{' '}
                      {pedido.destinatario.endereco.numero || '(Sem número)'}{' '}
                      {pedido.destinatario.endereco.complemento && `(${pedido.destinatario.endereco.complemento})`} —{' '}
                      {pedido.destinatario.endereco.bairro}
                    </p>
                    <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                      <span>Volume: <strong>{pedido.volume}</strong> ({pedido.pesoKg} kg)</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3 text-sealog-blue" />
                        Previsão: {pedido.dataDesejada}
                      </span>
                      {pedido.horarioAgendado && (
                        <span className="inline-flex items-center gap-1 font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-purple-600" />
                          Horário Marcado: {pedido.horarioAgendado}
                        </span>
                      )}
                    </p>

                    {/* Informações de Comprovante se Entregue */}
                    {pedido.comprovante && (
                      <div className="mt-2 p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs flex items-center gap-2 text-emerald-950">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold">Comprovante de Entrega:</span> Recebido por{' '}
                          <strong>{pedido.comprovante.recebedorNome}</strong>{' '}
                          {pedido.comprovante.recebedorDoc && `(${pedido.comprovante.recebedorDoc})`} às{' '}
                          {pedido.comprovante.entregueEm.slice(11, 16)}
                        </div>
                        {pedido.comprovante.fotoUrl && (
                          <a
                            href={pedido.comprovante.fotoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-sealog-blue underline"
                          >
                            Ver Foto <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Detalhe de Ocorrência se Houver */}
                    {pedido.ocorrencia && (
                      <div className="mt-2 p-2.5 bg-rose-50/80 rounded-lg border border-rose-200 text-xs text-rose-950 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                        <div>
                          <span className="font-bold">Ocorrência de Campo:</span> {pedido.ocorrencia.descricao}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ações do Lojista */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                    {pedido.status === 'CONCLUIDO' &&
                      pedido.elegibilidadeFinanceira !== 'BLOQUEADO_GLOSA' && (
                        <button
                          onClick={() => contestarEntrega(pedido.id, 'Contestação formal registrada pelo lojista via portal')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition cursor-pointer"
                          title="Registrar contestação de entrega em até 48h úteis"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>Contestar Entrega (48h)</span>
                        </button>
                      )}

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Criado em {pedido.dataCriacao.slice(0, 10)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba: Novo Envio */}
      {abaAtiva === 'novo_envio' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-sealog-blue" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Novo Envio de Mercadoria</h3>
                <p className="text-xs text-slate-500">
                  Preencha os dados da entrega para solicitação de coleta e despacho imediato pela malha operacional.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCadastrarEnvio} className="space-y-4 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nome do Destinatário:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Barreto"
                    value={nomeDestinatario}
                    onChange={(e) => setNomeDestinatario(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telefone do Destinatário:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: (81) 99888-2233"
                    value={telefoneDestinatario}
                    onChange={(e) => setTelefoneDestinatario(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Logradouro / Rua:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua São Miguel"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Número Predial:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 890 (Ou deixe vazio para testar fallback)"
                    value={numeroPredial}
                    onChange={(e) => setNumeroPredial(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Complemento / Referência:</label>
                  <input
                    type="text"
                    placeholder="Ex: Apto 302, Bloco B"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bairro de Destino:</label>
                  <select
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {BAIRROS_ATENDIDOS_RMR.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Descrição do Volume:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1 sacola com cabide (Roupas)"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Peso em kg (para cubagem):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="Ex: 1.5"
                    value={pesoKg}
                    onChange={(e) => setPesoKg(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Seletor de Previsão / Prazo de Entrega (D+1 por padrão ou data agendada) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sealog-blue" />
                    <span>Previsão de Entrega do Pacote:</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">Padrão logístico da SEALog: Dia útil seguinte (D+1)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                      tipoPrazo === 'D_MAIS_1'
                        ? 'bg-blue-50 border-sealog-blue text-slate-900 font-semibold ring-1 ring-sealog-blue/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoPrazoLojista"
                      value="D_MAIS_1"
                      checked={tipoPrazo === 'D_MAIS_1'}
                      onChange={() => setTipoPrazo('D_MAIS_1')}
                      className="mt-0.5 text-sealog-blue focus:ring-sealog-blue"
                    />
                    <div>
                      <div className="text-xs font-bold text-sealog-blue">Dia Seguinte (D+1) — Padrão SEALog</div>
                      <div className="text-[10px] text-slate-500">Entrega programada para amanhã (30/10)</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                      tipoPrazo === 'AGENDADA'
                        ? 'bg-purple-50 border-purple-500 text-slate-900 font-semibold ring-1 ring-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoPrazoLojista"
                      value="AGENDADA"
                      checked={tipoPrazo === 'AGENDADA'}
                      onChange={() => setTipoPrazo('AGENDADA')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-purple-700">Data Agendada</div>
                      <div className="text-[10px] text-slate-500">Escolha uma data futura específica</div>
                    </div>
                  </label>
                </div>

                {tipoPrazo === 'AGENDADA' && (
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                    <span className="text-slate-600 text-[11px] font-medium">Data agendada da entrega:</span>
                    <input
                      type="date"
                      min="2026-10-29"
                      value={dataAgendadaCustom}
                      onChange={(e) => setDataAgendadaCustom(e.target.value)}
                      className="p-1.5 border border-slate-300 rounded-md text-xs bg-white text-slate-800 focus:ring-1 focus:ring-sealog-blue"
                    />
                  </div>
                )}

                {/* Opção de Horário Marcado para Entrega */}
                <div className="pt-2.5 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs select-none">
                      <input
                        type="checkbox"
                        checked={temHorarioMarcado}
                        onChange={(e) => setTemHorarioMarcado(e.target.checked)}
                        className="rounded text-sealog-blue focus:ring-sealog-blue h-4 w-4"
                      />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        Definir Horário Marcado para a Entrega
                      </span>
                    </label>
                    <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Janela Prioritária
                    </span>
                  </div>

                  {temHorarioMarcado && (
                    <div className="p-2.5 bg-white rounded-lg border border-purple-200 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-600 font-medium">Horário agendado:</span>
                        <input
                          type="time"
                          value={horarioMarcadoCustom}
                          onChange={(e) => setHorarioMarcadoCustom(e.target.value)}
                          className="p-1.5 border border-slate-300 rounded-md text-xs bg-slate-50 font-bold text-slate-900 focus:ring-1 focus:ring-purple-600"
                        />
                        <div className="flex items-center gap-1">
                          {['10:00', '11:30', '14:00', '15:30', '17:00'].map((hora) => (
                            <button
                              key={hora}
                              type="button"
                              onClick={() => setHorarioMarcadoCustom(hora)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition cursor-pointer ${
                                horarioMarcadoCustom === hora
                                  ? 'bg-purple-600 text-white border-purple-700'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {hora}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        O entregador ou transportadora será sinalizado com prioridade de horário para cumprimento da janela.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkbox Perecível */}
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={perecivel}
                  onChange={(e) => setPerecivel(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  Carga Perecível (Buquês, alimentos ou medicamentos sensíveis)
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto py-2.5 px-6 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Solicitar Coleta e Envio (CRIADO)
                </button>
              </div>
            </form>
        </div>
      )}
    </div>
  );
};
