import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import {
  Smartphone,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Clock,
  X,
} from 'lucide-react';
import { TipoOcorrencia } from '../../types';
import originalPhoto from '../../assets/original.png';

export const EntregadorPwaView: React.FC = () => {
  const {
    pedidos,
    magicLinks,
    linkMagicoAtivoToken,
    parceiras,
    atualizarPedido,
    mostrarNotificacao,
    setPerfilAtivo,
  } = useSealogStore();

  const [pedidoSelecionadoId, setPedidoSelecionadoId] = useState<string | null>(null);
  const [modalTipo, setModalTipo] = useState<'sucesso' | 'insucesso' | null>(null);
  const [nomeRecebedor, setNomeRecebedor] = useState('');
  const [motivoOcorrencia, setMotivoOcorrencia] = useState<TipoOcorrencia>('DESTINATARIO_AUSENTE');
  const [observacaoLivre, setObservacaoLivre] = useState('');

  // Pega entregas geradas no link mágico ativo ou último gerado
  const linkAtivo = linkMagicoAtivoToken
    ? magicLinks.find((l) => l.token === linkMagicoAtivoToken)
    : magicLinks && magicLinks.length > 0
    ? magicLinks[magicLinks.length - 1]
    : null;

  const motoristaNome = linkAtivo ? linkAtivo.nomeEntregador : 'Severino Silva (Moto 04)';
  const parceiraDoLink = linkAtivo ? parceiras.find((p) => p.id === linkAtivo.parceiraId) : null;
  const transportadoraNome = parceiraDoLink
    ? `${parceiraDoLink.nome} • Rota de Entrega`
    : 'Fretes do Seu Zé • Rota Recife Sul';

  const entregasDaRota = linkAtivo
    ? pedidos.filter((p) => linkAtivo.pedidosCodigos.includes(p.codigoCurto))
    : pedidos.filter((p) => p.status === 'ATRIBUIDO' || p.status === 'EM_TRANSITO').slice(0, 5);

  const handleConfirmarEntrega = (pedidoId: string) => {
    atualizarPedido(pedidoId, {
      status: 'CONCLUIDO',
      elegibilidadeFinanceira: 'LIBERADO',
      comprovante: {
        recebedorNome: nomeRecebedor.trim() || 'Portaria / Morador',
        entregueEm: new Date().toISOString(),
        fotoUrl: originalPhoto,
        canalConfirmacao: 'WHATSAPP_FOTO',
        observacao: 'Foto capturada via PWA móvel do entregador',
      },
    });
    setModalTipo(null);
    setPedidoSelecionadoId(null);
    setNomeRecebedor('');
    mostrarNotificacao('success', 'Entrega confirmada com foto de comprovante anexada!');
  };

  const handleReportarInsucesso = (pedidoId: string) => {
    atualizarPedido(pedidoId, {
      status: 'OCORRENCIA',
      ocorrencia: {
        tipo: motivoOcorrencia,
        descricao: observacaoLivre || 'Insucesso reportado pelo entregador',
        registradaEm: new Date().toISOString(),
        imputavelParceira: false,
        resolvida: false,
      },
    });
    setModalTipo(null);
    setPedidoSelecionadoId(null);
    setObservacaoLivre('');
    mostrarNotificacao('warning', 'Ocorrência registrada e encaminhada para triagem do analista.');
  };

  return (
    <div className="py-4 space-y-4">
      {/* Banner explicativo do simulador mobile */}
      <div className="max-w-md mx-auto bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-sealog-blue shrink-0" />
          <span>Simulador de PWA móvel do entregador (Link de 24h)</span>
        </div>
        <button
          onClick={() => setPerfilAtivo('parceiro')}
          className="text-sealog-blue font-bold hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </button>
      </div>

      {/* Frame Simulando Smartphone */}
      <div className="max-w-sm mx-auto bg-slate-900 p-3 rounded-3xl shadow-2xl border-4 border-slate-800">
        <div className="bg-slate-50 rounded-2xl overflow-hidden min-h-[580px] flex flex-col justify-between text-slate-900">
          {/* Header Mobile do App do Entregador */}
          <div className="bg-sealog-blue text-white p-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-blue-200">
              <span>SEALog Entregador</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> Hoje • 24h
              </span>
            </div>
            <div className="font-bold text-sm">{motoristaNome}</div>
            <div className="text-[11px] text-sealog-cream">{transportadoraNome}</div>
          </div>

          {/* Lista de Entregas da Rota */}
          <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-[460px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
              Paradas do Dia ({entregasDaRota.length})
            </div>

            {entregasDaRota.map((p, index) => {
              const concluido = p.status === 'CONCLUIDO';
              const ocorrencia = p.status === 'OCORRENCIA';

              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border text-xs space-y-2 transition ${
                    concluido
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : ocorrencia
                      ? 'bg-rose-50/70 border-rose-200'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sealog-blue">
                      #{index + 1} • {p.codigoCurto}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        concluido
                          ? 'bg-emerald-100 text-emerald-800'
                          : ocorrencia
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {concluido ? 'Entregue' : ocorrencia ? 'Ocorrência' : 'Pendente'}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>{p.destinatario.nome}</span>
                      {p.horarioAgendado && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Horário: {p.horarioAgendado}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} — {p.destinatario.endereco.bairro}
                    </div>
                  </div>

                  {!concluido && !ocorrencia && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setPedidoSelecionadoId(p.id);
                          setModalTipo('sucesso');
                        }}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Camera className="w-3 h-3" /> Foto POD
                      </button>
                      <button
                        onClick={() => {
                          setPedidoSelecionadoId(p.id);
                          setModalTipo('insucesso');
                        }}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg text-[11px] font-bold transition"
                      >
                        Insucesso
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Barra de Status Inferior do Celular */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500">
            Acesso PWA sem login via token diário
          </div>
        </div>
      </div>

      {/* Modal de Conclusão com Foto */}
      {modalTipo === 'sucesso' && pedidoSelecionadoId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-900 text-sm">Comprovante de Entrega</h5>
              <button onClick={() => setModalTipo(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome do Recebedor:</label>
                <input
                  type="text"
                  placeholder="Ex: Severino (Portaria)"
                  value={nomeRecebedor}
                  onChange={(e) => setNomeRecebedor(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-2">
                <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                <span className="block text-[11px] text-slate-600 font-medium">
                  Foto da portaria ou canhoto assinada anexada
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">✓ Imagem capturada (84 KB)</span>
              </div>
            </div>

            <button
              onClick={() => handleConfirmarEntrega(pedidoSelecionadoId)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar e Enviar Prova
            </button>
          </div>
        </div>
      )}

      {/* Modal de Insucesso / Ocorrência */}
      {modalTipo === 'insucesso' && pedidoSelecionadoId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-900 text-sm">Reportar Insucesso</h5>
              <button onClick={() => setModalTipo(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Motivo Padronizado:</label>
                <select
                  value={motivoOcorrencia}
                  onChange={(e) => setMotivoOcorrencia(e.target.value as TipoOcorrencia)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="DESTINATARIO_AUSENTE">Destinatário Ausente</option>
                  <option value="ENDERECO_INCORRETO">Endereço Incorreto / Não Localizado</option>
                  <option value="CLIENTE_RECUSOU">Recusa do Cliente</option>
                  <option value="INTEMPERIE_CHUVAS">Área sem Acesso / Alagamento</option>
                  <option value="OUTROS">Outro Motivo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observações do Motorista:</label>
                <textarea
                  placeholder="Ex: Interfone quebrado e portão trancado."
                  value={observacaoLivre}
                  onChange={(e) => setObservacaoLivre(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  rows={2}
                />
              </div>
            </div>

            <button
              onClick={() => handleReportarInsucesso(pedidoSelecionadoId)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Enviar Ocorrência
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
