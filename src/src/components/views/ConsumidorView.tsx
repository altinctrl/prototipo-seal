import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  CloudRain,
} from 'lucide-react';
import mascotLogo from '../../assets/mascot_with_box.svg';

export const ConsumidorView: React.FC = () => {
  const { pedidos, alertaContingencia } = useSealogStore();
  const [codigoBusca, setCodigoBusca] = useState('SL-1041');

  const mascararNome = (nomeCompleto: string) => {
    const partes = nomeCompleto.trim().split(' ');
    if (partes.length <= 1) {
      return partes[0].slice(0, 3) + '***';
    }
    return `${partes[0]} ${partes[1].charAt(0)}.***`;
  };

  const pedidoEncontrado = pedidos.find(
    (p) => p.codigoCurto.toUpperCase() === codigoBusca.trim().toUpperCase()
  );

  const exemplos = ['SL-1041', 'SL-1042', 'SL-1043', 'SL-1044', 'SL-1045', 'SL-1046'];

  const bairroAtingidoPorContingencia =
    alertaContingencia &&
    alertaContingencia.ativo &&
    pedidoEncontrado &&
    alertaContingencia.regiao.includes(pedidoEncontrado.destinatario.endereco.bairro);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Caixa de Busca Pública */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-sealog-cream rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-sealog-blue/10">
          <img
            src={mascotLogo}
            alt="Mascote SEALog"
            className="w-10 h-10 object-contain"
          />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rastrear Encomenda
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Consulte o status do seu pacote em tempo real pelo código de rastreio (ex: <code>SL-1041</code>).
          </p>
        </div>

        <div className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={codigoBusca}
              onChange={(e) => setCodigoBusca(e.target.value.toUpperCase())}
              placeholder="Ex: SL-1041"
              className="w-full pl-9 pr-3 py-2.5 text-sm font-mono font-bold tracking-wider uppercase bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sealog-blue text-slate-800"
            />
          </div>
        </div>

        {/* Atalhos para testar os cenários da banca */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Exemplos da Demonstração:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {exemplos.map((cod) => (
              <button
                key={cod}
                onClick={() => setCodigoBusca(cod)}
                className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition cursor-pointer ${
                  codigoBusca === cod
                    ? 'bg-sealog-blue text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cod}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cartão de Detalhes da Encomenda */}
      {pedidoEncontrado ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Código de Rastreamento
              </span>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-2xl font-mono font-black text-sealog-blue">
                  {pedidoEncontrado.codigoCurto}
                </span>
                <StatusBadge status={pedidoEncontrado.status} />
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">
              <span className="block font-medium">Previsão de Entrega</span>
              <span className="font-bold text-slate-800 text-sm block">
                {pedidoEncontrado.dataDesejada}
              </span>
              {pedidoEncontrado.horarioAgendado && (
                <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mt-1">
                  <Clock className="w-3 h-3 text-purple-600" />
                  Horário Marcado: {pedidoEncontrado.horarioAgendado}
                </span>
              )}
            </div>
          </div>

          {/* Banner de Contingência Climática Amigável ao Consumidor */}
          {bairroAtingidoPorContingencia && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <CloudRain className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Aviso sobre o Prazo na sua Região</strong>
                Devido a fortes chuvas em {pedidoEncontrado.destinatario.endereco.bairro}, as equipes de entrega estão operando com velocidade reduzida por segurança viária. Seu pacote segue sob nossos cuidados!
              </div>
            </div>
          )}

          {/* Dados de Destino com Proteção LGPD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-sealog-blue" /> Destinatário (Proteção LGPD)
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {mascararNome(pedidoEncontrado.destinatario.nome)}
              </span>
              <span className="text-slate-400 block text-[10px] mt-0.5">
                Dados pessoais mascarados conforme Lei Geral de Proteção de Dados.
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sealog-blue" /> Região de Destino
              </span>
              <span className="font-bold text-slate-800 text-sm block">
                {pedidoEncontrado.destinatario.endereco.bairro}
              </span>
              <span className="block text-slate-500 text-[11px]">
                {pedidoEncontrado.destinatario.endereco.cidade} — PE
              </span>
            </div>
          </div>

          {/* Comprovante se Entregue */}
          {pedidoEncontrado.comprovante && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-1 text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Entrega Concluída com Sucesso!
              </div>
              <p>
                Recebido por: <strong>{pedidoEncontrado.comprovante.recebedorNome}</strong>
              </p>
              <p className="text-[11px] text-emerald-700">
                Data/Hora da confirmação: {pedidoEncontrado.comprovante.entregueEm.replace('T', ' às ').slice(0, 19)}
              </p>
            </div>
          )}

          {/* Insucesso / Ocorrência Explicada sem Jargões */}
          {pedidoEncontrado.ocorrencia && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs space-y-1 text-rose-950">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Atualização sobre sua Entrega
              </div>
              <p>
                {pedidoEncontrado.ocorrencia.tipo === 'DESTINATARIO_AUSENTE'
                  ? 'Tentativa de entrega realizada hoje, porém não havia ninguém no local ou na portaria para receber. Uma nova tentativa será realizada no próximo dia útil.'
                  : pedidoEncontrado.ocorrencia.tipo === 'INTEMPERIE_CHUVAS'
                  ? 'Vias de acesso temporariamente bloqueadas por alagamento. Nova tentativa assim que as vias forem liberadas.'
                  : pedidoEncontrado.ocorrencia.descricao}
              </p>
            </div>
          )}

          {/* Linha do Tempo Visual do Pedido */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sealog-blue" /> Linha do Tempo da Encomenda
            </h4>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {pedidoEncontrado.historico.map((h, i) => (
                <div key={h.id || i} className="relative">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-sealog-blue text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                    <Package className="w-2.5 h-2.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{h.evento}</span>
                      <span className="text-[11px] text-slate-400">{h.dataHora}</span>
                    </div>
                    {h.detalhes && (
                      <p className="text-xs text-slate-600 mt-0.5">{h.detalhes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center text-slate-400 text-xs">
          <p className="text-sm font-semibold text-slate-600">
            Nenhuma encomenda encontrada com o código "{codigoBusca}".
          </p>
          <p className="text-slate-400 mt-1">
            Verifique o código digitado ou utilize um dos botões de exemplo acima.
          </p>
        </div>
      )}
    </div>
  );
};
