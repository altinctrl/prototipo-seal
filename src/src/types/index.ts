/**
 * Tipos de Domínio do Sistema SEALog (Ubiquitous Language)
 * Conforme especificado em GLOSSARY.md e 03_Engenharia_Software/especificacao_requisitos.md
 */

export type PerfilUsuario =
  | 'coordenador'
  | 'analista'
  | 'atendente'
  | 'financeiro'
  | 'lojista'
  | 'parceiro'
  | 'consumidor'
  | 'entregador_pwa';

export type TurnoOperacional =
  | 'todos'         // Exibe todos os pedidos do dia
  | 'manha'         // 08h–11h: Ingestão, Triagem HITL e Despacho
  | 'tarde'         // 11h–15h: Rotas de Rua, Coletas e Hub Galpão
  | 'fim_tarde'     // 15h–17h: Alertas de Chuva e Ocorrências
  | 'fechamento';   // 17h–19h: Mesa de Decisão e Fechamento Financeiro

export type EscopoMoscow = 'must' | 'should' | 'completo';

export type TipoOcorrencia =
  | 'DESTINATARIO_AUSENTE'
  | 'ENDERECO_INCORRETO'
  | 'CLIENTE_RECUSOU'
  | 'INTEMPERIE_CHUVAS'
  | 'OUTROS';

export type StatusPedido =
  | 'CRIADO'               // Pedido cadastrado no portal ou atendimento
  | 'PENDENTE_DADOS'      // Bloqueado por dados ausentes
  | 'ATRIBUIDO'           // Despachado para parceira
  | 'EM_TRANSITO'         // Em rota de entrega ou coleta
  | 'NO_GALPAO'           // Galpão Central (Transbordo)
  | 'LIBERADO_PERNA_2'    // Liberado para entrega final
  | 'CONCLUIDO'           // Entregue ao destinatário
  | 'OCORRENCIA'          // Insucesso temporário (destinatário ausente, etc)
  | 'DEVOLVIDO';          // Retornado ao remetente

export type TipoTransporte = 'DIRETO' | 'CROSS_DOCKING';

export type ElegibilidadeFinanceira =
  | 'LIBERADO'            // Aprovado com foto POD para repasse imediato
  | 'RETIDO_PRAZO'        // Sem foto (texto/verbal), retido na carência de 48h
  | 'BLOQUEADO_GLOSA'     // Contestado pelo lojista ou glosado
  | 'PENDENTE';           // Em andamento, não elegível para fechamento

export type CanalConfirmacao =
  | 'WHATSAPP_TEXTO'
  | 'WHATSAPP_FOTO'
  | 'PLANILHA'
  | 'MANUAL';

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep?: string;
}

export interface Destinatario {
  nome: string;
  telefone: string;
  endereco: Endereco;
}

export interface HistoricoEvento {
  id: string;
  evento: string;
  dataHora: string;
  detalhes?: string;
  autor?: string;
  status: StatusPedido;
}

export interface ComprovanteEntrega {
  recebedorNome: string;
  recebedorDoc?: string;
  entregueEm: string;
  fotoUrl?: string;
  canalConfirmacao: CanalConfirmacao;
  observacao?: string;
}

export interface OcorrenciaEntrega {
  tipo: TipoOcorrencia;
  descricao: string;
  registradaEm: string;
  imputavelParceira: boolean;
  resolvida: boolean;
}

export interface AtribuicaoParceira {
  parceiraPerna1Id?: string; // 1º Trecho: Coleta no Lojista até o Hub Central
  parceiraPerna2Id?: string; // 2º Trecho: Entrega Final do Hub ao Destinatário
  parceiraTrecho1Id?: string; // Alias semântico para 1º Trecho
  parceiraTrecho2Id?: string; // Alias semântico para 2º Trecho
  dataAtribuicao?: string;
}

export type TipoPrazoEntrega =
  | 'D_MAIS_1'     // Padrão SEALog: entrega no dia útil seguinte ao pedido
  | 'AGENDADA';    // Data agendada específica escolhida pelo remetente/cliente

export interface Pedido {
  id: string;
  codigoCurto: string; // Ex: SL-1041
  lojistaId: string;
  destinatario: Destinatario;
  volume: string; // Tamanho / descrição do volume (ex: 1 caixa média, envelope)
  pesoKg?: number; // Peso em quilogramas para cálculo externo de frete
  dataCriacao: string;
  dataDesejada: string; // Texto legível (ex: '30/10/2026 (D+1 - Padrão) até 18:00')
  prazoEntrega?: TipoPrazoEntrega; // D+1 (padrão) ou Data Agendada
  dataAgendada?: string; // Data específica ISO/YYYY-MM-DD quando agendada
  horarioAgendado?: string; // Horário marcado específico para entrega (ex: '14:30', '10:00')
  temHorarioMarcado?: boolean; // Flag indicando entrega com horário marcado específico
  observacoes?: string;
  perecivel?: boolean; // Carga perecível/sensível (flores, medicamentos, alimentos)
  turno?: TurnoOperacional; // Turno operacional estimado/atribuído
  status: StatusPedido;
  tipoTransporte: TipoTransporte;
  atribuicao?: AtribuicaoParceira;
  ocorrencia?: OcorrenciaEntrega | null;
  comprovante?: ComprovanteEntrega | null;
  elegibilidadeFinanceira: ElegibilidadeFinanceira;
  historico: HistoricoEvento[];
}

export interface Parceira {
  id: string;
  nome: string;
  tipoOperacao: 'PLANILHA' | 'WHATSAPP';
  descricao?: string;
  regioesAtendidas: string[];
  limiteDiario: number;
  entregasAtribuidasHoje: number;
  contato: string;
  telefone: string;
}

export type ParceiraTransporte = Parceira;

export interface Lojista {
  id: string;
  nome: string;
  cnpj: string;
  bairro: string;
  cidade: string;
  telefone: string;
  responsavel: string;
  totalPedidosMes: number;
}

export interface AlertaMassa {
  id: string;
  regiao: string;
  motivo: string;
  mensagem: string;
  dataHora: string;
  pedidosAfetados?: string[];
  ativo: boolean;
}

export interface MagicLinkRota {
  token: string;
  parceiraId: string;
  nomeEntregador: string;
  pedidosCodigos: string[];
  criadoEm: string;
  expiraEm: string;
}

export interface EstadoSealog {
  pedidos: Pedido[];
  parceiras: Parceira[];
  lojistas: Lojista[];
  perfilAtivo: PerfilUsuario;
  turnoAtivo: TurnoOperacional;
  lojistaSelecionadoId: string;
  parceiraSelecionadaId: string;
  alertaContingencia: AlertaMassa | null;
  abaAtiva: string;
}

