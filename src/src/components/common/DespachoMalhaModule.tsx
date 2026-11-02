import React, { useState, useMemo } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { StatusBadge } from './StatusBadge';
import { FinanceStatusBadge } from './FinanceStatusBadge';
import {
  TipoTransporte,
  Pedido,
  Parceira,
  Lojista,
  StatusPedido,
  CanalConfirmacao,
  TipoOcorrencia,
  ElegibilidadeFinanceira,
} from '../../types';
import originalPhoto from '../../assets/original.png';
import {
  Truck,
  Sparkles,
  CheckCircle,
  Package,
  Weight,
  Flame,
  ArrowRight,
  Building,
  Zap,
  Check,
  ArrowRightLeft,
  RotateCcw,
  X,
  FileSpreadsheet,
  MessageCircle,
  Pencil,
  Camera,
  FileText,
  AlertTriangle,
  Copy,
  ExternalLink,
  Upload,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface DespachoMalhaModuleProps {
  titulo?: string;
  subtitulo?: string;
}

export const DespachoMalhaModule: React.FC<DespachoMalhaModuleProps> = ({
  titulo = 'Despacho & Atribuição de Coletas',
  subtitulo = 'Distribuição proativa da malha e alocação de pedidos para as transportadoras parceiras.',
}) => {
  const {
    pedidos,
    parceiras,
    lojistas,
    atribuirParceirasEmLote,
    atualizarPedido,
    homologarBaixa,
    mostrarNotificacao,
    escopoMoscow,
  } = useSealogStore();

  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [parceiraManualId, setParceiraManualId] = useState<string>('');
  const [tipoTransporteSelecionado, setTipoTransporteSelecionado] = useState<TipoTransporte>('DIRETO');
  const [mostrarSugestaoProativa, setMostrarSugestaoProativa] = useState<boolean>(false);

  // Estados do Modal de Exportação de Romaneio (WhatsApp & CSV)
  const [parceiraExportacao, setParceiraExportacao] = useState<Parceira | null>(null);
  const [filtroApenasPendentesExport, setFiltroApenasPendentesExport] = useState<boolean>(true);
  const [textoCopiadoFeedback, setTextoCopiadoFeedback] = useState<boolean>(false);

  // Estados do Modal de Alteração de Status & Baixa Operacional (POD)
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState<Pedido | null>(null);
  const [novoStatus, setNovoStatus] = useState<StatusPedido>('CONCLUIDO');
  const [recebedorNome, setRecebedorNome] = useState('');
  const [recebedorDoc, setRecebedorDoc] = useState('');
  const [canalConfirmacao, setCanalConfirmacao] = useState<CanalConfirmacao>('WHATSAPP_FOTO');
  const [temFotoComprovante, setTemFotoComprovante] = useState<boolean>(true);
  const [fotoUrlCustomizada, setFotoUrlCustomizada] = useState<string>(originalPhoto);
  const [observacaoBaixa, setObservacaoBaixa] = useState('');
  const [tipoOcorrencia, setTipoOcorrencia] = useState<TipoOcorrencia>('DESTINATARIO_AUSENTE');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState('');
  const [ocorrenciaImputavel, setOcorrenciaImputavel] = useState<boolean>(false);

  const limparTelefone = (tel: string) => tel.replace(/\D/g, '');

  const gerarTextoRomaneioWhatsApp = (
    parceira: Parceira,
    pedidosDaParceira: Pedido[],
    lojistasList: Lojista[]
  ): string => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    const totalKg = pedidosDaParceira
      .reduce((acc, p) => acc + (p.pesoKg || 0), 0)
      .toFixed(1);

    let msg = `📦 *SEALog — Romaneio de Cargas & Rotas*\n`;
    msg += `🚚 *Transportadora:* ${parceira.nome}\n`;
    msg += `👤 *Contato Operacional:* ${parceira.contato} (${parceira.telefone})\n`;
    msg += `📅 *Emissão:* ${dataHoje}\n`;
    msg += `📊 *Total:* ${pedidosDaParceira.length} pacotes | *Peso Estimado:* ${totalKg} kg\n`;
    msg += `-------------------------------------------\n\n`;

    if (pedidosDaParceira.length === 0) {
      msg += `Nenhum pedido atribuído no momento com os critérios selecionados.\n`;
    } else {
      pedidosDaParceira.forEach((p, idx) => {
        const loj = lojistasList.find((l) => l.id === p.lojistaId);
        const prazo = p.prazoEntrega === 'AGENDADA'
          ? `📅 Agendada: ${p.dataAgendada || p.dataDesejada}`
          : `⚡ Dia Seguinte (D+1 Padrão)`;
        const modalidade = p.tipoTransporte === 'CROSS_DOCKING'
          ? (p.status === 'NO_GALPAO' || p.status === 'LIBERADO_PERNA_2'
              ? '2º Trecho (Hub Central ➔ Destinatário)'
              : '1º Trecho (Coleta no Lojista ➔ Hub Central)')
          : 'Entrega Direta';

        msg += `*#${idx + 1} — [${p.codigoCurto}]* (${p.status})\n`;
        msg += `🏪 *Remetente:* ${loj?.nome || p.lojistaId} (${loj?.bairro || 'Recife'})\n`;
        msg += `🎯 *Destinatário:* ${p.destinatario.nome} — Tel: ${p.destinatario.telefone}\n`;
        msg += `📍 *Endereço:* ${p.destinatario.endereco.logradouro}, ${p.destinatario.endereco.numero || 'S/N'}${p.destinatario.endereco.complemento ? ' - ' + p.destinatario.endereco.complemento : ''} — *${p.destinatario.endereco.bairro}*, ${p.destinatario.endereco.cidade}\n`;
        msg += `📦 *Volume:* ${p.volume} | *Peso:* ${p.pesoKg ? p.pesoKg + ' kg' : 'N/A'}\n`;
        const horario = p.horarioAgendado ? ` | 🕒 Horário Marcado: *${p.horarioAgendado}*` : '';
        msg += `⏰ *Prazo:* ${prazo}${horario} | *Etapa:* ${modalidade}\n`;
        if (p.perecivel) {
          msg += `⚠️ *Atenção:* CARGA PERECÍVEL / PRIORITÁRIA\n`;
        }
        if (p.observacoes) {
          msg += `📝 *Obs:* ${p.observacoes}\n`;
        }
        msg += `\n`;
      });
    }

    msg += `-------------------------------------------\n`;
    msg += `⚠️ *Instruções de Baixa:*\n`;
    msg += `Ao concluir cada entrega, favor enviar por WhatsApp:\n`;
    msg += `• Código do pacote\n`;
    msg += `• Nome e RG/CPF do recebedor\n`;
    msg += `• Foto do canhoto assinado ou da entrega (necessário para liberação financeira imediata sem carência de 48h).\n`;

    return msg;
  };

  const exportarRomaneioCSV = (
    parceira: Parceira,
    pedidosDaParceira: Pedido[],
    lojistasList: Lojista[]
  ) => {
    const cabecalho = [
      'Código Pedido',
      'Status',
      'Lojista Remetente',
      'Bairro Origem',
      'Destinatário',
      'Telefone Destinatário',
      'Logradouro',
      'Número',
      'Complemento',
      'Bairro Destino',
      'Cidade',
      'Volume',
      'Peso (kg)',
      'Tipo Prazo',
      'Data Desejada',
      'Horário Marcado',
      'Modalidade Transporte',
      'Carga Perecível',
      'Elegibilidade Financeira',
      'Observações',
    ].join(';') + '\n';

    const linhas = pedidosDaParceira
      .map((p) => {
        const loj = lojistasList.find((l) => l.id === p.lojistaId);
        const prazo = p.prazoEntrega === 'AGENDADA' ? 'Agendada' : 'Dia Seguinte (D+1)';
        return [
          p.codigoCurto,
          p.status,
          `"${loj?.nome || p.lojistaId}"`,
          `"${loj?.bairro || ''}"`,
          `"${p.destinatario.nome}"`,
          p.destinatario.telefone,
          `"${p.destinatario.endereco.logradouro}"`,
          `"${p.destinatario.endereco.numero || 'S/N'}"`,
          `"${p.destinatario.endereco.complemento || ''}"`,
          `"${p.destinatario.endereco.bairro}"`,
          `"${p.destinatario.endereco.cidade}"`,
          `"${p.volume}"`,
          p.pesoKg ? p.pesoKg.toString().replace('.', ',') : '',
          prazo,
          `"${p.dataDesejada}"`,
          p.horarioAgendado || '',
          p.tipoTransporte === 'CROSS_DOCKING' ? 'Cross-Docking (Galpão)' : 'Entrega Direta',
          p.perecivel ? 'SIM' : 'NÃO',
          p.elegibilidadeFinanceira,
          `"${(p.observacoes || '').replace(/"/g, '""')}"`,
        ].join(';');
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + cabecalho + linhas], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dataIso = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `romaneio_${parceira.id}_${dataIso}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    mostrarNotificacao('success', `Planilha CSV tabulada de ${parceira.nome} baixada com sucesso!`);
  };

  const handleCopiarTexto = (texto: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setTextoCopiadoFeedback(true);
      mostrarNotificacao('success', 'Texto do romaneio copiado para a área de transferência!');
      setTimeout(() => setTextoCopiadoFeedback(false), 2500);
    } catch {
      mostrarNotificacao('error', 'Não foi possível copiar automaticamente.');
    }
  };

  const handleAbrirWhatsApp = (telefone: string, texto: string) => {
    const limpo = limparTelefone(telefone);
    const url = `https://wa.me/55${limpo}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const abrirModalEdicao = (p: Pedido) => {
    setPedidoEmEdicao(p);
    if (p.status === 'CRIADO') {
      setNovoStatus('ATRIBUIDO');
    } else if (p.status === 'ATRIBUIDO') {
      setNovoStatus('EM_TRANSITO');
    } else if (p.status === 'EM_TRANSITO') {
      setNovoStatus('CONCLUIDO');
    } else if (p.status === 'NO_GALPAO') {
      setNovoStatus('LIBERADO_PERNA_2');
    } else {
      setNovoStatus(p.status);
    }

    if (p.comprovante) {
      setRecebedorNome(p.comprovante.recebedorNome || p.destinatario.nome);
      setRecebedorDoc(p.comprovante.recebedorDoc || '');
      setCanalConfirmacao(p.comprovante.canalConfirmacao || 'WHATSAPP_FOTO');
      setTemFotoComprovante(Boolean(p.comprovante.fotoUrl));
      setFotoUrlCustomizada(p.comprovante.fotoUrl || originalPhoto);
      setObservacaoBaixa(p.comprovante.observacao || '');
    } else {
      setRecebedorNome(p.destinatario.nome);
      setRecebedorDoc('');
      setCanalConfirmacao('WHATSAPP_FOTO');
      setTemFotoComprovante(true);
      setFotoUrlCustomizada(originalPhoto);
      setObservacaoBaixa('Comprovante auditado e validado operacionalmente.');
    }

    if (p.ocorrencia) {
      setTipoOcorrencia(p.ocorrencia.tipo);
      setDescricaoOcorrencia(p.ocorrencia.descricao);
      setOcorrenciaImputavel(p.ocorrencia.imputavelParceira);
    } else {
      setTipoOcorrencia('DESTINATARIO_AUSENTE');
      setDescricaoOcorrencia('Destinatário ausente na primeira tentativa de entrega.');
      setOcorrenciaImputavel(false);
    }
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrlCustomizada(reader.result as string);
        setTemFotoComprovante(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarAtualizacaoPedido = () => {
    if (!pedidoEmEdicao) return;

    if (novoStatus === 'CONCLUIDO') {
      if (!recebedorNome.trim()) {
        mostrarNotificacao('warning', 'Informe o nome do recebedor da mercadoria.');
        return;
      }

      const elegibilidade: ElegibilidadeFinanceira = temFotoComprovante ? 'LIBERADO' : 'RETIDO_PRAZO';

      homologarBaixa(
        pedidoEmEdicao.id,
        {
          recebedorNome: recebedorNome.trim(),
          recebedorDoc: recebedorDoc.trim() || undefined,
          entregueEm: new Date().toISOString(),
          fotoUrl: temFotoComprovante ? (fotoUrlCustomizada || originalPhoto) : undefined,
          canalConfirmacao,
          observacao: observacaoBaixa.trim() || 'Baixa operacional homologada pela coordenação/análise.',
        },
        elegibilidade
      );

      mostrarNotificacao(
        'success',
        `Baixa do pedido ${pedidoEmEdicao.codigoCurto} registrada! Elegibilidade: ${elegibilidade === 'LIBERADO' ? 'LIBERADO (Com foto)' : 'RETIDO 48H (Sem foto)'}.`
      );
    } else if (novoStatus === 'OCORRENCIA') {
      if (!descricaoOcorrencia.trim()) {
        mostrarNotificacao('warning', 'Descreva o motivo da ocorrência de campo.');
        return;
      }

      atualizarPedido(pedidoEmEdicao.id, {
        status: 'OCORRENCIA',
        ocorrencia: {
          tipo: tipoOcorrencia,
          descricao: descricaoOcorrencia.trim(),
          registradaEm: new Date().toISOString(),
          imputavelParceira: ocorrenciaImputavel,
          resolvida: false,
        },
        observacoes: `Ocorrência: ${descricaoOcorrencia.trim()}`,
      });

      mostrarNotificacao('warning', `Ocorrência registrada no pedido ${pedidoEmEdicao.codigoCurto}.`);
    } else {
      atualizarPedido(pedidoEmEdicao.id, {
        status: novoStatus,
        observacoes: observacaoBaixa.trim() || undefined,
      });

      mostrarNotificacao('info', `Status do pedido ${pedidoEmEdicao.codigoCurto} alterado para ${novoStatus}.`);
    }

    setPedidoEmEdicao(null);
  };

  const pedidosDaParceiraExport = useMemo(() => {
    if (!parceiraExportacao) return [];
    return pedidos.filter((p) => {
      const atribuida =
        p.atribuicao?.parceiraPerna1Id === parceiraExportacao.id ||
        p.atribuicao?.parceiraPerna2Id === parceiraExportacao.id;
      if (!atribuida) return false;
      if (filtroApenasPendentesExport) {
        return p.status !== 'CONCLUIDO' && p.status !== 'DEVOLVIDO';
      }
      return true;
    });
  }, [pedidos, parceiraExportacao, filtroApenasPendentesExport]);

  const textoWhatsAppGerado = useMemo(() => {
    if (!parceiraExportacao) return '';
    return gerarTextoRomaneioWhatsApp(parceiraExportacao, pedidosDaParceiraExport, lojistas);
  }, [parceiraExportacao, pedidosDaParceiraExport, lojistas]);

  // Customizações manuais das sugestões automáticas: { [pedidoId]: parceiraId | null }
  const [atribuicoesSugeridas, setAtribuicoesSugeridas] = useState<Record<string, string | null>>({});

  // Pedidos no status CRIADO (aguardando despacho)
  const pedidosCriados = useMemo(() => {
    return pedidos.filter((p) => p.status === 'CRIADO');
  }, [pedidos]);

  // Função auxiliar que determina a melhor parceira padrão para um pedido
  const calcularParceiraPadrao = (pedido: Pedido): string => {
    const bairroDestino = pedido.destinatario.endereco.bairro;
    const candidatas = parceiras.filter((p) => p.regioesAtendidas.includes(bairroDestino));

    if (candidatas.length === 1) {
      return candidatas[0].id;
    }
    if (candidatas.length > 1) {
      // Se atendido por mais de uma, desempate pela menor taxa de ocupação diária
      const ordenadas = [...candidatas].sort(
        (a, b) => a.entregasAtribuidasHoje / a.limiteDiario - b.entregasAtribuidasHoje / b.limiteDiario
      );
      return ordenadas[0].id;
    }
    // Fallback: parceira com menor ocupação geral
    const todasOrdenadas = [...parceiras].sort(
      (a, b) => a.entregasAtribuidasHoje / a.limiteDiario - b.entregasAtribuidasHoje / b.limiteDiario
    );
    return todasOrdenadas[0]?.id || '';
  };

  // Mapeamento de cada parceira com os pedidos sugeridos para ela (incorporando edições manuais)
  const distribuicaoProativa = useMemo(() => {
    if (pedidosCriados.length === 0) return [];

    return parceiras.map((parceira) => {
      const pedidosSugeridos = pedidosCriados.filter((pedido) => {
        const custom = atribuicoesSugeridas[pedido.id];
        if (custom !== undefined) {
          return custom === parceira.id;
        }
        return calcularParceiraPadrao(pedido) === parceira.id;
      });

      const bairrosCobertos = Array.from(new Set(pedidosSugeridos.map((p) => p.destinatario.endereco.bairro)));
      const saldoDisponivel = Math.max(0, parceira.limiteDiario - parceira.entregasAtribuidasHoje);
      const taxaOcupacaoAtual = Math.round((parceira.entregasAtribuidasHoje / parceira.limiteDiario) * 100);
      const taxaOcupacaoProjetada = Math.round(
        ((parceira.entregasAtribuidasHoje + pedidosSugeridos.length) / parceira.limiteDiario) * 100
      );

      return {
        parceira,
        pedidosSugeridos,
        bairrosCobertos,
        saldoDisponivel,
        taxaOcupacaoAtual,
        taxaOcupacaoProjetada,
      };
    });
  }, [pedidosCriados, parceiras, atribuicoesSugeridas]);

  const obterJustificativaPedido = (pedido: Pedido, parceiraId: string) => {
    const custom = atribuicoesSugeridas[pedido.id];
    if (custom !== undefined && custom === parceiraId) {
      return 'Movido manualmente pelo operador';
    }
    const bairro = pedido.destinatario.endereco.bairro;
    if (bairro === 'Santo Antônio') {
      return 'Santo Antônio (Região mista): menor taxa de ocupação diária';
    }
    return `Área de cobertura direta: ${bairro}`;
  };

  const handleMoverPedidoSugestao = (pedidoId: string, novaParceiraId: string) => {
    const parceiraDestino = parceiras.find((p) => p.id === novaParceiraId);
    setAtribuicoesSugeridas((ant) => ({
      ...ant,
      [pedidoId]: novaParceiraId,
    }));
    mostrarNotificacao('info', `Pedido transferido para o lote de ${parceiraDestino?.nome || novaParceiraId}.`);
  };

  const handleRemoverPedidoSugestao = (pedidoId: string) => {
    setAtribuicoesSugeridas((ant) => ({
      ...ant,
      [pedidoId]: null,
    }));
    mostrarNotificacao('info', 'Pedido removido da sugestão automática (permanece na fila geral).');
  };

  const handleRestaurarSugestoes = () => {
    setAtribuicoesSugeridas({});
    mostrarNotificacao('success', 'Sugestões automáticas restauradas para a distribuição original.');
  };

  // Filtragem dos pedidos da tabela
  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((p) => {
      const termo = filtroTexto.toLowerCase();
      const atendeTexto =
        filtroTexto === '' ||
        p.codigoCurto.toLowerCase().includes(termo) ||
        p.destinatario.nome.toLowerCase().includes(termo) ||
        p.destinatario.endereco.bairro.toLowerCase().includes(termo) ||
        (p.volume && p.volume.toLowerCase().includes(termo));

      const atendeStatus = filtroStatus === 'TODOS' || p.status === filtroStatus;
      return atendeTexto && atendeStatus;
    });
  }, [pedidos, filtroTexto, filtroStatus]);

  // Pedidos selecionados manualmente
  const pedidosSelecionadosObj = useMemo(() => {
    return pedidos.filter((p) => selecionados.includes(p.id));
  }, [pedidos, selecionados]);

  // ==========================================
  // MOTOR DE RECOMENDAÇÃO PARA SELEÇÃO MANUAL
  // ==========================================
  const sugestaoInteligente = useMemo(() => {
    if (pedidosSelecionadosObj.length === 0) return null;

    const bairrosDestino = Array.from(
      new Set(pedidosSelecionadosObj.map((p) => p.destinatario.endereco.bairro))
    );

    const pontuacaoParceiras = parceiras.map((parceira) => {
      const bairrosAtendidos = bairrosDestino.filter((b) =>
        parceira.regioesAtendidas.includes(b)
      );
      const atendeTodosBairros = bairrosAtendidos.length === bairrosDestino.length;
      const percentualCobertura = bairrosDestino.length > 0
        ? bairrosAtendidos.length / bairrosDestino.length
        : 0;

      const saldoDisponivel = Math.max(0, parceira.limiteDiario - parceira.entregasAtribuidasHoje);
      const taxaOcupacao = parceira.limiteDiario > 0
        ? Math.round((parceira.entregasAtribuidasHoje / parceira.limiteDiario) * 100)
        : 100;

      return {
        parceira,
        atendeTodosBairros,
        percentualCobertura,
        bairrosAtendidos,
        saldoDisponivel,
        taxaOcupacao,
      };
    });

    pontuacaoParceiras.sort((a, b) => {
      if (a.atendeTodosBairros && !b.atendeTodosBairros) return -1;
      if (!a.atendeTodosBairros && b.atendeTodosBairros) return 1;
      if (a.percentualCobertura !== b.percentualCobertura) {
        return b.percentualCobertura - a.percentualCobertura;
      }
      return a.taxaOcupacao - b.taxaOcupacao;
    });

    const melhorOpcao = pontuacaoParceiras[0];

    const sugereCrossDocking = pedidosSelecionadosObj.some((p) => {
      const loj = lojistas.find((l) => l.id === p.lojistaId);
      if (!loj) return false;
      const norte = ['Graças', 'Espinheiro', 'Bairro Novo', 'Casa Caiada', 'Boa Vista'];
      const sul = ['Boa Viagem', 'Pina', 'Imbiribeira', 'Piedade', 'Candeias'];
      return (
        (norte.includes(loj.bairro) && sul.includes(p.destinatario.endereco.bairro)) ||
        (sul.includes(loj.bairro) && norte.includes(p.destinatario.endereco.bairro))
      );
    });

    return {
      recomendada: melhorOpcao.parceira,
      atendeTodos: melhorOpcao.atendeTodosBairros,
      bairrosCobertos: melhorOpcao.bairrosAtendidos,
      bairrosTotais: bairrosDestino,
      taxaOcupacao: melhorOpcao.taxaOcupacao,
      saldo: melhorOpcao.saldoDisponivel,
      sugereCrossDocking,
    };
  }, [pedidosSelecionadosObj, parceiras, lojistas]);

  const parceiraEfetivaId = parceiraManualId || (sugestaoInteligente ? sugestaoInteligente.recomendada.id : '');

  React.useEffect(() => {
    if (sugestaoInteligente && sugestaoInteligente.sugereCrossDocking) {
      setTipoTransporteSelecionado('CROSS_DOCKING');
    }
  }, [sugestaoInteligente]);

  const alternarSelecao = (id: string) => {
    setSelecionados((ant) =>
      ant.includes(id) ? ant.filter((item) => item !== id) : [...ant, id]
    );
  };

  const selecionarTodosCriados = () => {
    const idsCriados = pedidosCriados.map((p) => p.id);
    const todosJaSelecionados = idsCriados.length > 0 && idsCriados.every((id) => selecionados.includes(id));
    if (todosJaSelecionados) {
      setSelecionados((ant) => ant.filter((id) => !idsCriados.includes(id)));
    } else {
      setSelecionados((ant) => Array.from(new Set([...ant, ...idsCriados])));
    }
  };

  const handleConfirmarDespacho = () => {
    if (selecionados.length === 0) {
      mostrarNotificacao('warning', 'Selecione pelo menos um pedido para despachar.');
      return;
    }
    if (!parceiraEfetivaId) {
      mostrarNotificacao('warning', 'Selecione uma transportadora parceira para a coleta.');
      return;
    }

    atribuirParceirasEmLote(selecionados, parceiraEfetivaId, tipoTransporteSelecionado);
    setSelecionados([]);
    setParceiraManualId('');
  };

  const handleDespacharLoteProativo = (parceiraId: string, pedidoIds: string[]) => {
    if (pedidoIds.length === 0) {
      mostrarNotificacao('info', 'Não há pedidos pendentes sugeridos para esta parceira.');
      return;
    }
    atribuirParceirasEmLote(pedidoIds, parceiraId, 'DIRETO');
  };

  return (
    <div className="space-y-6 w-full">
      {/* 1. Capacidade Operacional das Transportadoras */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{titulo}</h3>
            <p className="text-xs text-slate-500">{subtitulo}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {pedidosCriados.length} aguardando coleta
            </span>
            {escopoMoscow !== 'must' && (
              <button
                type="button"
                onClick={() => setMostrarSugestaoProativa(!mostrarSugestaoProativa)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                  mostrarSugestaoProativa
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-black animate-pulse'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${mostrarSugestaoProativa ? 'text-amber-400' : 'text-slate-950'}`} />
                <span>{mostrarSugestaoProativa ? 'Ocultar Sugestão de Atribuição' : 'Sugerir Atribuição Inteligente'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Barras de Consumo de Capacidade Diária */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parceiras.map((p) => {
            const percentual = Math.round((p.entregasAtribuidasHoje / p.limiteDiario) * 100);
            const saldo = Math.max(0, p.limiteDiario - p.entregasAtribuidasHoje);
            const estaSaturada = percentual >= 90;
            const pedidosDestaParceira = pedidos.filter(
              (ped) =>
                ped.atribuicao?.parceiraPerna1Id === p.id ||
                ped.atribuicao?.parceiraPerna2Id === p.id
            );

            return (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition ${
                  parceiraEfetivaId === p.id && selecionados.length > 0
                    ? 'border-sealog-blue bg-blue-50/40 ring-2 ring-sealog-blue/20'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sealog-blue" />
                    <span className="font-bold text-sm text-slate-900">{p.nome}</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Canal: {p.tipoOperacao}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Ocupação Diária: {percentual}%
                    </span>
                    <span className={estaSaturada ? 'font-bold text-rose-600' : 'text-slate-500'}>
                      Saldo: {saldo} entregas
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        percentual >= 90
                          ? 'bg-rose-500'
                          : percentual >= 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentual, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                  <span>Capacidade diária: <strong>{p.entregasAtribuidasHoje}</strong> / {p.limiteDiario}</span>
                  <span className="text-slate-400">Contato: {p.contato} ({p.telefone})</span>
                </div>

                {/* Ações de Romaneio para Parceiras (WhatsApp & CSV) */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-sealog-blue" />
                    <strong>{pedidosDestaParceira.length}</strong> atribuído(s)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setParceiraExportacao(p);
                        setTextoCopiadoFeedback(false);
                      }}
                      title={`Gerar romaneio formatado para WhatsApp (${p.nome})`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Romaneio WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => exportarRomaneioCSV(p, pedidosDestaParceira, lojistas)}
                      title={`Baixar romaneio tabulado em CSV (${p.nome})`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg transition cursor-pointer shadow-2xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-sealog-blue" />
                      <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SUGESTÃO PROATIVA DA MALHA (Aparece por parceiro com detalhes e edição interativa) */}
      {mostrarSugestaoProativa && escopoMoscow !== 'must' && pedidosCriados.length > 0 && (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-400 text-slate-950 rounded-lg shadow-xs">
                <Zap className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  Distribuição Proativa da Malha ({pedidosCriados.length} pedidos pendentes)
                </h4>
                <p className="text-xs text-slate-300">
                  Otimização baseada em cobertura geográfica e desempate por menor taxa de ocupação diária.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {Object.keys(atribuicoesSugeridas).length > 0 && (
                <button
                  type="button"
                  onClick={handleRestaurarSugestoes}
                  className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Distribuição Original</span>
                </button>
              )}
              <span className="text-xs text-amber-300 font-semibold bg-amber-950/60 border border-amber-700/60 px-3 py-1 rounded-full">
                Sugestão Editável
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distribuicaoProativa.map(({ parceira, pedidosSugeridos, bairrosCobertos, saldoDisponivel, taxaOcupacaoAtual, taxaOcupacaoProjetada }) => {
              const outrasParceiras = parceiras.filter((p) => p.id !== parceira.id);

              return (
                <div
                  key={parceira.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <Truck className="w-4 h-4 text-cyan-400" />
                        {parceira.nome}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {pedidosSugeridos.length} pedido(s)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {pedidosSugeridos.length > 0
                        ? `Atende destinos em: ${bairrosCobertos.join(', ')}.`
                        : 'Nenhum pedido pendente na área exclusiva desta transportadora.'}
                    </p>

                    <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between">
                      <span>Ocupação Atual: <strong className="text-white">{taxaOcupacaoAtual}%</strong></span>
                      <span>Projetada: <strong className="text-cyan-300">{taxaOcupacaoProjetada}%</strong></span>
                      <span>Vagas Restantes: <strong className="text-emerald-400">{Math.max(0, saldoDisponivel - pedidosSugeridos.length)}</strong></span>
                    </div>

                    {/* Lista com Detalhes Completos dos Pedidos e Controles de Edição (Sem barra de rolagem achatando a lista) */}
                    {pedidosSugeridos.length > 0 ? (
                      <div className="space-y-2.5 pt-1">
                        {pedidosSugeridos.map((p) => {
                          const justificativa = obterJustificativaPedido(p, parceira.id);

                          return (
                            <div
                              key={p.id}
                              className="bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs space-y-2 hover:border-slate-600 transition"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                                    {p.codigoCurto}
                                  </span>
                                  <span className="font-semibold text-white">
                                    {p.destinatario.nome}
                                  </span>
                                  {p.perecivel && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-300 border border-rose-700/80">
                                      <Flame className="w-3 h-3 text-rose-400" /> Perecível
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                  <span className="flex items-center gap-1">
                                    <Package className="w-3 h-3 text-slate-400" /> {p.volume}
                                  </span>
                                  {p.pesoKg && (
                                    <span className="flex items-center gap-1">
                                      <Weight className="w-3 h-3 text-slate-400" /> {p.pesoKg} kg
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-[11px] text-slate-300 flex items-center justify-between flex-wrap gap-1">
                                <span>
                                  📍 {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero || 'S/N'} — <strong>{p.destinatario.endereco.bairro}</strong>
                                </span>
                              </div>

                              {/* Justificativa e Ações de Edição */}
                              <div className="pt-1.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="text-[10px] text-amber-300/90 flex items-center gap-1">
                                  <span>💡 Motivo:</span>
                                  <span>{justificativa}</span>
                                </div>

                                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                  {outrasParceiras.map((outra) => (
                                    <button
                                      key={outra.id}
                                      type="button"
                                      onClick={() => handleMoverPedidoSugestao(p.id, outra.id)}
                                      title={`Mover para ${outra.nome}`}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded text-[10px] font-semibold transition cursor-pointer"
                                    >
                                      <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
                                      <span>Mover p/ {outra.nome.split(' ')[0]}</span>
                                    </button>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => handleRemoverPedidoSugestao(p.id)}
                                    title="Remover este pedido do lote sugerido"
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded text-[10px] font-semibold transition cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>Remover</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-slate-400 text-xs bg-slate-900/40 rounded-lg border border-dashed border-slate-700">
                        Nenhum pedido atribuído a esta parceira no momento.
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={pedidosSugeridos.length === 0}
                    onClick={() => handleDespacharLoteProativo(parceira.id, pedidosSugeridos.map(p => p.id))}
                    className="w-full mt-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Despachar Lote Sugerido ({pedidosSugeridos.length} pedidos)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Painel de Atribuição Manual de Seleção (Fundo sólido de alto contraste) */}
      {selecionados.length > 0 && sugestaoInteligente && (
        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xl border-2 border-slate-700 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-400 text-slate-950 rounded-lg shadow-xs">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-white">
                    Atribuição Personalizada ({selecionados.length} selecionado{selecionados.length > 1 ? 's' : ''})
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    Seleção Manual
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Recomendação calculada para os pedidos marcados na tabela.
                </p>
              </div>
            </div>

            {/* Modalidade de Transporte */}
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-300 text-[11px] pl-1 font-semibold">Modalidade:</span>
              <button
                type="button"
                onClick={() => setTipoTransporteSelecionado('DIRETO')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  tipoTransporteSelecionado === 'DIRETO'
                    ? 'bg-sealog-blue text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Entrega Direta
              </button>
              <button
                type="button"
                onClick={() => setTipoTransporteSelecionado('CROSS_DOCKING')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  tipoTransporteSelecionado === 'CROSS_DOCKING'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cross-Docking (Galpão)
              </button>
            </div>
          </div>

          {/* Justificativa e Seleção */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="md:col-span-8 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Transportadora Sugerida:</span>
                <span className="font-black text-amber-300 text-sm">
                  {sugestaoInteligente.recomendada.nome}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                  Melhor Escolha
                </span>
              </div>

              <p className="text-slate-200 text-xs">
                {sugestaoInteligente.atendeTodos
                  ? `✓ Atende 100% dos bairros de destino (${sugestaoInteligente.bairrosTotais.join(', ')}).`
                  : `⚠️ Cobertura parcial: atende ${sugestaoInteligente.bairrosCobertos.join(', ')}.`}
                {' '}Taxa de ocupação atual de <strong>{sugestaoInteligente.taxaOcupacao}%</strong> com saldo de <strong>{sugestaoInteligente.saldo}</strong> pacotes hoje.
              </p>

              {sugestaoInteligente.sugereCrossDocking && (
                <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <span>ℹ️ Transbordo sugerido:</span> Rota entre zonas opostas (Zona Norte ↔ Zona Sul), ideal encaminhar para o Galpão Central.
                </div>
              )}
            </div>

            {/* Alternar Manualmente e Botão de Ação */}
            <div className="md:col-span-4 flex flex-col gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-300 block">
                  Alterar Transportadora (Opcional):
                </label>
                <select
                  value={parceiraManualId}
                  onChange={(e) => setParceiraManualId(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="">
                    Utilizar Sugerida ({sugestaoInteligente.recomendada.nome})
                  </option>
                  {parceiras.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.limiteDiario - p.entregasAtribuidasHoje} vagas)
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleConfirmarDespacho}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Confirmar Despacho ({selecionados.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Fila Geral de Pedidos com Filtros e Checkbox de Seleção */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden w-full">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Fila Geral de Pedidos ({pedidosFiltrados.length})
            </h4>

            {pedidosCriados.length > 0 && (
              <button
                type="button"
                onClick={selecionarTodosCriados}
                className="text-xs font-bold text-sealog-blue hover:text-sealog-blue-800 flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 cursor-pointer transition"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {pedidosCriados.every((p) => selecionados.includes(p.id))
                    ? 'Limpar seleção'
                    : `Selecionar todos (${pedidosCriados.length})`}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filtrar por código, nome, bairro..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue w-48 sm:w-60"
            />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue cursor-pointer"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="CRIADO">Criado (Pendente Despacho)</option>
              <option value="ATRIBUIDO">Atribuído</option>
              <option value="EM_TRANSITO">Em Trânsito</option>
              <option value="NO_GALPAO">No Galpão Central</option>
              <option value="LIBERADO_PERNA_2">Liberado p/ Entrega Final</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="OCORRENCIA">Ocorrência</option>
              <option value="DEVOLVIDO">Devolvido</option>
            </select>
          </div>
        </div>

        {/* Tabela Interativa de Pedidos com Largura Total */}
        <div className="divide-y divide-slate-100 w-full">
          {pedidosFiltrados.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhum pedido encontrado com os filtros atuais.
            </div>
          ) : (
            pedidosFiltrados.map((p) => {
              const selecionado = selecionados.includes(p.id);
              const ehCriado = p.status === 'CRIADO';
              const lojista = lojistas.find((l) => l.id === p.lojistaId);

              return (
                <div
                  key={p.id}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON') {
                      ehCriado && alternarSelecao(p.id);
                    }
                  }}
                  className={`p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs w-full ${
                    selecionado
                      ? 'bg-blue-50/80 border-l-4 border-l-sealog-blue'
                      : 'hover:bg-slate-50/70 border-l-4 border-l-transparent'
                  } ${ehCriado ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Checkbox de Seleção */}
                    <input
                      type="checkbox"
                      checked={selecionado}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => alternarSelecao(p.id)}
                      disabled={!ehCriado}
                      title={ehCriado ? 'Selecionar para despacho' : 'Pedido já despachado ou finalizado'}
                      className="mt-1 sm:mt-0 rounded text-sealog-blue focus:ring-sealog-blue h-4 w-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sealog-blue text-sm">
                          {p.codigoCurto}
                        </span>
                        <StatusBadge status={p.status} />
                        <FinanceStatusBadge status={p.elegibilidadeFinanceira} />

                        {p.perecivel && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            <Flame className="w-3 h-3 text-rose-600" /> Perecível
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 font-medium">
                          {p.tipoTransporte === 'CROSS_DOCKING' ? 'Cross-Docking' : 'Entrega Direta'}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-900">
                        {p.destinatario.nome} — {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero || '(Sem nº)'} ({p.destinatario.endereco.bairro})
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          Remetente: <strong>{lojista?.nome || p.lojistaId}</strong> ({lojista?.bairro})
                        </span>
                        {p.atribuicao?.parceiraPerna1Id && (
                          <span className="flex items-center gap-1 text-sealog-blue font-semibold">
                            <Truck className="w-3 h-3" />
                            Transportadora:{' '}
                            {parceiras.find((pr) => pr.id === p.atribuicao?.parceiraPerna1Id)?.nome || p.atribuicao.parceiraPerna1Id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informações Físicas (Volume e Peso) e Ações de Baixa Operacional */}
                  <div className="flex flex-col sm:items-end justify-between shrink-0 gap-2">
                    <div className="text-right text-slate-600 space-y-0.5">
                      <span className="font-medium text-slate-800 flex items-center justify-end gap-1">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {p.volume}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                        <Weight className="w-3 h-3 text-slate-400" />
                        Peso: {p.pesoKg ? `${p.pesoKg} kg` : 'N/A'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {p.prazoEntrega === 'AGENDADA'
                          ? `📅 Agendada: ${p.dataAgendada || p.dataDesejada}`
                          : '⚡ D+1 (Dia Seguinte)'}
                        {p.horarioAgendado && ` às ${p.horarioAgendado}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 self-end">
                      {p.horarioAgendado && (
                        <span
                          title={`Entrega com horário marcado: ${p.horarioAgendado}`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200"
                        >
                          <Clock className="w-3 h-3 text-purple-600" />
                          {p.horarioAgendado}
                        </span>
                      )}
                      {p.comprovante && (
                        <span
                          title={
                            p.comprovante.fotoUrl
                              ? `Comprovante com Foto (POD): Recebido por ${p.comprovante.recebedorNome}`
                              : `Comprovante sem foto (Retido 48h): Recebido por ${p.comprovante.recebedorNome}`
                          }
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.comprovante.fotoUrl
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {p.comprovante.fotoUrl ? (
                            <Camera className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <FileText className="w-3 h-3 text-amber-700" />
                          )}
                          {p.comprovante.fotoUrl ? 'POD Anexado' : 'Sem Foto (48h)'}
                        </span>
                      )}

                      {p.ocorrencia && !p.ocorrencia.resolvida && (
                        <span
                          title={`Ocorrência: ${p.ocorrencia.descricao}`}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300"
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Ocorrência
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalEdicao(p);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sealog-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition cursor-pointer shadow-2xs"
                        title="Atualizar status ou homologar baixa operacional com comprovante"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>{p.status === 'CONCLUIDO' ? 'Ver/Editar Baixa' : 'Alterar Status / Baixar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. MODAL: Romaneio para WhatsApp e Exportação CSV */}
      {parceiraExportacao && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    Romaneio de Despacho & Exportação — {parceiraExportacao.nome}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Envie a relação de entregas por WhatsApp informal ou exporte a planilha CSV tabulada.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setParceiraExportacao(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Painel Informativo da Transportadora */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-100/70 rounded-xl border border-slate-200 text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Canal Habitual:</span>
                  <span className="font-bold text-slate-900">{parceiraExportacao.tipoOperacao}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Contato:</span>
                  <span className="font-bold text-slate-900 truncate block">{parceiraExportacao.contato}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Telefone WhatsApp:</span>
                  <span className="font-mono font-bold text-emerald-700">{parceiraExportacao.telefone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pacotes no Lote:</span>
                  <span className="font-bold text-sealog-blue text-sm">{pedidosDaParceiraExport.length} pedidos</span>
                </div>
              </div>

              {/* Controles de Filtro e Ações Rápidas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={filtroApenasPendentesExport}
                    onChange={(e) => setFiltroApenasPendentesExport(e.target.checked)}
                    className="rounded text-sealog-blue focus:ring-sealog-blue h-4 w-4"
                  />
                  <span>Exibir apenas pedidos pendentes de entrega (ocultar já concluídos)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopiarTexto(textoWhatsAppGerado)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition shadow-xs cursor-pointer ${
                      textoCopiadoFeedback
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {textoCopiadoFeedback ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-emerald-700" />}
                    <span>{textoCopiadoFeedback ? 'Copiado para WhatsApp!' : 'Copiar Texto Formatado'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAbrirWhatsApp(parceiraExportacao.telefone, textoWhatsAppGerado)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir no WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportarRomaneioCSV(parceiraExportacao, pedidosDaParceiraExport, lojistas)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-bold transition shadow-xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-sealog-blue" />
                    <span>Baixar CSV</span>
                  </button>
                </div>
              </div>

              {/* Caixa de Texto do WhatsApp (Preview) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                  <span>Prévia da mensagem pronta para envio no WhatsApp:</span>
                  <span className="font-mono">{textoWhatsAppGerado.length} caracteres</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-y-auto max-h-64 whitespace-pre-wrap leading-relaxed border border-slate-800 select-all shadow-inner">
                  {textoWhatsAppGerado}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Dica: O texto inclui endereços completos, contato dos clientes e alertas de perecibilidade.
              </span>
              <button
                type="button"
                onClick={() => setParceiraExportacao(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: Alteração de Status & Baixa Operacional com Comprovante (POD) */}
      {pedidoEmEdicao && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-sealog-blue rounded-xl">
                  <Pencil className="w-5 h-5 text-sealog-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base text-slate-900">
                      Atualização Operacional — {pedidoEmEdicao.codigoCurto}
                    </h4>
                    <StatusBadge status={pedidoEmEdicao.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {pedidoEmEdicao.destinatario.nome} — {pedidoEmEdicao.destinatario.endereco.bairro} ({pedidoEmEdicao.destinatario.endereco.cidade})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPedidoEmEdicao(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body com scroll */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Seleção do Novo Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Novo Status do Pedido:
                </label>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value as StatusPedido)}
                  className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sealog-blue cursor-pointer"
                >
                  <option value="CONCLUIDO">✓ CONCLUÍDO (Dar Baixa / Entregue ao Destinatário)</option>
                  <option value="EM_TRANSITO">🚚 EM TRÂNSITO (Em Rota de Entrega ou Coleta)</option>
                  <option value="ATRIBUIDO">📋 ATRIBUÍDO (Alocado para Transportadora)</option>
                  <option value="NO_GALPAO">🏢 NO GALPÃO CENTRAL (Transbordo / Cross-Docking)</option>
                  <option value="LIBERADO_PERNA_2">📦 LIBERADO P/ ENTREGA FINAL (2º Trecho)</option>
                  <option value="OCORRENCIA">⚠️ OCORRÊNCIA (Insucesso / Destinatário Ausente)</option>
                  <option value="CRIADO">⏳ CRIADO (Retornar para Fila Geral Pendente)</option>
                  <option value="DEVOLVIDO">↩️ DEVOLVIDO (Devolução Autorizada ao Lojista)</option>
                </select>
              </div>

              {/* CAMPOS ESPECÍFICOS PARA BAIXA (STATUS = CONCLUIDO) */}
              {novoStatus === 'CONCLUIDO' && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-4">
                  <div className="flex items-start gap-2 text-emerald-950">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-emerald-900">
                        Homologação de Baixa com Política Antifraude (ADR 003)
                      </h5>
                      <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                        • <strong>Com foto de comprovante (POD):</strong> Repasse financeiro <strong>LIBERADO</strong> imediatamente.<br />
                        • <strong>Sem foto (somente texto/verbal):</strong> Retido em <strong>CARÊNCIA DE 48H</strong> para averiguação e segurança dos lojistas.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 block">
                        Nome do Recebedor: *
                      </label>
                      <input
                        type="text"
                        value={recebedorNome}
                        onChange={(e) => setRecebedorNome(e.target.value)}
                        placeholder="Ex: Titular, Porteiro, Vizinho..."
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 block">
                        Documento do Recebedor (RG ou CPF):
                      </label>
                      <input
                        type="text"
                        value={recebedorDoc}
                        onChange={(e) => setRecebedorDoc(e.target.value)}
                        placeholder="Ex: 8.765.432 SDS/PE"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Canal de Confirmação da Baixa:
                    </label>
                    <select
                      value={canalConfirmacao}
                      onChange={(e) => setCanalConfirmacao(e.target.value as CanalConfirmacao)}
                      className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="WHATSAPP_FOTO">WhatsApp com Foto (Foto do Canhoto / Pacote)</option>
                      <option value="WHATSAPP_TEXTO">WhatsApp Texto / Áudio Informal (Sem foto)</option>
                      <option value="MANUAL">Canhoto Físico Presencial na Base / Despacho</option>
                      <option value="PLANILHA">Retorno em Planilha EDI / Excel</option>
                    </select>
                  </div>

                  {/* Toggle e Anexo de Foto POD */}
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 select-none">
                        <input
                          type="checkbox"
                          checked={temFotoComprovante}
                          onChange={(e) => setTemFotoComprovante(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-emerald-600" />
                          Anexar Comprovante Fotográfico de Entrega (POD)
                        </span>
                      </label>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          temFotoComprovante
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {temFotoComprovante ? '💰 Elegibilidade: LIBERADO' : '⏳ Elegibilidade: RETIDO 48H'}
                      </span>
                    </div>

                    {temFotoComprovante && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          {fotoUrlCustomizada && (
                            <img
                              src={fotoUrlCustomizada}
                              alt="Comprovante de Entrega"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-emerald-400 shadow-xs"
                            />
                          )}
                          <div className="space-y-1.5 flex-1">
                            <span className="text-[11px] text-slate-600 block">
                              Canhoto assinado ou foto do pacote entregue no destino:
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-bold text-xs cursor-pointer transition">
                                <Upload className="w-3.5 h-3.5 text-slate-600" />
                                <span>Subir Foto do Computador</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFotoUpload}
                                  className="hidden"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => setFotoUrlCustomizada(originalPhoto)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs transition cursor-pointer"
                              >
                                <span>Usar Foto Padrão (Canhoto)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Observações da Baixa:
                    </label>
                    <textarea
                      rows={2}
                      value={observacaoBaixa}
                      onChange={(e) => setObservacaoBaixa(e.target.value)}
                      placeholder="Ex: Entregue para o titular com assinatura conferida..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS PARA OCORRÊNCIA */}
              {novoStatus === 'OCORRENCIA' && (
                <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Registro de Ocorrência de Campo (Insucesso)</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Tipo de Ocorrência:
                    </label>
                    <select
                      value={tipoOcorrencia}
                      onChange={(e) => setTipoOcorrencia(e.target.value as TipoOcorrencia)}
                      className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-rose-500 cursor-pointer"
                    >
                      <option value="DESTINATARIO_AUSENTE">Destinatário Ausente / Portaria Fechada</option>
                      <option value="ENDERECO_INCORRETO">Endereço Incorreto / Número Inexistente</option>
                      <option value="CLIENTE_RECUSOU">Cliente Recusou o Pacote</option>
                      <option value="INTEMPERIE_CHUVAS">Intempérie / Alagamentos e Chuvas Fortes</option>
                      <option value="OUTROS">Outros Motivos Operacionais</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Descrição Detalhada do Motivo: *
                    </label>
                    <textarea
                      rows={2}
                      value={descricaoOcorrencia}
                      onChange={(e) => setDescricaoOcorrencia(e.target.value)}
                      placeholder="Descreva o que ocorreu no local de entrega..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500 bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={ocorrenciaImputavel}
                      onChange={(e) => setOcorrenciaImputavel(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                    />
                    <span>Ocorrência imputável à falha da transportadora parceira</span>
                  </label>
                </div>
              )}

              {/* CAMPOS PARA OUTROS STATUS */}
              {novoStatus !== 'CONCLUIDO' && novoStatus !== 'OCORRENCIA' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Observação de Auditoria (Histórico Operacional):
                  </label>
                  <textarea
                    rows={2}
                    value={observacaoBaixa}
                    onChange={(e) => setObservacaoBaixa(e.target.value)}
                    placeholder="Ex: Mercadoria recebida no galpão central para triagem..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sealog-blue bg-white"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPedidoEmEdicao(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSalvarAtualizacaoPedido}
                className="px-5 py-2 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Atualização</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
