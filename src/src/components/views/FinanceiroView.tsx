import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { FinanceStatusBadge } from '../common/FinanceStatusBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  Download,
  ShieldCheck,
  Clock,
  ShieldAlert,
  FileText,
  Package,
  Weight,
} from 'lucide-react';
import { Lojista } from '../../types';

export const FinanceiroView: React.FC = () => {
  const { pedidos, lojistas, parceiras, mostrarNotificacao, abaAtiva } = useSealogStore();
  const [filtroElegibilidade, setFiltroElegibilidade] = useState<string>('TODOS');

  const pedidosConcluidos = pedidos.filter((p) => p.status === 'CONCLUIDO');
  const liberados = pedidosConcluidos.filter((p) => p.elegibilidadeFinanceira === 'LIBERADO');
  const retidos = pedidosConcluidos.filter((p) => p.elegibilidadeFinanceira === 'RETIDO_PRAZO');
  const glosados = pedidosConcluidos.filter((p) => p.elegibilidadeFinanceira === 'BLOQUEADO_GLOSA');

  const pedidosExibidos = pedidosConcluidos.filter((p) => {
    if (filtroElegibilidade === 'TODOS') return true;
    return p.elegibilidadeFinanceira === filtroElegibilidade;
  });

  const exportarCSVFechamento = () => {
    const cabecalho =
      'CodigoCurto;Parceira;Lojista;Destinatario;Bairro;Cidade;VolumeTamanho;PesoKg;StatusOperacional;ElegibilidadeFinanceira;Recebedor;Canal;EntregueEm\n';
    const linhas = pedidosConcluidos
      .map((p) => {
        const lojista = lojistas.find((l) => l.id === p.lojistaId);
        const parceira = parceiras.find(
          (pr) => pr.id === p.atribuicao?.parceiraPerna1Id || pr.id === p.atribuicao?.parceiraPerna2Id
        );
        return [
          p.codigoCurto,
          `"${parceira?.nome || 'N/A'}"`,
          `"${lojista?.nome || p.lojistaId}"`,
          `"${p.destinatario.nome}"`,
          p.destinatario.endereco.bairro,
          p.destinatario.endereco.cidade,
          `"${p.volume}"`,
          p.pesoKg ? `${p.pesoKg} kg` : 'N/A',
          p.status,
          p.elegibilidadeFinanceira,
          `"${p.comprovante?.recebedorNome || 'N/A'}"`,
          p.comprovante?.canalConfirmacao || 'N/A',
          p.comprovante?.entregueEm || p.dataCriacao,
        ].join(';');
      })
      .join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fechamento_parceiras_sealog_elegibilidade_cubagem.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarNotificacao(
      'success',
      'Relatório de fechamento exportado (.csv) com cubagem física e status de elegibilidade!'
    );
  };

  const exportarExtratoLojistaCSV = (lojista: Lojista) => {
    const pedidosDoLojista = pedidos.filter((p) => p.lojistaId === lojista.id);
    const cabecalho = 'CodigoCurto;Destinatario;Bairro;Cidade;Volume;PesoKg;DataEnvio;StatusOperacional;Elegibilidade\n';
    const linhas = pedidosDoLojista
      .map((p) =>
        [
          p.codigoCurto,
          `"${p.destinatario.nome}"`,
          p.destinatario.endereco.bairro,
          p.destinatario.endereco.cidade,
          `"${p.volume}"`,
          p.pesoKg ? `${p.pesoKg} kg` : 'N/A',
          p.dataCriacao.slice(0, 10),
          p.status,
          p.elegibilidadeFinanceira,
        ].join(';')
      )
      .join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `extrato_cubagem_${lojista.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarNotificacao('success', `Extrato de cubagem de ${lojista.nome} exportado com sucesso (.csv)!`);
  };

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro de Elegibilidade (Sem valores monetários na plataforma) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Repasse Liberado Imediato
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{liberados.length}</p>
          <span className="text-xs text-emerald-600 font-medium">Com foto comprovante (POD) auditada</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
              Retido em Carência (48h)
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{retidos.length}</p>
          <span className="text-xs text-amber-600 font-medium">Informe textual / verbal (aguarda prazo)</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
              Bloqueado por Glosa
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-black text-rose-700 mt-2">{glosados.length}</p>
          <span className="text-xs text-rose-600 font-medium">Contestado ativamente pelo Lojista</span>
        </div>
      </div>

      {/* Aba: Fechamento de Parceiras */}
      {(abaAtiva === 'fechamento_parceiras' || !abaAtiva) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Fechamento de Fretes das Empresas Parceiras ({pedidosExibidos.length})
              </h4>
              <p className="text-xs text-slate-500">
                Auditoria de elegibilidade e exportação de dados com cubagem física e peso para liquidação no ERP.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filtroElegibilidade}
                onChange={(e) => setFiltroElegibilidade(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue cursor-pointer"
              >
                <option value="TODOS">Todas as Entregas</option>
                <option value="LIBERADO">Apenas Liberadas</option>
                <option value="RETIDO_PRAZO">Apenas Retidas (48h)</option>
                <option value="BLOQUEADO_GLOSA">Apenas Bloqueadas (Glosa)</option>
              </select>

              <button
                type="button"
                onClick={exportarCSVFechamento}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV de Elegibilidade</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {pedidosExibidos.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Nenhum frete encontrado com o filtro selecionado.
              </div>
            ) : (
              pedidosExibidos.map((pedido) => {
                const parceira = parceiras.find(
                  (pr) => pr.id === pedido.atribuicao?.parceiraPerna1Id || pr.id === pedido.atribuicao?.parceiraPerna2Id
                );
                const lojista = lojistas.find((l) => l.id === pedido.lojistaId);

                return (
                  <div
                    key={pedido.id}
                    className="p-4 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sealog-blue text-sm">{pedido.codigoCurto}</span>
                        <StatusBadge status={pedido.status} />
                        <FinanceStatusBadge status={pedido.elegibilidadeFinanceira} />
                      </div>
                      <p className="font-semibold text-slate-900">
                        Destinatário: {pedido.destinatario.nome} — {pedido.destinatario.endereco.bairro} ({pedido.destinatario.endereco.cidade})
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                        <span>Transportadora: <strong>{parceira?.nome || 'N/A'}</strong></span>
                        <span>Remetente: <strong>{lojista?.nome || pedido.lojistaId}</strong></span>
                        <span>Recebedor: <strong>{pedido.comprovante?.recebedorNome || 'N/A'}</strong></span>
                        <span>Canal: <strong>{pedido.comprovante?.canalConfirmacao || 'N/A'}</strong></span>
                      </div>
                    </div>

                    <div className="text-right text-slate-600 shrink-0 space-y-0.5">
                      <span className="font-medium text-slate-800 block text-xs flex items-center justify-end gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {pedido.volume}
                      </span>
                      <span className="text-[11px] text-slate-500 block flex items-center justify-end gap-1">
                        <Weight className="w-3 h-3 text-slate-400" />
                        Peso: {pedido.pesoKg ? `${pedido.pesoKg} kg` : 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Entregue: {pedido.comprovante?.entregueEm.slice(11, 16) || '--:--'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Aba: Faturamento e Conciliação de Lojistas */}
      {abaAtiva === 'faturamento_lojistas' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sealog-blue" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Faturamento e Conciliação de Lojistas</h4>
                <p className="text-xs text-slate-500">
                  Exportação de dados de envios, volumes e cubagem física para cálculo de faturas no ERP externo.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {lojistas.map((l) => {
              const enviosDoLojista = pedidos.filter((p) => p.lojistaId === l.id);

              return (
                <div key={l.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{l.nome}</div>
                    <div className="text-slate-500">CNPJ: {l.cnpj} • {l.bairro} ({l.cidade})</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Envios no ciclo: <strong>{l.totalPedidosMes} consolidados</strong> ({enviosDoLojista.length} ativos hoje)
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => exportarExtratoLojistaCSV(l)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-sealog-blue rounded-lg font-bold text-xs transition border border-slate-300 flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar Extrato de Cubagem (.csv)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
