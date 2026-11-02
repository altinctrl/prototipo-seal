import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { StatusBadge } from '../common/StatusBadge';
import { FinanceStatusBadge } from '../common/FinanceStatusBadge';
import { DespachoMalhaModule } from '../common/DespachoMalhaModule';
import {
  Warehouse,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Building,
  Camera,
  Check,
  Volume2,
} from 'lucide-react';
import originalPhoto from '../../assets/original.png';

interface CardBaixa {
  codigo: string;
  destinatario: string;
  bairro: string;
  recebedor: string;
  tipoProva: string;
  elegibilidadeSugerida: 'LIBERADO' | 'RETIDO_PRAZO' | 'PENDENTE';
  fotoUrl?: string;
  observacao: string;
}

interface LoteBaixa {
  id: string;
  remetente: string;
  contato: string;
  canal: string;
  horario: string;
  textoBruto: string;
  temAudio: boolean;
  audioNome?: string;
  temFoto: boolean;
  cards: CardBaixa[];
}

export const AnalistaView: React.FC = () => {
  const {
    pedidos,
    registrarEntradaGalpao,
    liberarPerna2,
    homologarBaixa,
    atualizarPedido,
    mostrarNotificacao,
    abaAtiva,
    escopoMoscow,
  } = useSealogStore();

  const [parceiraPerna2Selecionada, setParceiraPerna2Selecionada] = useState('fretes_seu_ze');

  const pedidosNoGalpao = pedidos.filter((p) => p.status === 'NO_GALPAO');
  const pedidosEmTransitoCrossDocking = pedidos.filter(
    (p) => p.tipoTransporte === 'CROSS_DOCKING' && p.status === 'EM_TRANSITO'
  );
  const pedidosConcluidos = pedidos.filter((p) => p.status === 'CONCLUIDO');
  const pedidosOcorrencia = pedidos.filter((p) => p.status === 'OCORRENCIA');

  // Lotes 1:N simulados de confirmações enviadas pela GESTÃO das transportadoras parceiras
  const lotesBaixas: LoteBaixa[] = [
    {
      id: 'lote_refactor_01',
      remetente: 'Refactor Express (Mesa de Despacho & EDI)',
      contato: 'Juliana Mendes — Supervisora de Operações',
      canal: 'PLANILHA / WHATSAPP CORPORATIVO',
      horario: '11:42',
      textoBruto:
        'Mesa Refactor: Seguem confirmações de baixa de rotas concluídas pela frota da manhã. Comprovantes com canhoto assinado e fotos de portaria anexados para homologação e liberação financeira imediata.',
      temAudio: false,
      temFoto: true,
      cards: [
        {
          codigo: 'SL-1046',
          destinatario: 'Juliana Bezerra Coutinho',
          bairro: 'Espinheiro',
          recebedor: 'Juliana Bezerra (Titular)',
          tipoProva: 'FOTO_POD',
          elegibilidadeSugerida: 'LIBERADO',
          fotoUrl: originalPhoto,
          observacao: 'Canhoto assinado e carimbado na recepção corporativa.',
        },
        {
          codigo: 'SL-1042',
          destinatario: 'Carlos Drummond da Silva',
          bairro: 'Piedade',
          recebedor: 'Carlos Drummond (Titular)',
          tipoProva: 'FOTO_POD',
          elegibilidadeSugerida: 'LIBERADO',
          fotoUrl: originalPhoto,
          observacao: 'Canhoto assinado com RG do recebedor e foto da fachada.',
        },
        {
          codigo: 'SL-1044',
          destinatario: 'Beatriz Mendonça',
          bairro: 'Graças',
          recebedor: 'Manoel Gomes (Zelador)',
          tipoProva: 'FOTO_POD',
          elegibilidadeSugerida: 'LIBERADO',
          fotoUrl: originalPhoto,
          observacao: 'Recebido na portaria social com foto da caixa lacrada.',
        },
        {
          codigo: 'SL-1045',
          destinatario: 'Lucas Albuquerque',
          bairro: 'Boa Viagem',
          recebedor: 'Fernanda Albuquerque (Esposa)',
          tipoProva: 'FOTO_POD',
          elegibilidadeSugerida: 'LIBERADO',
          fotoUrl: originalPhoto,
          observacao: 'Entrega direta em domicílio com foto de comprovante físico.',
        },
      ],
    },
    {
      id: 'lote_seuze_01',
      remetente: 'Fretes do Seu Zé (Gestão / Despacho)',
      contato: 'José Bonifácio (Seu Zé)',
      canal: 'WHATSAPP GESTÃO',
      horario: '13:48',
      textoBruto:
        'Boa tarde analista! O nosso motorista Severino acabou de concluir os pedidos do percurso Boa Viagem. A câmera do celular dele deu problema e foi sem foto no SL-1041 e no SL-1047, mas tá anotado e assinado no caderno de bordo. Já no SL-1043 a moradora não estava e no SL-1048 entregou pro síndico.',
      temAudio: true,
      audioNome: 'audio_baixas_tarde_seuze.ogg (0:22)',
      temFoto: false,
      cards: [
        {
          codigo: 'SL-1041',
          destinatario: 'Marta Menezes',
          bairro: 'Boa Viagem (Cond. MarAzul)',
          recebedor: 'Severino (Portaria)',
          tipoProva: 'INFORME_TEXTO_VERBAL',
          elegibilidadeSugerida: 'RETIDO_PRAZO',
          observacao: 'Baixa textual confirmada pela gerência do Seu Zé sem foto (carência 48h).',
        },
        {
          codigo: 'SL-1043',
          destinatario: 'Ana Clara Albuquerque',
          bairro: 'Boa Viagem',
          recebedor: 'Destinatário Ausente',
          tipoProva: 'OCORRENCIA',
          elegibilidadeSugerida: 'PENDENTE',
          observacao: 'Moradora ausente e portaria não reteve o buquê perecível.',
        },
        {
          codigo: 'SL-1047',
          destinatario: 'Mariana Vasconcelos',
          bairro: 'Piedade',
          recebedor: 'D. Maria de Lourdes (Vizinha Apto 202)',
          tipoProva: 'INFORME_TEXTO_VERBAL',
          elegibilidadeSugerida: 'RETIDO_PRAZO',
          observacao: 'Entregue com vizinha autorizada verbalmente (carência 48h).',
        },
        {
          codigo: 'SL-1048',
          destinatario: 'Thiago Lacerda',
          bairro: 'Boa Viagem',
          recebedor: 'Gilberto (Síndico)',
          tipoProva: 'INFORME_TEXTO_VERBAL',
          elegibilidadeSugerida: 'RETIDO_PRAZO',
          observacao: 'Retido na administração do condomínio pelo síndico.',
        },
      ],
    },
  ];

  const handleHomologarCard = (card: CardBaixa) => {
    const pedido = pedidos.find((p) => p.codigoCurto === card.codigo);
    if (!pedido) {
      mostrarNotificacao('warning', `Pedido ${card.codigo} não encontrado.`);
      return;
    }

    if (card.tipoProva === 'OCORRENCIA') {
      atualizarPedido(pedido.id, {
        status: 'OCORRENCIA',
        ocorrencia: {
          tipo: 'DESTINATARIO_AUSENTE',
          descricao: card.observacao,
          registradaEm: new Date().toISOString(),
          imputavelParceira: false,
          resolvida: false,
        },
      });
      mostrarNotificacao('warning', `Ocorrência registrada para o pedido ${card.codigo}.`);
      return;
    }

    homologarBaixa(
      pedido.id,
      {
        recebedorNome: card.recebedor,
        entregueEm: new Date().toISOString(),
        fotoUrl: card.fotoUrl,
        canalConfirmacao: card.tipoProva === 'FOTO_POD' ? 'WHATSAPP_FOTO' : 'WHATSAPP_TEXTO',
        observacao: card.observacao,
      },
      card.elegibilidadeSugerida
    );
  };

  const handleHomologarTodoLote = (lote: LoteBaixa) => {
    lote.cards.forEach((card) => {
      handleHomologarCard(card);
    });
    mostrarNotificacao('success', `Todas as baixas do lote ${lote.remetente} foram processadas!`);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Título e Contadores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {abaAtiva === 'galpao'
              ? 'Galpão Central — Transbordo (Cross-Docking)'
              : abaAtiva === 'atribuicao'
              ? 'Atribuição Operacional de Coletas e Rotas'
              : abaAtiva === 'ocorrencias'
              ? 'Tratativa de Ocorrências de Campo'
              : 'Triagem de Baixas das Empresas Parceiras (HITL 1:N)'}
          </h3>
          <p className="text-xs text-slate-500">
            Gestão operacional de transportadoras credenciadas e custódia física de mercadorias no Hub Central.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
            {pedidosNoGalpao.length} no Galpão
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
            {pedidosConcluidos.length} baixas validadas
          </span>
        </div>
      </div>

      {/* Aba: Triagem de Baixas das Parceiras (Split-Screen HITL 1:N — Lista Unificada) */}
      {abaAtiva === 'triagem_parceiras' && escopoMoscow === 'completo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sealog-blue" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Triagem Split-Screen de Baixas — Fila Unificada de Transportadoras
                </h4>
                <p className="text-[11px] text-slate-500">
                  Auditoria de comprovantes e conferência de entregas enviadas pela supervisão da Refactor Express e Fretes do Seu Zé.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-sealog-blue border border-blue-200">
                {lotesBaixas.reduce((acc, l) => acc + l.cards.length, 0)} comprovantes auditados
              </span>
            </div>
          </div>

          {/* Lista Vertical de Lotes das Transportadoras */}
          <div className="space-y-6">
            {lotesBaixas.map((lote) => (
              <div
                key={lote.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4"
              >
                {/* Cabeçalho do Lote da Parceira */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-sealog-blue" />
                    <span className="font-bold text-slate-900 text-sm">{lote.remetente}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {lote.canal}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Hoje às {lote.horario}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleHomologarTodoLote(lote)}
                    className="px-3 py-1.5 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Homologar Todas Deste Lote ({lote.cards.length})</span>
                  </button>
                </div>

                {/* Painel Split-Screen HITL da Parceira */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Painel Esquerdo: Mensagem Bruta e Evidências da Gestão Parceira */}
                  <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span>Evidência Transmitida</span>
                      <span className="font-mono text-[11px]">{lote.horario}</span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <p className="text-xs text-slate-800 italic font-mono leading-relaxed">
                        "{lote.textoBruto}"
                      </p>

                      {lote.temAudio && (
                        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg text-xs text-slate-700">
                          <Volume2 className="w-4 h-4 text-sealog-blue shrink-0" />
                          <span className="text-[11px] font-mono truncate">{lote.audioNome || 'audio_gravacao.ogg'}</span>
                          <span className="ml-auto text-[10px] font-bold text-slate-500">Player Simulado</span>
                        </div>
                      )}

                      {lote.temFoto && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Foto do Canhoto Recebida:
                          </span>
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-40 bg-slate-100 flex items-center justify-center">
                            <img
                              src={originalPhoto}
                              alt="Comprovante com Foto"
                              className="object-cover w-full h-36 hover:scale-105 transition"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                      <div>Supervisão: <strong>{lote.contato}</strong></div>
                      <div>Canal Auditado: <strong>{lote.canal}</strong></div>
                    </div>
                  </div>

                  {/* Painel Direito: Cards de Baixa Propostos (Relação 1:N) */}
                  <div className="md:col-span-7 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                      <span>Baixas Identificadas ({lote.cards.length}):</span>
                      <span className="text-[11px] text-slate-400">Classificação financeira automática</span>
                    </div>

                    <div className="space-y-2.5">
                      {lote.cards.map((card) => {
                        const pedidoReal = pedidos.find((p) => p.codigoCurto === card.codigo);
                        const jaConcluido = pedidoReal?.status === 'CONCLUIDO';

                        return (
                          <div
                            key={card.codigo}
                            className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition ${
                              jaConcluido
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : card.tipoProva === 'OCORRENCIA'
                                ? 'bg-rose-50/50 border-rose-200'
                                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sealog-blue text-sm">
                                  {card.codigo}
                                </span>
                                {pedidoReal && <StatusBadge status={pedidoReal.status} />}
                                {pedidoReal && <FinanceStatusBadge status={pedidoReal.elegibilidadeFinanceira} />}
                              </div>

                              {card.tipoProva === 'FOTO_POD' ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <Camera className="w-3 h-3" /> Foto POD Válida (Repasse Imediato)
                                </span>
                              ) : card.tipoProva === 'INFORME_TEXTO_VERBAL' ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Informe Textual (Carência 48h)
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3" /> Insucesso / Ocorrência
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Destinatário:</span>
                                <span className="font-bold text-slate-900">{card.destinatario}</span> ({card.bairro})
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Recebedor Declarado:</span>
                                <span className="font-semibold text-slate-800">{card.recebedor}</span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                              Nota: {card.observacao}
                            </p>

                            <div className="pt-1 flex items-center justify-end gap-2">
                              {jaConcluido ? (
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Baixa Homologada no Sistema
                                </span>
                              ) : card.tipoProva === 'OCORRENCIA' ? (
                                <button
                                  type="button"
                                  onClick={() => handleHomologarCard(card)}
                                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" /> Registrar Ocorrência
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleHomologarCard(card)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>
                                    Homologar Baixa ({card.elegibilidadeSugerida === 'LIBERADO' ? 'Liberado' : 'Carência 48h'})
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba: Atribuição Operacional de Coletas e Rotas */}
      {abaAtiva === 'atribuicao' && (
        <DespachoMalhaModule
          titulo="Atribuição de Coleta no Lojista e Rotas (Analista)"
          subtitulo="Selecione pedidos criados para alocar transportadoras com balanceamento dinâmico de regiões e limite diário."
        />
      )}

      {/* Aba: Galpão Central (Transbordo Cross-Docking) */}
      {abaAtiva === 'galpao' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Galpão Central — Custódia Física e Transbordo
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pacotes recebidos no 1º Trecho (Coleta no Lojista) aguardando transferência para o 2º Trecho (Entrega Final).
                </p>
              </div>
            </div>
          </div>

          {pedidosNoGalpao.length === 0 ? (
            <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
              Nenhum pacote sob custódia no Galpão Central no momento.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                Pacotes em Custódia no Galpão ({pedidosNoGalpao.length}):
              </div>

              {pedidosNoGalpao.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-900 text-base">
                        {p.codigoCurto}
                      </span>
                      <StatusBadge status={p.status} />
                      <span className="text-slate-500">
                        Coletado no 1º Trecho por:{' '}
                        <strong>
                          {p.atribuicao?.parceiraPerna1Id === 'refactor_express' ? 'Refactor Express' : 'Fretes do Seu Zé'}
                        </strong>
                      </span>
                    </div>

                    <p className="font-semibold text-slate-800">
                      Destino: {p.destinatario.nome} — {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} ({p.destinatario.endereco.bairro})
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Volume: {p.volume} ({p.pesoKg} kg) | Transbordo entre zonas
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={parceiraPerna2Selecionada}
                      onChange={(e) => setParceiraPerna2Selecionada(e.target.value)}
                      className="text-xs p-2 bg-white border border-slate-300 rounded-lg cursor-pointer"
                      title="Transportadora para o 2º Trecho (Entrega Final)"
                    >
                      <option value="fretes_seu_ze">Fretes do Seu Zé (Zona Sul)</option>
                      <option value="refactor_express">Refactor Express (Zona Norte)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => liberarPerna2(p.id, parceiraPerna2Selecionada)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 transition shadow-xs cursor-pointer"
                    >
                      <span>Liberar p/ Entrega Final</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fila de Pacotes a Caminho do Galpão */}
          {pedidosEmTransitoCrossDocking.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-200 space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                A Caminho do Galpão Central (Coletas em Trânsito):
              </h5>
              <div className="space-y-2">
                {pedidosEmTransitoCrossDocking.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-900">{p.codigoCurto}</span>
                        <span className="font-semibold text-slate-800">{p.destinatario.nome}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Origem Lojista → Galpão Central • {p.volume}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => registrarEntradaGalpao(p.id)}
                      className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      Confirmar Entrada no Galpão
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aba: Ocorrências de Campo */}
      {abaAtiva === 'ocorrencias' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ocorrências Operacionais de Campo</h4>
                <p className="text-[11px] text-slate-500">
                  Insucessos reportados pelas empresas parceiras que exigem contato com o lojista antes do fim do turno.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
              {pedidosOcorrencia.length} pendentes
            </span>
          </div>

          {pedidosOcorrencia.length === 0 ? (
            <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
              Nenhuma ocorrência pendente de tratativa no momento.
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosOcorrencia.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-900">{p.codigoCurto}</span>
                      <StatusBadge status={p.status} />
                      <span className="font-semibold text-slate-800">{p.destinatario.nome}</span>
                      {p.perecivel && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                          Perecível
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700">
                      Motivo: <strong>{p.ocorrencia?.tipo || 'DESTINATARIO_AUSENTE'}</strong> — {p.ocorrencia?.descricao}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Endereço: {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} ({p.destinatario.endereco.bairro})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        mostrarNotificacao('info', `Contato via WhatsApp iniciado com o lojista do pedido ${p.codigoCurto}.`)
                      }
                      className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold transition cursor-pointer"
                    >
                      Acionar Lojista Remetente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
