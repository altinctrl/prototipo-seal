import React, { useState } from 'react';
import { useSealogStore } from '../../store/SealogContext';
import { StatusBadge } from '../common/StatusBadge';
import { BAIRROS_ATENDIDOS_RMR } from '../../data/initialData';
import { TipoPrazoEntrega } from '../../types';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Edit3,
  Check,
  SplitSquareVertical,
  FilePlus,
  Volume2,
  ShieldAlert,
  Play,
  Pause,
  UploadCloud,
  FileSpreadsheet,
  Flame,
  Plus,
  Calendar,
  Clock,
} from 'lucide-react';

export const AtendenteView: React.FC = () => {
  const {
    pedidos,
    lojistas,
    atualizarPedido,
    adicionarPedido,
    mostrarNotificacao,
    abaAtiva,
    escopoMoscow,
    alertaContingencia,
    contestarEntrega,
  } = useSealogStore();

  // Estados da Busca no SAC
  const [termoBusca, setTermoBusca] = useState('');

  // Estados de Pedidos Incompletos
  const [pedidoEdicaoId, setPedidoEdicaoId] = useState<string | null>(null);
  const [numeroEditado, setNumeroEditado] = useState('');
  const [telefoneEditado, setTelefoneEditado] = useState('');

  // Estados do Split-Screen HITL (1:N)
  const [audioTocandoId, setAudioTocandoId] = useState<string | null>(null);

  // 4 Sessões de Lojistas com múltiplos pedidos estruturados (Total: 12 entregas)
  const [sessoesTriagem, setSessoesTriagem] = useState([
    {
      id: 'sessao_farmacia',
      key: 'farmacia',
      lojistaId: 'loj_farmacia',
      lojistaNome: 'Dra. Camila • Farmácia Bom Preço (Recife Antigo)',
      canal: 'WHATSAPP ÁUDIO & MENSAGEM',
      horario: '09:15',
      textoBruto:
        'Bom dia Beatriz! Temos 3 entregas para despachar agora cedo: 1) Marta Menezes, Av Boa Viagem 3400 MarAzul apto 802, fone 98822-1100, 1 caixa de medicamentos térmicos 0.8kg. 2) Carlos Drummond, Rua das Laranjeiras 512 em Piedade Jaboatão, fone 99122-3344, 2 caixas médias 3.5kg cosméticos. 3) Luciana Arcoverde, Rua dos Navegantes 890 Boa Viagem, fone 99887-1234, vitaminas 1.1kg.',
      audioNome: 'audio_farmacia_lote_manha.ogg (0:28)',
      aviso: undefined,
      cards: [
        {
          id: 'card_farm_1',
          lojistaId: 'loj_farmacia',
          destinatarioNome: 'Marta Menezes',
          telefone: '(81) 98822-1100',
          logradouro: 'Av. Boa Viagem',
          numero: '3400',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 caixa pequena (Medicamentos Térmicos)',
          pesoKg: 0.8,
          perecivel: false,
          aprovado: false,
        },
        {
          id: 'card_farm_2',
          lojistaId: 'loj_farmacia',
          destinatarioNome: 'Carlos Drummond da Silva',
          telefone: '(81) 99122-3344',
          logradouro: 'Rua das Laranjeiras',
          numero: '512',
          bairro: 'Piedade',
          cidade: 'Jaboatão dos Guararapes',
          volume: '2 caixas médias (Cosméticos & Higiene)',
          pesoKg: 3.5,
          perecivel: false,
          aprovado: false,
        },
        {
          id: 'card_farm_3',
          lojistaId: 'loj_farmacia',
          destinatarioNome: 'Luciana Arcoverde',
          telefone: '(81) 99887-1234',
          logradouro: 'Rua dos Navegantes',
          numero: '890',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 pacote pequeno (Suplementos & Vitaminas)',
          pesoKg: 1.1,
          perecivel: false,
          aprovado: false,
        },
      ],
    },
    {
      id: 'sessao_floricultura',
      key: 'floricultura',
      lojistaId: 'loj_floricultura',
      lojistaNome: 'Sr. Roberto • Floricultura Jardim de Olinda',
      canal: 'WHATSAPP ÁUDIO',
      horario: '09:40',
      textoBruto:
        'Beatriz, são 3 encomendas de flores frescas e arranjos sensíveis hoje: 1) Ana Clara Albuquerque, Rua dos Navegantes 1280 Boa Viagem, fone 98765-4321, buquê de orquídeas 1.2kg perecível. 2) Mariana Vasconcelos, Av Bernardo Vieira de Melo 2100 Piedade, fone 98111-2233, coroa de flores 2.5kg perecível. 3) Thiago Lacerda, Rua Barão de Souza Leão 450 Boa Viagem, fone 99222-4455, arranjo lírios 1.8kg perecível.',
      audioNome: 'audio_floricultura_buque.ogg (0:24)',
      aviso: 'Atenção redobrada: Cargas perecíveis com janela de entrega estrita de 3h.',
      cards: [
        {
          id: 'card_flor_1',
          lojistaId: 'loj_floricultura',
          destinatarioNome: 'Ana Clara Albuquerque',
          telefone: '(81) 98765-4321',
          logradouro: 'Rua dos Navegantes',
          numero: '1280',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 caixa média (Orquídeas Frescas)',
          pesoKg: 1.2,
          perecivel: true,
          aprovado: false,
        },
        {
          id: 'card_flor_2',
          lojistaId: 'loj_floricultura',
          destinatarioNome: 'Mariana Vasconcelos',
          telefone: '(81) 98111-2233',
          logradouro: 'Av. Bernardo Vieira de Melo',
          numero: '2100',
          bairro: 'Piedade',
          cidade: 'Jaboatão dos Guararapes',
          volume: '1 caixa grande (Coroa & Arranjos de Rosas)',
          pesoKg: 2.5,
          perecivel: true,
          aprovado: false,
        },
        {
          id: 'card_flor_3',
          lojistaId: 'loj_floricultura',
          destinatarioNome: 'Thiago Lacerda',
          telefone: '(81) 99222-4455',
          logradouro: 'Rua Barão de Souza Leão',
          numero: '450',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 arranjo médio (Lírios Brancos)',
          pesoKg: 1.8,
          perecivel: true,
          aprovado: false,
        },
      ],
    },
    {
      id: 'sessao_papelaria',
      key: 'papelaria',
      lojistaId: 'loj_papelaria',
      lojistaNome: 'Paulo Silveira • Papelaria & Bazar Central (Santo Antônio)',
      canal: 'WHATSAPP TEXTO CORPORATIVO',
      horario: '10:05',
      textoBruto:
        'Manda coletar esses 3 pedidos corporativos de escritório: 1) Paulo Silveira, Rua do Sol 142 Santo Antônio, fone 98888-7777, 3 pacotes papelaria 2.4kg. 2) Bruno Henrique, Av Conde da Boa Vista 800 Boa Vista, fone 98700-1122, 1 fardo bobinas 4.2kg. 3) Juliana Valença, Rua da Aurora 510 Santo Amaro, fone 99333-8899, envelopes e pastas 1.5kg.',
      audioNome: 'audio_papelaria_lote.ogg (0:19)',
      aviso: 'Lojista enviou pedido com endereço ajustado na triagem HITL.',
      cards: [
        {
          id: 'card_pap_1',
          lojistaId: 'loj_papelaria',
          destinatarioNome: 'Paulo Silveira',
          telefone: '(81) 98888-7777',
          logradouro: 'Rua do Sol',
          numero: '142',
          bairro: 'Santo Antônio',
          cidade: 'Recife',
          volume: '3 pacotes (Papel Sulfite & Toner)',
          pesoKg: 2.4,
          perecivel: false,
          aprovado: false,
        },
        {
          id: 'card_pap_2',
          lojistaId: 'loj_papelaria',
          destinatarioNome: 'Bruno Henrique Barbosa',
          telefone: '(81) 98700-1122',
          logradouro: 'Av. Conde da Boa Vista',
          numero: '800',
          bairro: 'Boa Vista',
          cidade: 'Recife',
          volume: '1 fardo (Bobinas Térmicas Fiscais)',
          pesoKg: 4.2,
          perecivel: false,
          aprovado: false,
        },
        {
          id: 'card_pap_3',
          lojistaId: 'loj_papelaria',
          destinatarioNome: 'Juliana Valença',
          telefone: '(81) 99333-8899',
          logradouro: 'Rua da Aurora',
          numero: '510',
          bairro: 'Santo Amaro',
          cidade: 'Recife',
          volume: '2 pacotes (Envelopes & Pastas Arquivo)',
          pesoKg: 1.5,
          perecivel: false,
          aprovado: false,
        },
      ],
    },
    {
      id: 'sessao_modachic',
      key: 'modachic',
      lojistaId: 'loj_modachic',
      lojistaNome: 'Mariana Pontes • Moda Chic Recife (Pina)',
      canal: 'WHATSAPP MENSAGEM & EDI',
      horario: '10:30',
      textoBruto:
        'Olá equipe SEALog! Separei 3 caixas de coleções de vestuário para envio expresso: 1) Gabriela Meireles, Av Conselheiro Aguiar 1500 Boa Viagem, fone 99654-7890, 1 caixa roupas 1.9kg. 2) Rodrigo Faro de Melo, Rua Ribeiro de Brito 720 Boa Viagem, fone 98456-1122, peças de linho 2.2kg. 3) Danielle Peixoto, Av Domingos Ferreira 2800 Boa Viagem, fone 99789-3344, vestidos e acessórios 1.6kg.',
      audioNome: 'audio_modachic_vestuario.ogg (0:21)',
      aviso: undefined,
      cards: [
        {
          id: 'card_moda_1',
          lojistaId: 'loj_modachic',
          destinatarioNome: 'Gabriela Meireles',
          telefone: '(81) 99654-7890',
          logradouro: 'Av. Conselheiro Aguiar',
          numero: '1500',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 caixa média (Vestuário de Festa)',
          pesoKg: 1.9,
          perecivel: false,
          aprovado: false,
        },
        {
          id: 'card_moda_2',
          lojistaId: 'loj_modachic',
          destinatarioNome: 'Rodrigo Faro de Melo',
          telefone: '(81) 98456-1122',
          logradouro: 'Rua Ribeiro de Brito',
          numero: '720',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 pacote (Camisas de Linho)',
          pesoKg: 2.2,
          perecivel: false,
          aprovado: false,
        },
        {
          id: 'card_moda_3',
          lojistaId: 'loj_modachic',
          destinatarioNome: 'Danielle Peixoto',
          telefone: '(81) 99789-3344',
          logradouro: 'Av. Domingos Ferreira',
          numero: '2800',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          volume: '1 caixa média (Vestidos & Acessórios)',
          pesoKg: 1.6,
          perecivel: false,
          aprovado: false,
        },
      ],
    },
  ]);

  // Estados do Cadastro Manual Assistido
  const [modoEntrada, setModoEntrada] = useState<'manual' | 'planilha'>('manual');
  const [novoLojistaId, setNovoLojistaId] = useState(lojistas[0]?.id || 'loj_farmacia');
  const [novoNome, setNovoNome] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoLogradouro, setNovoLogradouro] = useState('');
  const [novoNumero, setNovoNumero] = useState('');
  const [novoBairro, setNovoBairro] = useState('Boa Viagem');
  const novoCidade = 'Recife';
  const [novoVolume, setNovoVolume] = useState('1 caixa pequena');
  const [novoPeso, setNovoPeso] = useState('1.0');
  const [novoPerecivel, setNovoPerecivel] = useState(false);
  const [novoTipoPrazo, setNovoTipoPrazo] = useState<TipoPrazoEntrega>('D_MAIS_1');
  const [novaDataAgendadaCustom, setNovaDataAgendadaCustom] = useState('2026-10-31');
  const [novoTemHorarioMarcado, setNovoTemHorarioMarcado] = useState(false);
  const [novoHorarioMarcadoCustom, setNovoHorarioMarcadoCustom] = useState('14:30');

  // Estados do Importador de Planilha
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);
  const [planilhaImportadaSucesso, setPlanilhaImportadaSucesso] = useState(false);

  const pedidosPendentes = pedidos.filter((p) => p.status === 'PENDENTE_DADOS');

  const resultadoBusca = termoBusca.trim()
    ? pedidos.filter(
        (p) =>
          p.codigoCurto.toLowerCase().includes(termoBusca.toLowerCase()) ||
          p.destinatario.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
          p.destinatario.telefone.includes(termoBusca)
      )
    : [];

  const handleSalvarCorrecao = (pedidoId: string) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    if (!pedido) return;

    if (!numeroEditado.trim() || !telefoneEditado.trim()) {
      mostrarNotificacao('warning', 'Preencha o número do endereço e o telefone com DDD para liberar o pedido.');
      return;
    }

    atualizarPedido(pedidoId, {
      status: 'CRIADO',
      destinatario: {
        ...pedido.destinatario,
        telefone: telefoneEditado,
        endereco: {
          ...pedido.destinatario.endereco,
          numero: numeroEditado,
        },
      },
    });

    setPedidoEdicaoId(null);
    mostrarNotificacao(
      'success',
      `Pedido ${pedido.codigoCurto} regularizado com sucesso e liberado para despacho!`
    );
  };

  // Funções do Split-Screen HITL
  const handleAprovarCardHITL = (sessaoId: string, cardId: string) => {
    const sessao = sessoesTriagem.find((s) => s.id === sessaoId);
    if (!sessao) return;
    const card = sessao.cards.find((c) => c.id === cardId);
    if (!card) return;

    adicionarPedido({
      lojistaId: card.lojistaId,
      destinatario: {
        nome: card.destinatarioNome,
        telefone: card.telefone,
        endereco: {
          logradouro: card.logradouro,
          numero: card.numero,
          bairro: card.bairro,
          cidade: card.cidade,
        },
      },
      volume: card.volume,
      pesoKg: card.pesoKg,
      dataCriacao: new Date().toISOString(),
      dataDesejada: 'Hoje até às 17:00',
      perecivel: card.perecivel,
      status: 'CRIADO',
      tipoTransporte: 'DIRETO',
      elegibilidadeFinanceira: 'PENDENTE',
    });

    setSessoesTriagem((ant) =>
      ant.map((s) =>
        s.id === sessaoId
          ? {
              ...s,
              cards: s.cards.map((c) => (c.id === cardId ? { ...c, aprovado: true } : c)),
            }
          : s
      )
    );

    mostrarNotificacao('success', `Pedido para ${card.destinatarioNome} aprovado e enviado para o despacho!`);
  };

  const handleAprovarTodoLoteHITL = (sessaoId: string) => {
    const sessao = sessoesTriagem.find((s) => s.id === sessaoId);
    if (!sessao) return;

    const cardsNaoAprovados = sessao.cards.filter((c) => !c.aprovado);
    if (cardsNaoAprovados.length === 0) {
      mostrarNotificacao('info', 'Todos os pedidos deste lojista já foram homologados.');
      return;
    }

    cardsNaoAprovados.forEach((card) => {
      adicionarPedido({
        lojistaId: card.lojistaId,
        destinatario: {
          nome: card.destinatarioNome,
          telefone: card.telefone,
          endereco: {
            logradouro: card.logradouro,
            numero: card.numero,
            bairro: card.bairro,
            cidade: card.cidade,
          },
        },
        volume: card.volume,
        pesoKg: card.pesoKg,
        dataCriacao: new Date().toISOString(),
        dataDesejada: 'Hoje até às 17:00',
        perecivel: card.perecivel,
        status: 'CRIADO',
        tipoTransporte: 'DIRETO',
        elegibilidadeFinanceira: 'PENDENTE',
      });
    });

    setSessoesTriagem((ant) =>
      ant.map((s) =>
        s.id === sessaoId
          ? {
              ...s,
              cards: s.cards.map((c) => ({ ...c, aprovado: true })),
            }
          : s
      )
    );

    mostrarNotificacao(
      'success',
      `Todas as ${cardsNaoAprovados.length} entregas de ${sessao.lojistaNome} foram homologadas!`
    );
  };

  // Cadastro Manual Assistido
  const handleCadastrarNovoPedido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoLogradouro.trim() || !novoNumero.trim()) {
      mostrarNotificacao('error', 'Preencha todos os campos obrigatórios (Destinatário, Logradouro e Número Predial).');
      return;
    }

    if (!novoTelefone.trim() || novoTelefone.length < 9) {
      mostrarNotificacao('warning', 'Informe o telefone com DDD (mínimo 9 dígitos).');
      return;
    }

    let dataDesejadaFormatada = '30/10/2026 (D+1 - Padrão)';
    if (novoTipoPrazo === 'AGENDADA') {
      const partes = novaDataAgendadaCustom.split('-');
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        dataDesejadaFormatada = `${dia}/${mes}/${ano} (Agendada)`;
      } else {
        dataDesejadaFormatada = `${novaDataAgendadaCustom} (Agendada)`;
      }
    }

    if (novoTemHorarioMarcado && novoHorarioMarcadoCustom.trim()) {
      dataDesejadaFormatada += ` às ${novoHorarioMarcadoCustom.trim()} (Horário Marcado)`;
    } else {
      dataDesejadaFormatada += ` até 18:00`;
    }

    const pedido = adicionarPedido({
      lojistaId: novoLojistaId,
      destinatario: {
        nome: novoNome,
        telefone: novoTelefone,
        endereco: {
          logradouro: novoLogradouro,
          numero: novoNumero,
          bairro: novoBairro,
          cidade: novoCidade,
        },
      },
      volume: novoVolume,
      pesoKg: parseFloat(novoPeso) || 1.0,
      dataCriacao: new Date().toISOString(),
      dataDesejada: dataDesejadaFormatada,
      prazoEntrega: novoTipoPrazo,
      dataAgendada: novoTipoPrazo === 'AGENDADA' ? novaDataAgendadaCustom : undefined,
      horarioAgendado: novoTemHorarioMarcado && novoHorarioMarcadoCustom.trim() ? novoHorarioMarcadoCustom.trim() : undefined,
      temHorarioMarcado: novoTemHorarioMarcado,
      perecivel: novoPerecivel,
      status: 'CRIADO',
      tipoTransporte: 'DIRETO',
      elegibilidadeFinanceira: 'PENDENTE',
    });

    setNovoNome('');
    setNovoTelefone('');
    setNovoLogradouro('');
    setNovoNumero('');
    mostrarNotificacao('success', `Pedido ${pedido.codigoCurto} cadastrado e liberado para o despacho!`);
  };

  // Importação em Lote via Planilha
  const handleImportarLinhasValidas = () => {
    adicionarPedido({
      lojistaId: 'loj_modachic',
      destinatario: {
        nome: 'Roberta Gomes',
        telefone: '(81) 99344-5566',
        endereco: {
          logradouro: 'Av. Boa Viagem',
          numero: '1200',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
        },
      },
      volume: '1 pacote de vestidos',
      pesoKg: 1.5,
      dataCriacao: new Date().toISOString(),
      dataDesejada: 'Hoje até às 18:00',
      perecivel: false,
      status: 'CRIADO',
      tipoTransporte: 'DIRETO',
      elegibilidadeFinanceira: 'PENDENTE',
    });

    adicionarPedido({
      lojistaId: 'loj_papelaria',
      destinatario: {
        nome: 'Marcos Vinicius',
        telefone: '(81) 98711-2233',
        endereco: {
          logradouro: 'Rua da Hora',
          numero: '450',
          bairro: 'Espinheiro',
          cidade: 'Recife',
        },
      },
      volume: '2 caixas de cadernos',
      pesoKg: 2.0,
      dataCriacao: new Date().toISOString(),
      dataDesejada: 'Hoje até às 16:00',
      perecivel: false,
      status: 'CRIADO',
      tipoTransporte: 'DIRETO',
      elegibilidadeFinanceira: 'PENDENTE',
    });

    setPlanilhaImportadaSucesso(true);
    mostrarNotificacao('success', '2 pedidos válidos da planilha importados com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Banner de Alerta de Contingência Ativo Disparado pelo Coordenador */}
      {alertaContingencia && alertaContingencia.ativo && (
        <div className="bg-amber-500 text-slate-950 p-4 rounded-xl shadow-xs border border-amber-600 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <div className="font-black text-sm uppercase tracking-wide">
                Alerta de Contingência Ativo: {alertaContingencia.regiao}
              </div>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {alertaContingencia.mensagem} — Orientar clientes e lojistas que entrarem em contato sobre prazos estendidos.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold bg-amber-400 px-2 py-0.5 rounded text-slate-900 shrink-0">
            {alertaContingencia.dataHora}
          </span>
        </div>
      )}

      {/* Aba: Triagem Split-Screen (HITL - Agrupamento 1:N) */}
      {abaAtiva === 'triagem' && escopoMoscow === 'completo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <SplitSquareVertical className="w-5 h-5 text-sealog-blue" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Triagem Human-in-the-Loop — Ingestão Multicanal (1:N)
                </h3>
                <p className="text-xs text-slate-500">
                  Fila unificada de lotes recebidos via WhatsApp (áudios e mensagens) para homologação e criação automática de pedidos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-sealog-blue border border-blue-200">
                {sessoesTriagem.reduce((acc, s) => acc + s.cards.filter((c) => !c.aprovado).length, 0)} pedidos pendentes de aprovação
              </span>
            </div>
          </div>

          {/* Lista Unificada Vertical de Sessões de Lojistas */}
          <div className="space-y-6">
            {sessoesTriagem.map((sessao) => {
              const pendentes = sessao.cards.filter((c) => !c.aprovado).length;
              const isPlaying = audioTocandoId === sessao.id;

              return (
                <div
                  key={sessao.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4"
                >
                  {/* Cabeçalho da Sessão */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sessao.lojistaNome}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {sessao.canal}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Hoje às {sessao.horario}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pendentes > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleAprovarTodoLoteHITL(sessao.id)}
                          className="px-3 py-1.5 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprovar Lote Completo ({pendentes} {pendentes === 1 ? 'pedido' : 'pedidos'})</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Todos Aprovados
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Painel Split-Screen HITL da Sessão */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Coluna Esquerda: Transcrição e Player de Áudio */}
                    <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Mensagem Bruta / Transcrição Whisper</span>
                        <span className="font-mono text-[10px]">{sessao.horario}</span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-slate-800">
                        <p className="font-medium leading-relaxed italic">"{sessao.textoBruto}"</p>

                        {sessao.audioNome && (
                          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg text-slate-700 mt-2">
                            <button
                              type="button"
                              onClick={() => setAudioTocandoId(isPlaying ? null : sessao.id)}
                              className="p-1.5 rounded-full bg-sealog-blue text-white hover:bg-sealog-blue-800 transition cursor-pointer"
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                            <Volume2 className="w-4 h-4 text-sealog-blue shrink-0" />
                            <span className="text-[11px] font-mono truncate">{sessao.audioNome}</span>
                            <span className="ml-auto text-[10px] font-bold text-slate-500 shrink-0">
                              {isPlaying ? 'Reproduzindo...' : 'Player'}
                            </span>
                          </div>
                        )}
                      </div>

                      {sessao.aviso && (
                        <div className="text-[11px] text-amber-800 font-medium bg-amber-50 p-2.5 rounded-lg border border-amber-300">
                          ⚠️ {sessao.aviso}
                        </div>
                      )}
                    </div>

                    {/* Coluna Direita: Cards Propostos de Pedidos */}
                    <div className="md:col-span-7 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                        <span>Entregas Extraídas ({sessao.cards.length}):</span>
                        <span className="text-[11px] text-slate-400">Clique para aprovar individualmente</span>
                      </div>

                      <div className="space-y-2.5">
                        {sessao.cards.map((card, idx) => (
                          <div
                            key={card.id}
                            className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition ${
                              card.aprovado
                                ? 'bg-emerald-50/70 border-emerald-300'
                                : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sealog-blue">
                                Entrega #{idx + 1} • {card.destinatarioNome}
                              </span>
                              {card.perecivel && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                                  <Flame className="w-3 h-3 text-rose-600" /> Perecível (3h)
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Endereço:</span>
                                <span className="font-medium text-slate-900">
                                  {card.logradouro}, {card.numero || <strong className="text-rose-600">Sem número</strong>} ({card.bairro})
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Telefone:</span>
                                <span className="font-medium text-slate-900">{card.telefone}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Volume / Descrição:</span>
                                <span className="font-medium text-slate-800">{card.volume}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Peso aferido:</span>
                                <span className="font-bold text-slate-900">{card.pesoKg} kg</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                              {card.aprovado ? (
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Homologado e Criado
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAprovarCardHITL(sessao.id, card.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" /> Aprovar Pedido
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Aba: Pedidos Incompletos */}
      {abaAtiva === 'pendentes' && (
        <div className="bg-white rounded-xl border border-amber-200 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pedidos com Dados Incompletos
                </h3>
                <p className="text-xs text-slate-500">
                  Pedidos aguardando regularização ativa de endereço ou telefone via WhatsApp.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              {pedidosPendentes.length} Pendentes
            </span>
          </div>

          {pedidosPendentes.length === 0 ? (
            <div className="py-8 text-center text-emerald-700 bg-emerald-50/50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-sm">Nenhum pedido pendente de dados no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidosPendentes.map((pedido) => {
                const emEdicao = pedidoEdicaoId === pedido.id;
                return (
                  <div
                    key={pedido.id}
                    className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-900 text-sm">
                          {pedido.codigoCurto}
                        </span>
                        <StatusBadge status={pedido.status} />
                        <span className="text-xs text-slate-500 font-medium">
                          Papelaria & Bazar Central
                        </span>
                      </div>

                      <a
                        href="https://wa.me/5581988887777"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Contatar Lojista
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                        <span className="text-slate-500 block font-medium">Destinatário:</span>
                        <span className="font-bold text-slate-800">{pedido.destinatario.nome}</span>
                        <span className="text-rose-600 block text-[11px] font-semibold mt-0.5">
                          Telefone: {pedido.destinatario.telefone} {!pedido.destinatario.telefone.includes('(') && '(sem DDD)'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                        <span className="text-slate-500 block font-medium">Endereço Informado:</span>
                        <span className="font-semibold text-slate-800">
                          {pedido.destinatario.endereco.logradouro}, {pedido.destinatario.endereco.numero || <strong className="text-rose-600">Sem número</strong>} — {pedido.destinatario.endereco.bairro}
                        </span>
                        {pedido.observacoes && (
                          <span className="text-amber-800 block text-[11px] font-medium mt-0.5">
                            Obs: {pedido.observacoes}
                          </span>
                        )}
                      </div>
                    </div>

                    {!emEdicao ? (
                      <button
                        onClick={() => {
                          setPedidoEdicaoId(pedido.id);
                          setNumeroEditado(pedido.destinatario.endereco.numero || '142');
                          setTelefoneEditado(
                            pedido.destinatario.telefone.includes('(')
                              ? pedido.destinatario.telefone
                              : `(81) ${pedido.destinatario.telefone}`
                          );
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Completar Cadastro</span>
                      </button>
                    ) : (
                      <div className="bg-white p-3.5 rounded-xl border border-sealog-blue/30 space-y-3">
                        <p className="text-xs font-bold text-sealog-blue">
                          Completar Cadastro ({pedido.codigoCurto}):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Número Predial:
                            </label>
                            <input
                              type="text"
                              value={numeroEditado}
                              onChange={(e) => setNumeroEditado(e.target.value)}
                              placeholder="Ex: 142"
                              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sealog-blue"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Telefone (com DDD):
                            </label>
                            <input
                              type="text"
                              value={telefoneEditado}
                              onChange={(e) => setTelefoneEditado(e.target.value)}
                              placeholder="Ex: (81) 98888-7777"
                              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sealog-blue"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleSalvarCorrecao(pedido.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Salvar e Liberar
                          </button>
                          <button
                            onClick={() => setPedidoEdicaoId(null)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Aba: Localizador de Entregas (SAC) */}
      {abaAtiva === 'localizador' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-sealog-blue" />
            <h3 className="text-base font-bold text-slate-900">
              Localizador de Entregas (SAC)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Consulte pedidos em tempo real por código curto (`SL-xxxx`), nome ou telefone.
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Digite o código (ex: SL-1041), nome ou telefone..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sealog-blue text-slate-800"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
          </div>

          {termoBusca.trim() && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resultados ({resultadoBusca.length}):
              </h4>
              {resultadoBusca.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  Nenhum pedido localizado com o termo digitado.
                </p>
              ) : (
                resultadoBusca.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sealog-blue text-sm">
                          {p.codigoCurto}
                        </span>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="font-semibold text-slate-800 mt-1">
                        {p.destinatario.nome} ({p.destinatario.telefone})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {p.destinatario.endereco.logradouro}, {p.destinatario.endereco.numero} — {p.destinatario.endereco.bairro}
                      </p>
                      {p.comprovante && (
                        <p className="text-[11px] text-emerald-700 mt-1">
                          Recebedor: <strong>{p.comprovante.recebedorNome}</strong> às {p.comprovante.entregueEm.slice(11, 16)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {p.status === 'CONCLUIDO' && (
                        <button
                          onClick={() => contestarEntrega(p.id, 'Contestação solicitada pelo lojista via atendimento')}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-300 rounded-lg hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldAlert className="w-3 h-3 text-rose-600" /> Contestar Entrega
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Aba: Novo Pedido / Importar */}
      {abaAtiva === 'novo_pedido' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FilePlus className="w-5 h-5 text-sealog-blue" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cadastro Assistido e Importação de Pedidos
                </h3>
                <p className="text-xs text-slate-500">
                  Cadastre coletas recebidas por telefone/balcão com validação estrita ou importe planilhas de lote.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setModoEntrada('manual')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  modoEntrada === 'manual'
                    ? 'bg-sealog-blue text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Formulário Assistido
              </button>
              <button
                type="button"
                onClick={() => setModoEntrada('planilha')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  modoEntrada === 'planilha'
                    ? 'bg-sealog-blue text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Importar Planilha (.xlsx/.csv)
              </button>
            </div>
          </div>

          {modoEntrada === 'manual' ? (
            <form onSubmit={handleCadastrarNovoPedido} className="space-y-4 max-w-2xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lojista Remetente:</label>
                  <select
                    value={novoLojistaId}
                    onChange={(e) => setNovoLojistaId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {lojistas.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nome} ({l.bairro})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nome do Destinatário:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo Barreto"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telefone (com DDD):</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: (81) 99888-2233"
                    value={novoTelefone}
                    onChange={(e) => setNovoTelefone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Logradouro / Rua:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua São Miguel"
                    value={novoLogradouro}
                    onChange={(e) => setNovoLogradouro(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Número Predial (Obrigatório):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 890"
                    value={novoNumero}
                    onChange={(e) => setNovoNumero(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bairro de Destino:</label>
                  <select
                    value={novoBairro}
                    onChange={(e) => setNovoBairro(e.target.value)}
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
                  <label className="block text-slate-700 font-bold mb-1">Volume / Descrição:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1 sacola com cabide"
                    value={novoVolume}
                    onChange={(e) => setNovoVolume(e.target.value)}
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
                    value={novoPeso}
                    onChange={(e) => setNovoPeso(e.target.value)}
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
                      novoTipoPrazo === 'D_MAIS_1'
                        ? 'bg-blue-50 border-sealog-blue text-slate-900 font-semibold ring-1 ring-sealog-blue/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="novoTipoPrazoAtendente"
                      value="D_MAIS_1"
                      checked={novoTipoPrazo === 'D_MAIS_1'}
                      onChange={() => setNovoTipoPrazo('D_MAIS_1')}
                      className="mt-0.5 text-sealog-blue focus:ring-sealog-blue"
                    />
                    <div>
                      <div className="text-xs font-bold text-sealog-blue">Dia Seguinte (D+1) — Padrão SEALog</div>
                      <div className="text-[10px] text-slate-500">Entrega programada para amanhã (30/10)</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition ${
                      novoTipoPrazo === 'AGENDADA'
                        ? 'bg-purple-50 border-purple-500 text-slate-900 font-semibold ring-1 ring-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="novoTipoPrazoAtendente"
                      value="AGENDADA"
                      checked={novoTipoPrazo === 'AGENDADA'}
                      onChange={() => setNovoTipoPrazo('AGENDADA')}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-purple-700">Data Agendada</div>
                      <div className="text-[10px] text-slate-500">Escolha uma data futura específica</div>
                    </div>
                  </label>
                </div>

                {novoTipoPrazo === 'AGENDADA' && (
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                    <span className="text-slate-600 text-[11px] font-medium">Data agendada da entrega:</span>
                    <input
                      type="date"
                      min="2026-10-29"
                      value={novaDataAgendadaCustom}
                      onChange={(e) => setNovaDataAgendadaCustom(e.target.value)}
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
                        checked={novoTemHorarioMarcado}
                        onChange={(e) => setNovoTemHorarioMarcado(e.target.checked)}
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

                  {novoTemHorarioMarcado && (
                    <div className="p-2.5 bg-white rounded-lg border border-purple-200 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-600 font-medium">Horário agendado:</span>
                        <input
                          type="time"
                          value={novoHorarioMarcadoCustom}
                          onChange={(e) => setNovoHorarioMarcadoCustom(e.target.value)}
                          className="p-1.5 border border-slate-300 rounded-md text-xs bg-slate-50 font-bold text-slate-900 focus:ring-1 focus:ring-purple-600"
                        />
                        <div className="flex items-center gap-1">
                          {['10:00', '11:30', '14:00', '15:30', '17:00'].map((hora) => (
                            <button
                              key={hora}
                              type="button"
                              onClick={() => setNovoHorarioMarcadoCustom(hora)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition cursor-pointer ${
                                novoHorarioMarcadoCustom === hora
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
                  checked={novoPerecivel}
                  onChange={(e) => setNovoPerecivel(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  Carga Perecível (Alta sensibilidade temporal: flores, medicamentos ou alimentos)
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-sealog-blue hover:bg-sealog-blue-800 text-white rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Cadastrar e Liberar para Despacho
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              {!planilhaCarregada ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 space-y-3">
                  <FileSpreadsheet className="w-10 h-10 text-sealog-blue mx-auto" />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Upload de Romaneio em Planilha</h5>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Suporte a arquivos .xlsx e .csv contendo colunas de Destinatário, Endereço, Bairro e Peso.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlanilhaCarregada(true)}
                    className="px-4 py-2 bg-sealog-blue text-white rounded-lg font-bold transition hover:bg-sealog-blue-800 cursor-pointer shadow-xs"
                  >
                    Carregar Planilha de Demonstração (3 Registros)
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Prévia das Linhas Detectadas na Planilha:
                    </span>
                    <button
                      type="button"
                      onClick={() => setPlanilhaCarregada(false)}
                      className="text-slate-500 hover:text-slate-700 text-[11px]"
                    >
                      Trocar arquivo
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    <div className="p-3 bg-emerald-50/70 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-950">1. Roberta Gomes</span> — Av. Boa Viagem, 1200 (Boa Viagem)
                        <span className="text-slate-500 block text-[11px]">1 pacote (1.5 kg) • Moda Chic</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        ✓ Válida
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50/70 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-950">2. Marcos Vinicius</span> — Rua da Hora, 450 (Espinheiro)
                        <span className="text-slate-500 block text-[11px]">2 caixas (2.0 kg) • Papelaria Central</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        ✓ Válida
                      </span>
                    </div>

                    <div className="p-3 bg-rose-50/70 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-rose-950">3. Amanda Silveira</span> — Rua Real da Torre, <strong className="text-rose-700">(Sem número)</strong>
                        <span className="text-rose-700 block text-[11px]">Número predial ausente • Inconsistente</span>
                      </div>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                        ⚠️ Bloqueada
                      </span>
                    </div>
                  </div>

                  {!planilhaImportadaSucesso ? (
                    <button
                      type="button"
                      onClick={handleImportarLinhasValidas}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" /> Importar Linhas Válidas (2 Pedidos)
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 font-bold text-center">
                      ✓ Pedidos importados com sucesso para a fila de despacho!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
