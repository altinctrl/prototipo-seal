import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { StatusBadge } from '../common/StatusBadge';
import { FinanceStatusBadge } from '../common/FinanceStatusBadge';
import {
  Truck,
  Route,
  ClipboardCheck,
  QrCode,
  Download,
  Smartphone,
  CheckCircle2,
  CheckCircle,
  Camera,
  Check,
  X,
  UploadCloud,
  AlertTriangle,
  Play,
  Clock,
} from 'lucide-react';
import originalPhoto from '../../assets/original.png';

export const ParceiroView: React.FC = () => {
  const {
    pedidos,
    parceiras,
    parceiraSelecionadaId,
    abaAtiva,
    escopoMoscow,
    gerarMagicLink,
    setPerfilAtivo,
    homologarBaixa,
    alterarStatusParceiro,
    mostrarNotificacao,
  } = useSealogStore();

  const parceiraAtual =
    parceiras.find((p) => p.id === parceiraSelecionadaId) || parceiras[0];

  const [nomeEntregador, setNomeEntregador] = useState('Severino Silva (Moto 04)');
  const [tokenGerado, setTokenGerado] = useState<string | null>(null);

  // Seleção de pedidos para rota do Link Mágico
  const [pedidosSelecionadosLink, setPedidosSelecionadosLink] = useState<string[]>([]);

  // Estados para alteração direta de status pelo Parceiro
  const [modalConfirmarEntregaId, setModalConfirmarEntregaId] = useState<string | null>(null);
  const [recebedorDiretoNome, setRecebedorDiretoNome] = useState('Portaria / Morador Titular');
  const [modalOcorrenciaId, setModalOcorrenciaId] = useState<string | null>(null);
  const [motivoOcorrenciaParceiro, setMotivoOcorrenciaParceiro] = useState(
    'Destinatário ausente na primeira tentativa de entrega.'
  );

  // Estados da Prestação de Contas
  const [pedidoBaixaId, setPedidoBaixaId] = useState<string | null>(null);
  const [recebedorNome, setRecebedorNome] = useState('');
  const [recebedorDoc, setRecebedorDoc] = useState('');
  const [observacaoBaixa, setObservacaoBaixa] = useState('');
  const [fotoAnexada, setFotoAnexada] = useState(true);

  // Pedidos sob custódia desta parceira (Perna 1 ou Perna 2)
  const pedidosDaParceira = pedidos.filter(
    (p) =>
      p.atribuicao?.parceiraPerna1Id === parceiraAtual.id ||
      p.atribuicao?.parceiraPerna2Id === parceiraAtual.id
  );

  const pedidosPendentesBaixa = pedidosDaParceira.filter(
    (p) => p.status === 'ATRIBUIDO' || p.status === 'EM_TRANSITO'
  );

  const handleGerarLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeEntregador.trim()) {
      mostrarNotificacao('warning', 'Informe o nome do entregador de rua.');
      return;
    }
    if (pedidosSelecionadosLink.length === 0) {
      mostrarNotificacao('warning', 'Selecione pelo menos 1 pedido da lista para compor a rota do link mágico.');
      return;
    }
    const token = gerarMagicLink(parceiraAtual.id, nomeEntregador, pedidosSelecionadosLink);
    setTokenGerado(token);
    mostrarNotificacao('success', `Link Mágico gerado com ${pedidosSelecionadosLink.length} entregas!`);
  };

  const exportarRomaneioCSV = () => {
    const cabecalho = 'CodigoCurto;Destinatario;Telefone;Logradouro;Numero;Bairro;Cidade;Volume;PesoKg;HorarioAgendado;Status\n';
    const linhas = pedidosDaParceira
      .map((p) =>
        [
          p.codigoCurto,
          `"${p.destinatario.nome}"`,
          p.destinatario.telefone,
          `"${p.destinatario.endereco.logradouro}"`,
          p.destinatario.endereco.numero,
          p.destinatario.endereco.bairro,
          p.destinatario.endereco.cidade,
          `"${p.volume}"`,
          p.pesoKg ? `${p.pesoKg} kg` : 'N/A',
          `"${p.dataDesejada}"`,
          p.status,
        ].join(';')
      )
      .join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `romaneio_rotas_${parceiraAtual.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarNotificacao('success', `Romaneio de rotas exportado (.csv) para ${parceiraAtual.nome}!`);
  };

  const handleConfirmarBaixaIndividual = () => {
    if (!pedidoBaixaId) return;
    if (!recebedorNome.trim()) {
      mostrarNotificacao('warning', 'Informe o nome do recebedor da mercadoria.');
      return;
    }

    homologarBaixa(
      pedidoBaixaId,
      {
        recebedorNome: recebedorNome.trim(),
        recebedorDoc: recebedorDoc.trim() || undefined,
        entregueEm: new Date().toISOString(),
        fotoUrl: fotoAnexada ? originalPhoto : undefined,
        canalConfirmacao: fotoAnexada ? 'WHATSAPP_FOTO' : 'WHATSAPP_TEXTO',
        observacao: observacaoBaixa.trim() || 'Comprovante auditado pelo despacho.',
      },
      fotoAnexada ? 'LIBERADO' : 'RETIDO_PRAZO'
    );

    setPedidoBaixaId(null);
    setRecebedorNome('');
    setRecebedorDoc('');
    setObservacaoBaixa('');
  };

  const handleSimularRetornoPlanilha = () => {
    if (pedidosPendentesBaixa.length === 0) {
      mostrarNotificacao('info', 'Não há entregas pendentes de baixa para esta parceira.');
      return;
    }

    pedidosPendentesBaixa.forEach((ped) => {
      homologarBaixa(
        ped.id,
        {
          recebedorNome: 'Recebedor Portaria / Residência',
          entregueEm: new Date().toISOString(),
          fotoUrl: originalPhoto,
          canalConfirmacao: 'PLANILHA',
          observacao: 'Baixa em lote via planilha de retorno EDI/Excel.',
        },
        'LIBERADO'
      );
    });

    mostrarNotificacao('success', `Planilha de retorno processada! ${pedidosPendentesBaixa.length} entregas concluídas.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Identificação da Transportadora */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sealog-blue/10 text-sealog-blue rounded-xl border border-sealog-blue/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{parceiraAtual.nome}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Canal: {parceiraAtual.tipoOperacao}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Contato: {parceiraAtual.contato} ({parceiraAtual.telefone}) • Regiões: {parceiraAtual.regioesAtendidas.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-500 block">Capacidade Diária:</span>
            <span className="font-bold text-slate-900 text-sm">
              {parceiraAtual.limiteDiario} entregas/dia
            </span>
          </div>
          <div className="border-l border-slate-300 pl-4">
            <span className="text-slate-500 block">Atribuídas Hoje:</span>
            <span className="font-bold text-sealog-blue text-sm">
              {pedidosDaParceira.length} pacotes
            </span>
          </div>
        </div>
      </div>

      {/* Aba: Rotas Atribuídas */}
      {(abaAtiva === 'rotas' || !abaAtiva) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Route className="w-5 h-5 text-sealog-blue" />
              <h4 className="font-bold text-slate-900 text-sm">
                Entregas Atribuídas à Frota ({pedidosDaParceira.length})
              </h4>
            </div>
            <button
              onClick={exportarRomaneioCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Exportar Romaneio (.csv)
            </button>
          </div>

          {pedidosDaParceira.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              Nenhuma entrega atribuída a esta transportadora no momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pedidosDaParceira.map((p) => (
                <div
                  key={p.id}
                  className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sealog-blue text-sm">{p.codigoCurto}</span>
                      <StatusBadge status={p.status} />
                      <FinanceStatusBadge status={p.elegibilidadeFinanceira} />
                      <span className="text-[11px] text-slate-500 font-medium">
                        {p.tipoTransporte === 'CROSS_DOCKING' ? 'Cross-Docking (Galpão)' : 'Entrega Direta'}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900">
                      Destinatário: {p.destinatario.nome} ({p.destinatario.telefone})
                    </p>
                    <p className="text-slate-600">
                      {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} — {p.destinatario.endereco.bairro} ({p.destinatario.endereco.cidade})
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="text-right text-slate-500">
                      <span className="block font-medium">Volume: {p.volume} ({p.pesoKg} kg)</span>
                      <span className="block text-[11px]">Prazo: {p.dataDesejada}</span>
                      {p.horarioAgendado && (
                        <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mt-0.5">
                          <Clock className="w-3 h-3 text-purple-600" />
                          Horário: {p.horarioAgendado}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {p.status === 'ATRIBUIDO' && (
                        <button
                          type="button"
                          onClick={() => alterarStatusParceiro(p.id, 'EM_TRANSITO')}
                          className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Play className="w-3.5 h-3.5" /> Iniciar Rota
                        </button>
                      )}

                      {p.status === 'EM_TRANSITO' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setModalConfirmarEntregaId(p.id);
                              setRecebedorDiretoNome('Portaria / Morador Titular');
                            }}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Confirmar Entrega
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setModalOcorrenciaId(p.id);
                              setMotivoOcorrenciaParceiro('Destinatário ausente na primeira tentativa.');
                            }}
                            className="px-2 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" /> Ocorrência
                          </button>
                        </>
                      )}

                      {p.status === 'CONCLUIDO' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Entregue
                        </span>
                      )}

                      {p.status === 'OCORRENCIA' && (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Em Tratativa
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Aba: Prestação de Contas */}
      {abaAtiva === 'prestacao_contas' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">Prestação de Contas e Baixas</h4>
                <p className="text-xs text-slate-500">
                  Envie comprovantes de entrega individuais (com foto da fachada/canhoto) ou importe planilha de retorno.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimularRetornoPlanilha}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Importar Planilha de Retorno ({pedidosPendentesBaixa.length} pendentes)</span>
            </button>
          </div>

          {/* Fila de Entregas Pendentes de Baixa */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Entregas em Rota Aguardando Baixa ({pedidosPendentesBaixa.length}):
            </h5>

            {pedidosPendentesBaixa.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                ✓ Todas as entregas desta parceira já foram concluídas e baixadas!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {pedidosPendentesBaixa.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sealog-blue">{p.codigoCurto}</span>
                        <StatusBadge status={p.status} />
                        <span className="font-semibold text-slate-800">{p.destinatario.nome}</span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} ({p.destinatario.endereco.bairro})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPedidoBaixaId(p.id);
                        setRecebedorNome(p.destinatario.nome);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Dar Baixa com Comprovante</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal / Formulário de Baixa com Foto */}
          {pedidoBaixaId && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-300 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h5 className="font-bold text-slate-900 text-sm">
                    Prestar Contas da Entrega ({pedidos.find((p) => p.id === pedidoBaixaId)?.codigoCurto})
                  </h5>
                  <button onClick={() => setPedidoBaixaId(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Nome do Recebedor:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Severino (Portaria)"
                      value={recebedorNome}
                      onChange={(e) => setRecebedorNome(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Documento do Recebedor (Opcional):</label>
                    <input
                      type="text"
                      placeholder="Ex: RG 4.512.980 SDS ou CPF"
                      value={recebedorDoc}
                      onChange={(e) => setRecebedorDoc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fotoAnexada}
                      onChange={(e) => setFotoAnexada(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span className="font-bold text-slate-800">
                      Anexar Foto do Canhoto / Fachada (Garante Repasse Imediato)
                    </span>
                  </label>

                  {fotoAnexada && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-3">
                      <img src={originalPhoto} alt="Comprovante" className="w-14 h-14 object-cover rounded-lg border" />
                      <div className="text-[11px] text-emerald-900">
                        <strong>✓ Foto carregada (original.png - 84 KB)</strong>
                        <p className="text-emerald-700">Classificação: Elegibilidade LIBERADA</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Observações da Entrega:</label>
                    <textarea
                      placeholder="Ex: Entregue sem avarias na portaria."
                      value={observacaoBaixa}
                      onChange={(e) => setObservacaoBaixa(e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPedidoBaixaId(null)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmarBaixaIndividual}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirmar e Transmitir Baixa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aba: Link Mágico para Entregadores (PWA Diário) */}
      {abaAtiva === 'link_magico' && escopoMoscow === 'completo' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sealog-blue" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">Gerador de Link Mágico Diário</h4>
                <p className="text-xs text-slate-500">
                  Selecione as entregas da frota e gere um link móvel de 24h sem login para seu motorista no PWA.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-sealog-blue border border-blue-200">
                {pedidosSelecionadosLink.length} de {pedidosPendentesBaixa.length} pedidos selecionados
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            {/* Formulário do Entregador */}
            <div className="lg:col-span-4 space-y-4">
              <form onSubmit={handleGerarLink} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Nome / Identificação do Entregador:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Severino Silva (Moto 04)"
                    value={nomeEntregador}
                    onChange={(e) => setNomeEntregador(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue text-xs"
                  />
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Transportadora:</span>
                    <strong className="text-slate-800">{parceiraAtual.nome}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Validade do Token:</span>
                    <strong className="text-emerald-700">24 horas</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Entregas no Manifesto:</span>
                    <strong className={pedidosSelecionadosLink.length > 0 ? 'text-sealog-blue font-bold' : 'text-rose-600'}>
                      {pedidosSelecionadosLink.length} selecionadas
                    </strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={pedidosSelecionadosLink.length === 0}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    pedidosSelecionadosLink.length > 0
                      ? 'bg-sealog-blue hover:bg-sealog-blue-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Gerar Link com {pedidosSelecionadosLink.length} Pedidos</span>
                </button>
              </form>

              {/* Resultado do Link Gerado */}
              {tokenGerado && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-fadeIn text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Link Mágico gerado e ativo!</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-slate-800 break-all select-all text-[11px]">
                    https://sealog.app/r/{tokenGerado}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPerfilAtivo('entregador_pwa')}
                    className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Abrir no Simulador de Entregador PWA
                  </button>
                </div>
              )}
            </div>

            {/* Tabela de Seleção Explícita de Pedidos */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                  Marque os pacotes para atribuir à rota deste entregador:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPedidosSelecionadosLink(pedidosPendentesBaixa.map((p) => p.codigoCurto))
                    }
                    className="px-2.5 py-1 text-[11px] font-bold text-sealog-blue bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition cursor-pointer"
                  >
                    Selecionar Todos ({pedidosPendentesBaixa.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPedidosSelecionadosLink([])}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition cursor-pointer"
                  >
                    Limpar Seleção
                  </button>
                </div>
              </div>

              {pedidosPendentesBaixa.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                  Não há pedidos pendentes de entrega para esta parceira no momento.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-[420px] overflow-y-auto">
                  {pedidosPendentesBaixa.map((p) => {
                    const marcado = pedidosSelecionadosLink.includes(p.codigoCurto);

                    return (
                      <label
                        key={p.id}
                        className={`p-3 flex items-start gap-3 cursor-pointer transition ${
                          marcado ? 'bg-blue-50/60' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={marcado}
                          onChange={() => {
                            setPedidosSelecionadosLink((ant) =>
                              marcado
                                ? ant.filter((c) => c !== p.codigoCurto)
                                : [...ant, p.codigoCurto]
                            );
                          }}
                          className="mt-0.5 rounded text-sealog-blue focus:ring-sealog-blue h-4 w-4 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sealog-blue">{p.codigoCurto}</span>
                            <StatusBadge status={p.status} />
                            <span className="font-semibold text-slate-900 truncate">
                              {p.destinatario.nome}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} — {p.destinatario.endereco.bairro} ({p.destinatario.endereco.cidade})
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                            <span>Volume: <strong>{p.volume}</strong></span>
                            <span>Peso: <strong>{p.pesoKg} kg</strong></span>
                            <span>Janela: <strong>{p.dataDesejada}</strong></span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Entrega Direta pelo Parceiro (Sem Foto) */}
      {modalConfirmarEntregaId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h5 className="font-bold text-slate-900 text-sm">
                  Confirmar Entrega Direta ({pedidos.find((p) => p.id === modalConfirmarEntregaId)?.codigoCurto})
                </h5>
              </div>
              <button
                onClick={() => setModalConfirmarEntregaId(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-slate-600">
                A baixa declarada pelo portal do parceiro entra automaticamente com <strong>carência de 48 horas</strong> para auditoria financeira ou contestação do cliente.
              </p>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nome do Recebedor / Responsável:
                </label>
                <input
                  type="text"
                  required
                  value={recebedorDiretoNome}
                  onChange={(e) => setRecebedorDiretoNome(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
                ℹ️ Não é exigido upload de foto no momento da baixa pelo parceiro. O repasse será liberado após o decurso do prazo de contestação.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalConfirmarEntregaId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  alterarStatusParceiro(modalConfirmarEntregaId, 'CONCLUIDO', recebedorDiretoNome);
                  setModalConfirmarEntregaId(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Confirmar Entrega
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reportar Ocorrência de Campo */}
      {modalOcorrenciaId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h5 className="font-bold text-slate-900 text-sm">
                  Reportar Ocorrência ({pedidos.find((p) => p.id === modalOcorrenciaId)?.codigoCurto})
                </h5>
              </div>
              <button
                onClick={() => setModalOcorrenciaId(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Motivo do Insucesso / Ocorrência:
                </label>
                <select
                  value={motivoOcorrenciaParceiro}
                  onChange={(e) => setMotivoOcorrenciaParceiro(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Destinatário ausente na primeira tentativa de entrega.">
                    Destinatário Ausente
                  </option>
                  <option value="Endereço não localizado ou número não encontrado no logradouro.">
                    Endereço Não Localizado / Incompleto
                  </option>
                  <option value="Recusa de recebimento pelo destinatário ou portaria.">
                    Recusa de Recebimento
                  </option>
                  <option value="Vias bloqueadas ou alagadas na região metropolitana.">
                    Intempérie / Vias Bloqueadas
                  </option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                ⚠️ Esta ocorrência será enviada imediatamente para a Mesa de Decisão do Coordenador e painel do Analista.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalOcorrenciaId(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  alterarStatusParceiro(modalOcorrenciaId, 'OCORRENCIA', motivoOcorrenciaParceiro);
                  setModalOcorrenciaId(null);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Registrar Ocorrência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
