import { Pedido, Parceira, Lojista } from '../types';
import originalPhoto from '../assets/original.png';

export const BAIRROS_ATENDIDOS_RMR: string[] = [
  'Boa Viagem',
  'Pina',
  'Imbiribeira',
  'Santo Antônio',
  'Boa Vista',
  'Espinheiro',
  'Graças',
  'Bairro Novo',
  'Casa Caiada',
  'Piedade',
  'Candeias',
];

export const PARCEIRAS_INICIAIS: Parceira[] = [
  {
    id: 'refactor_express',
    nome: 'Refactor Express',
    tipoOperacao: 'PLANILHA',
    descricao: 'Integração via planilhas eletrônicas e EDI.',
    regioesAtendidas: ['Espinheiro', 'Graças', 'Santo Antônio', 'Boa Vista', 'Bairro Novo', 'Casa Caiada'],
    limiteDiario: 250,
    entregasAtribuidasHoje: 142,
    contato: 'Juliana Mendes (Supervisora)',
    telefone: '(81) 98111-2222',
  },
  {
    id: 'fretes_seu_ze',
    nome: 'Fretes do Seu Zé',
    tipoOperacao: 'WHATSAPP',
    descricao: 'Operação ágil com atendimento direto via WhatsApp.',
    regioesAtendidas: ['Boa Viagem', 'Pina', 'Imbiribeira', 'Piedade', 'Candeias', 'Santo Antônio'],
    limiteDiario: 150,
    entregasAtribuidasHoje: 98,
    contato: 'José Bonifácio (Seu Zé)',
    telefone: '(81) 98777-3333',
  },
];

export const LOJISTAS_INICIAIS: Lojista[] = [
  {
    id: 'loj_farmacia',
    nome: 'Farmácia Bom Preço',
    cnpj: '12.345.678/0001-90',
    bairro: 'Graças',
    cidade: 'Recife',
    telefone: '(81) 3222-1000',
    responsavel: 'Dra. Camila Vasconcelos',
    totalPedidosMes: 430,
  },
  {
    id: 'loj_floricultura',
    nome: 'Floricultura Jardim de Olinda',
    cnpj: '98.765.432/0001-11',
    bairro: 'Espinheiro',
    cidade: 'Recife',
    telefone: '(81) 3444-5555',
    responsavel: 'Sr. Roberto Jardim',
    totalPedidosMes: 195,
  },
  {
    id: 'loj_papelaria',
    nome: 'Papelaria & Bazar Central',
    cnpj: '45.678.901/0001-22',
    bairro: 'Boa Vista',
    cidade: 'Recife',
    telefone: '(81) 3333-8888',
    responsavel: 'Paulo Silveira',
    totalPedidosMes: 110,
  },
  {
    id: 'loj_modachic',
    nome: 'Moda Chic Recife',
    cnpj: '33.444.555/0001-66',
    bairro: 'Boa Viagem',
    cidade: 'Recife',
    telefone: '(81) 99123-4567',
    responsavel: 'Fernanda Lima',
    totalPedidosMes: 260,
  },
];

export const PEDIDOS_INICIAIS: Pedido[] = [
  {
    id: 'ped_1041',
    codigoCurto: 'SL-1041',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Marta Menezes',
      telefone: '(81) 98822-1100',
      endereco: {
        logradouro: 'Av. Boa Viagem',
        numero: '3400',
        complemento: 'Condomínio MarAzul, Bloco B, Apto 802',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51020-001',
      },
    },
    volume: '1 caixa pequena (Medicamentos)',
    pesoKg: 0.8,
    dataCriacao: '2026-10-28T09:30:00Z',
    dataDesejada: '28/10/2026 às 14:00',
    prazoEntrega: 'D_MAIS_1',
    horarioAgendado: '14:00',
    temHorarioMarcado: true,
    observacoes: 'Entregar com urgência até as 14h.',
    turno: 'manha',
    status: 'CONCLUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-28T10:00:00Z',
    },
    comprovante: {
      recebedorNome: 'Severino (Portaria)',
      recebedorDoc: 'RG 4.512.980 SDS',
      entregueEm: '2026-10-28T13:45:00Z',
      canalConfirmacao: 'WHATSAPP_TEXTO',
      observacao: 'Baixa informada via WhatsApp do Seu Zé sem foto anexada.',
    },
    elegibilidadeFinanceira: 'RETIDO_PRAZO',
    historico: [
      {
        id: 'hist_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-28 09:30',
        detalhes: 'Cadastro via Portal do Lojista',
        status: 'CRIADO',
      },
      {
        id: 'hist_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-28 10:00',
        detalhes: 'Alocado para Fretes do Seu Zé',
        status: 'ATRIBUIDO',
      },
      {
        id: 'hist_3',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-28 11:15',
        detalhes: 'Motorista em deslocamento',
        status: 'EM_TRANSITO',
      },
      {
        id: 'hist_4',
        evento: 'Entrega Concluída',
        dataHora: '2026-10-28 13:45',
        detalhes: 'Recebido por Severino (Portaria).',
        autor: 'Analista de Operações',
        status: 'CONCLUIDO',
      },
    ],
  },
  {
    id: 'ped_1042',
    codigoCurto: 'SL-1042',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Carlos Drummond da Silva',
      telefone: '(81) 99122-3344',
      endereco: {
        logradouro: 'Rua das Laranjeiras',
        numero: '512',
        bairro: 'Piedade',
        cidade: 'Jaboatão dos Guararapes',
        cep: '54400-110',
      },
    },
    volume: '2 caixas médias (Cosméticos)',
    pesoKg: 3.5,
    dataCriacao: '2026-10-28T08:15:00Z',
    dataDesejada: '29/10/2026 às 10:00',
    observacoes: 'Coleta em Olinda e entrega em Jaboatão.',
    turno: 'tarde',
    status: 'NO_GALPAO',
    tipoTransporte: 'CROSS_DOCKING',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      parceiraPerna2Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-28T09:00:00Z',
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'hist_20',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-28 08:15',
        detalhes: 'Rota com transbordo no Galpão Central',
        status: 'CRIADO',
      },
      {
        id: 'hist_21',
        evento: 'Coleta Concluída',
        dataHora: '2026-10-28 12:30',
        detalhes: 'Refactor Express coletou na loja e transportou para o Galpão Central',
        status: 'EM_TRANSITO',
      },
      {
        id: 'hist_22',
        evento: 'Entrada no Galpão',
        dataHora: '2026-10-28 14:10',
        detalhes: 'Pacote conferido fisicamente no Galpão Central',
        autor: 'Analista de Operações',
        status: 'NO_GALPAO',
      },
    ],
  },
  {
    id: 'ped_1043',
    codigoCurto: 'SL-1043',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Ana Clara Albuquerque',
      telefone: '(81) 98765-4321',
      endereco: {
        logradouro: 'Rua dos Navegantes',
        numero: '1280',
        complemento: 'Apto 1102',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51020-010',
      },
    },
    volume: '1 caixa média (Frágil)',
    pesoKg: 1.2,
    dataCriacao: '2026-10-28T10:00:00Z',
    dataDesejada: '28/10/2026 às 14:00',
    prazoEntrega: 'D_MAIS_1',
    horarioAgendado: '14:00',
    temHorarioMarcado: true,
    observacoes: 'Produto frágil. Manter na vertical.',
    perecivel: true,
    turno: 'fim_tarde', // Buquê de flores frescas perecíveis
    status: 'OCORRENCIA',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-28T10:30:00Z',
    },
    ocorrencia: {
      tipo: 'DESTINATARIO_AUSENTE',
      descricao: 'Tentativa de entrega não concluída: destinatário ausente na portaria.',
      registradaEm: '2026-10-28T14:30:00Z',
      imputavelParceira: false,
      resolvida: false,
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'hist_30',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-28 10:00',
        detalhes: 'Floricultura Jardim solicitou envio prioritário',
        status: 'CRIADO',
      },
      {
        id: 'hist_31',
        evento: 'Saída para Entrega',
        dataHora: '2026-10-28 11:30',
        detalhes: 'Fretes do Seu Zé em trânsito',
        status: 'EM_TRANSITO',
      },
      {
        id: 'hist_32',
        evento: 'Insucesso: Destinatário Ausente',
        dataHora: '2026-10-28 14:30',
        detalhes: 'Destinatário ausente na portaria.',
        status: 'OCORRENCIA',
      },
    ],
  },
  {
    id: 'ped_1044',
    codigoCurto: 'SL-1044',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Paulo Silveira',
      telefone: '988887777', // Incompleto: sem DDD
      endereco: {
        logradouro: 'Rua do Sol',
        numero: '', // Omissão intencional: sem número
        bairro: 'Santo Antônio',
        cidade: 'Recife',
      },
    },
    volume: '3 pacotes (Papelaria)',
    pesoKg: 2.4,
    dataCriacao: '2026-10-28T11:00:00Z',
    dataDesejada: '29/10/2026 às 11:00',
    observacoes: 'Cadastro balcão.',
    turno: 'manha',
    status: 'PENDENTE_DADOS',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'hist_40',
        evento: 'Cadastro Incompleto',
        dataHora: '2026-10-28 11:00',
        detalhes: 'Número predial e DDD pendentes.',
        status: 'PENDENTE_DADOS',
      },
    ],
  },
  {
    id: 'ped_1045',
    codigoCurto: 'SL-1045',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Carlos Eduardo Barreto',
      telefone: '(81) 99888-2233',
      endereco: {
        logradouro: 'Rua São Miguel',
        numero: '890',
        bairro: 'Afogados',
        cidade: 'Recife',
        cep: '50850-000',
      },
    },
    volume: '1 sacola de roupas com cabide',
    pesoKg: 1.5,
    dataCriacao: '2026-10-28T11:20:00Z',
    dataDesejada: '28/10/2026 às 16:00',
    prazoEntrega: 'D_MAIS_1',
    horarioAgendado: '16:00',
    temHorarioMarcado: true,
    observacoes: 'Entregar no escritório comercial.',
    turno: 'manha',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-28T12:00:00Z',
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'hist_50',
        evento: 'Pedido Despachado',
        dataHora: '2026-10-28 12:00',
        status: 'ATRIBUIDO',
      },
      {
        id: 'hist_51',
        evento: 'Em Trânsito',
        dataHora: '2026-10-28 13:00',
        detalhes: 'Deslocamento em rota com chuva forte.',
        status: 'EM_TRANSITO',
      },
    ],
  },
  {
    id: 'ped_1046',
    codigoCurto: 'SL-1046',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Juliana Bezerra Coutinho',
      telefone: '(81) 98111-9988',
      endereco: {
        logradouro: 'Rua Hora',
        numero: '350',
        bairro: 'Espinheiro',
        cidade: 'Recife',
        cep: '52020-010',
      },
    },
    volume: '1 envelope lacrado de medicamentos térmicos',
    pesoKg: 0.4,
    dataCriacao: '2026-10-28T09:00:00Z',
    dataDesejada: '28/10/2026 às 11:30',
    status: 'CONCLUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-28T09:30:00Z',
    },
    comprovante: {
      recebedorNome: 'Juliana Bezerra',
      recebedorDoc: 'CPF ***.482.914-**',
      entregueEm: '2026-10-28T11:40:00Z',
      fotoUrl: originalPhoto,
      canalConfirmacao: 'WHATSAPP_FOTO',
      observacao: 'Comprovante com foto da assinatura anexado.',
    },
    elegibilidadeFinanceira: 'LIBERADO',
    historico: [
      {
        id: 'hist_60',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-28 09:00',
        status: 'CRIADO',
      },
      {
        id: 'hist_61',
        evento: 'Entregue com Sucesso',
        dataHora: '2026-10-28 11:40',
        detalhes: 'Comprovante com foto validado.',
        status: 'CONCLUIDO',
      },
    ],
  },
  {
    id: 'ped_1047',
    codigoCurto: 'SL-1047',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Rodrigo Albuquerque',
      telefone: '(81) 98877-6655',
      endereco: {
        logradouro: 'Av. Conselheiro Aguiar',
        numero: '2100',
        complemento: 'Edf. Atlântico Sul, Apto 502',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51020-020'
      }
    },
    volume: '1 caixa pequena (Dermocosméticos)',
    pesoKg: 1.2,
    dataCriacao: '2026-10-29T08:20:00Z',
    dataDesejada: '29/10/2026 às 12:00',
    observacoes: 'Deixar na portaria com identificação.',
    turno: 'manha',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1047_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:20',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1048',
    codigoCurto: 'SL-1048',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Beatriz Montenegro',
      telefone: '(81) 99188-7744',
      endereco: {
        logradouro: 'Rua Amélia',
        numero: '310',
        complemento: 'Apto 401',
        bairro: 'Graças',
        cidade: 'Recife',
        cep: '52011-050'
      }
    },
    volume: '1 arranjo orquídeas em vaso',
    pesoKg: 0.9,
    perecivel: true,
    dataCriacao: '2026-10-29T08:35:00Z',
    dataDesejada: '29/10/2026 às 11:30',
    observacoes: 'Flores frescas naturais. Cuidado no manuseio.',
    turno: 'manha',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1048_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:35',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1049',
    codigoCurto: 'SL-1049',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Silvia Ramos Advogados',
      telefone: '(81) 3224-5500',
      endereco: {
        logradouro: 'Rua do Imperador Pedro II',
        numero: '345',
        complemento: 'Sala 601',
        bairro: 'Santo Antônio',
        cidade: 'Recife',
        cep: '50010-240'
      }
    },
    volume: '2 pastas com processos jurídicos',
    pesoKg: 2.1,
    dataCriacao: '2026-10-29T08:50:00Z',
    dataDesejada: '29/10/2026 às 12:30',
    observacoes: 'Documentos confidenciais.',
    turno: 'manha',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1049_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:50',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1050',
    codigoCurto: 'SL-1050',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Sérgio Murilo Peixoto',
      telefone: '(81) 99199-4400',
      endereco: {
        logradouro: 'Rua Setúbal',
        numero: '780',
        complemento: 'Edf. Jangadeiro, Apto 101',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51030-010'
      }
    },
    volume: '1 caixa de calças jeans e camisas',
    pesoKg: 1.5,
    dataCriacao: '2026-10-29T08:40:00Z',
    dataDesejada: '29/10/2026 às 13:30',
    turno: 'manha',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T09:10:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1050_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:40',
        status: 'CRIADO'
      },
      {
        id: 'h_1050_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 09:10',
        detalhes: 'Alocado para Fretes do Seu Zé',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1051',
    codigoCurto: 'SL-1051',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Dr. Gabriel Fontes',
      telefone: '(81) 98433-2211',
      endereco: {
        logradouro: 'Rua da Hora',
        numero: '420',
        complemento: 'Clínica Dermatológica',
        bairro: 'Espinheiro',
        cidade: 'Recife',
        cep: '52020-010'
      }
    },
    volume: '1 caixa térmica com vacinas sensíveis',
    pesoKg: 0.8,
    perecivel: true,
    dataCriacao: '2026-10-29T08:55:00Z',
    dataDesejada: '29/10/2026 às 11:45',
    turno: 'manha',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T09:20:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1051_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:55',
        status: 'CRIADO'
      },
      {
        id: 'h_1051_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 09:20',
        detalhes: 'Alocado para Refactor Express',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1052',
    codigoCurto: 'SL-1052',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Mariana Duarte',
      telefone: '(81) 99655-3322',
      endereco: {
        logradouro: 'Av. Boa Viagem',
        numero: '1800',
        complemento: 'Apto 1401',
        bairro: 'Pina',
        cidade: 'Recife',
        cep: '51011-060'
      }
    },
    volume: '2 pacotes de materiais artísticos',
    pesoKg: 3.2,
    dataCriacao: '2026-10-29T08:10:00Z',
    dataDesejada: '29/10/2026 às 13:00',
    turno: 'manha',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T08:40:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1052_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:10',
        status: 'CRIADO'
      },
      {
        id: 'h_1052_2',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-29 09:15',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1053',
    codigoCurto: 'SL-1053',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Lucas Valença',
      telefone: '(81) 98711-8899',
      endereco: {
        logradouro: 'Rua da Aurora',
        numero: '525',
        complemento: 'Edf. São Cristóvão, Sala 12',
        bairro: 'Boa Vista',
        cidade: 'Recife',
        cep: '50050-000'
      }
    },
    volume: '1 pacote de ternos masculinos',
    pesoKg: 1.4,
    dataCriacao: '2026-10-29T08:30:00Z',
    dataDesejada: '29/10/2026 às 12:00',
    turno: 'manha',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T09:00:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1053_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 08:30',
        status: 'CRIADO'
      },
      {
        id: 'h_1053_2',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-29 09:30',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1054',
    codigoCurto: 'SL-1054',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Coordenação Pedagógica Visão',
      telefone: '(81) 3461-8899',
      endereco: {
        logradouro: 'Av. Bernardo Vieira de Melo',
        numero: '1420',
        bairro: 'Piedade',
        cidade: 'Jaboatão dos Guararapes',
        cep: '54400-010'
      }
    },
    volume: '3 resmas e kits escolares pesados',
    pesoKg: 4,
    dataCriacao: '2026-10-29T11:20:00Z',
    dataDesejada: '29/10/2026 às 16:00',
    observacoes: 'Recebimento no almoxarifado dos fundos.',
    turno: 'tarde',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1054_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 11:20',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1055',
    codigoCurto: 'SL-1055',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Cláudia Vasconcelos',
      telefone: '(81) 99233-1144',
      endereco: {
        logradouro: 'Av. Ministro Marcos Freire',
        numero: '1200',
        complemento: 'Apto 301',
        bairro: 'Casa Caiada',
        cidade: 'Olinda',
        cep: '53130-540'
      }
    },
    volume: '1 caixa de medicamentos pediátricos',
    pesoKg: 1.1,
    dataCriacao: '2026-10-29T11:40:00Z',
    dataDesejada: '29/10/2026 às 15:30',
    turno: 'tarde',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1055_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 11:40',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1056',
    codigoCurto: 'SL-1056',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Instituto Histórico e Cultural',
      telefone: '(81) 3224-1234',
      endereco: {
        logradouro: 'Rua da Moeda',
        numero: '150',
        bairro: 'Santo Antônio',
        cidade: 'Recife',
        cep: '50030-040'
      }
    },
    volume: '2 caixas de uniformes institucionais',
    pesoKg: 1.8,
    dataCriacao: '2026-10-29T12:00:00Z',
    dataDesejada: '29/10/2026 às 16:30',
    turno: 'tarde',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1056_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 12:00',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1057',
    codigoCurto: 'SL-1057',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Juliana Pires',
      telefone: '(81) 98844-5566',
      endereco: {
        logradouro: 'Av. Marechal Mascarenhas de Morais',
        numero: '3100',
        bairro: 'Imbiribeira',
        cidade: 'Recife',
        cep: '51170-000'
      }
    },
    volume: '2 pacotes de vestuário casual',
    pesoKg: 2.5,
    dataCriacao: '2026-10-29T11:15:00Z',
    dataDesejada: '29/10/2026 às 15:00',
    turno: 'tarde',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T11:45:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1057_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 11:15',
        status: 'CRIADO'
      },
      {
        id: 'h_1057_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 11:45',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1058',
    codigoCurto: 'SL-1058',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Renata Gusmão',
      telefone: '(81) 99122-8877',
      endereco: {
        logradouro: 'Av. Getúlio Vargas',
        numero: '850',
        bairro: 'Bairro Novo',
        cidade: 'Olinda',
        cep: '53030-010'
      }
    },
    volume: '1 buquê de girassóis e rosas',
    pesoKg: 1.3,
    perecivel: true,
    dataCriacao: '2026-10-29T11:30:00Z',
    dataDesejada: '29/10/2026 às 15:00',
    turno: 'tarde',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T12:00:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1058_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 11:30',
        status: 'CRIADO'
      },
      {
        id: 'h_1058_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 12:00',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1059',
    codigoCurto: 'SL-1059',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Eduardo Correia',
      telefone: '(81) 99877-2211',
      endereco: {
        logradouro: 'Rua Ribeiro de Brito',
        numero: '450',
        complemento: 'Apto 802',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51021-310'
      }
    },
    volume: '1 caixa de suplementos vitamínicos',
    pesoKg: 0.7,
    dataCriacao: '2026-10-29T11:00:00Z',
    dataDesejada: '29/10/2026 às 14:30',
    turno: 'tarde',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T11:30:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1059_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 11:00',
        status: 'CRIADO'
      },
      {
        id: 'h_1059_2',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-29 12:15',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1060',
    codigoCurto: 'SL-1060',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Colégio Santa Cecília',
      telefone: '(81) 3222-7700',
      endereco: {
        logradouro: 'Rua do Futuro',
        numero: '220',
        bairro: 'Graças',
        cidade: 'Recife',
        cep: '52050-010'
      }
    },
    volume: '2 pacotes de livros e cadernos',
    pesoKg: 2,
    dataCriacao: '2026-10-29T11:10:00Z',
    dataDesejada: '29/10/2026 às 14:45',
    turno: 'tarde',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T11:35:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1060_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 11:10',
        status: 'CRIADO'
      },
      {
        id: 'h_1060_2',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-29 12:20',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1061',
    codigoCurto: 'SL-1061',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Igor Magalhães',
      telefone: '(81) 98722-1133',
      endereco: {
        logradouro: 'Rua São Salvador',
        numero: '310',
        bairro: 'Piedade',
        cidade: 'Jaboatão dos Guararapes',
        cep: '54410-020'
      }
    },
    volume: '2 caixas de vasos decorativos',
    pesoKg: 3.5,
    dataCriacao: '2026-10-29T10:45:00Z',
    dataDesejada: '29/10/2026 às 16:00',
    turno: 'tarde',
    status: 'NO_GALPAO',
    tipoTransporte: 'CROSS_DOCKING',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      parceiraPerna2Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T11:20:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1061_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 10:45',
        status: 'CRIADO'
      },
      {
        id: 'h_1061_2',
        evento: 'Recebido no Galpão Central',
        dataHora: '2026-10-29 13:00',
        status: 'NO_GALPAO'
      }
    ]
  },
  {
    id: 'ped_1062',
    codigoCurto: 'SL-1062',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Priscila Cavalcanti',
      telefone: '(81) 99344-7788',
      endereco: {
        logradouro: 'Av. Bernardo Vieira de Melo',
        numero: '4200',
        complemento: 'Apto 1102',
        bairro: 'Candeias',
        cidade: 'Jaboatão dos Guararapes',
        cep: '54430-000'
      }
    },
    volume: '1 vestido longo de festa e sapatos',
    pesoKg: 1.7,
    dataCriacao: '2026-10-29T15:10:00Z',
    dataDesejada: '29/10/2026 às 18:30',
    turno: 'fim_tarde',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1062_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 15:10',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1063',
    codigoCurto: 'SL-1063',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Prof. Marcos Vinicius',
      telefone: '(81) 98855-4422',
      endereco: {
        logradouro: 'Rua do Espinheiro',
        numero: '512',
        bairro: 'Espinheiro',
        cidade: 'Recife',
        cep: '52020-020'
      }
    },
    volume: '1 caixa de artigos para escritório',
    pesoKg: 2.8,
    dataCriacao: '2026-10-29T15:15:00Z',
    dataDesejada: '29/10/2026 às 18:00',
    turno: 'fim_tarde',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1063_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 15:15',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1064',
    codigoCurto: 'SL-1064',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Mariana Mendonça',
      telefone: '(81) 99133-2255',
      endereco: {
        logradouro: 'Rua Nova',
        numero: '180',
        complemento: 'Loja 4',
        bairro: 'Santo Antônio',
        cidade: 'Recife',
        cep: '50010-160'
      }
    },
    volume: '1 coroa de flores com faixa',
    pesoKg: 1,
    perecivel: true,
    dataCriacao: '2026-10-29T15:20:00Z',
    dataDesejada: '29/10/2026 às 17:45',
    turno: 'fim_tarde',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1064_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 15:20',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1065',
    codigoCurto: 'SL-1065',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Danielle Arcoverde',
      telefone: '(81) 99788-3344',
      endereco: {
        logradouro: 'Rua Padre Carapuceiro',
        numero: '777',
        complemento: 'Torre Trade Center, Sala 1401',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51020-280'
      }
    },
    volume: '1 pacote de cosméticos importados',
    pesoKg: 0.9,
    dataCriacao: '2026-10-29T15:00:00Z',
    dataDesejada: '29/10/2026 às 18:00',
    turno: 'fim_tarde',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T15:30:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1065_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 15:00',
        status: 'CRIADO'
      },
      {
        id: 'h_1065_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 15:30',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1066',
    codigoCurto: 'SL-1066',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Arthur Lins',
      telefone: '(81) 98755-6611',
      endereco: {
        logradouro: 'Rua do Hospício',
        numero: '302',
        bairro: 'Boa Vista',
        cidade: 'Recife',
        cep: '50060-080'
      }
    },
    volume: '2 camisas polo e acessórios',
    pesoKg: 1.6,
    dataCriacao: '2026-10-29T15:05:00Z',
    dataDesejada: '29/10/2026 às 18:15',
    turno: 'fim_tarde',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T15:35:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1066_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 15:05',
        status: 'CRIADO'
      },
      {
        id: 'h_1066_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 15:35',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1067',
    codigoCurto: 'SL-1067',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Carolina Peixoto',
      telefone: '(81) 99622-4411',
      endereco: {
        logradouro: 'Av. Ayrton Senna',
        numero: '150',
        bairro: 'Piedade',
        cidade: 'Jaboatão dos Guararapes',
        cep: '54410-240'
      }
    },
    volume: '1 arranjo floral em caixa kraft',
    pesoKg: 1.2,
    perecivel: true,
    dataCriacao: '2026-10-29T14:40:00Z',
    dataDesejada: '29/10/2026 às 17:30',
    turno: 'fim_tarde',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T15:10:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1067_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 14:40',
        status: 'CRIADO'
      },
      {
        id: 'h_1067_2',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-29 15:45',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1068',
    codigoCurto: 'SL-1068',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Fernando Silveira',
      telefone: '(81) 98411-9922',
      endereco: {
        logradouro: 'Rua São Bento',
        numero: '210',
        bairro: 'Casa Caiada',
        cidade: 'Olinda',
        cep: '53130-010'
      }
    },
    volume: '1 envelope de fórmulas manipuladas',
    pesoKg: 0.6,
    dataCriacao: '2026-10-29T14:50:00Z',
    dataDesejada: '29/10/2026 às 17:45',
    turno: 'fim_tarde',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T15:15:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1068_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 14:50',
        status: 'CRIADO'
      },
      {
        id: 'h_1068_2',
        evento: 'Em Rota de Entrega',
        dataHora: '2026-10-29 15:50',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1069',
    codigoCurto: 'SL-1069',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Escola Modelo de Olinda',
      telefone: '(81) 3429-1100',
      endereco: {
        logradouro: 'Av. Sigismundo Gonçalves',
        numero: '450',
        bairro: 'Bairro Novo',
        cidade: 'Olinda',
        cep: '53010-240'
      }
    },
    volume: '2 caixas de materiais de escritório',
    pesoKg: 2.4,
    dataCriacao: '2026-10-29T14:30:00Z',
    dataDesejada: '29/10/2026 às 18:00',
    turno: 'fim_tarde',
    status: 'LIBERADO_PERNA_2',
    tipoTransporte: 'CROSS_DOCKING',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      parceiraPerna2Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T15:00:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1069_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 14:30',
        status: 'CRIADO'
      },
      {
        id: 'h_1069_2',
        evento: 'Liberado no Galpão para Entrega Final',
        dataHora: '2026-10-29 16:10',
        status: 'LIBERADO_PERNA_2'
      }
    ]
  },
  {
    id: 'ped_1070',
    codigoCurto: 'SL-1070',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Tânia Maranhão',
      telefone: '(81) 98833-1122',
      endereco: {
        logradouro: 'Av. Boa Viagem',
        numero: '2900',
        complemento: 'Apto 1202',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51020-002'
      }
    },
    volume: '1 caixa média de vestidos',
    pesoKg: 1.5,
    dataCriacao: '2026-10-29T14:15:00Z',
    dataDesejada: '29/10/2026 às 17:00',
    turno: 'fim_tarde',
    status: 'OCORRENCIA',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T14:45:00Z'
    },
    ocorrencia: {
      tipo: 'DESTINATARIO_AUSENTE',
      descricao: 'Interfone sem resposta. Portaria não autorizada a receber volumes de vestuário.',
      registradaEm: '2026-10-29T16:20:00Z',
      imputavelParceira: false,
      resolvida: false
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1070_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 14:15',
        status: 'CRIADO'
      },
      {
        id: 'h_1070_2',
        evento: 'Ocorrência Registrada',
        dataHora: '2026-10-29 16:20',
        detalhes: 'Destinatário ausente',
        status: 'OCORRENCIA'
      }
    ]
  },
  {
    id: 'ped_1071',
    codigoCurto: 'SL-1071',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Roberto Leão Contabilidade',
      telefone: '(81) 3326-9900',
      endereco: {
        logradouro: 'Av. Antônio de Goes',
        numero: '300',
        complemento: 'Sala 804',
        bairro: 'Pina',
        cidade: 'Recife',
        cep: '51110-000'
      }
    },
    volume: '2 pacotes de formulários contínuos',
    pesoKg: 3,
    dataCriacao: '2026-10-29T17:05:00Z',
    dataDesejada: '30/10/2026 às 09:30',
    turno: 'fechamento',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1071_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 17:05',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1072',
    codigoCurto: 'SL-1072',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Dra. Vanessa Meireles',
      telefone: '(81) 99144-8833',
      endereco: {
        logradouro: 'Rua das Graças',
        numero: '120',
        complemento: 'Consultório 3',
        bairro: 'Graças',
        cidade: 'Recife',
        cep: '52011-000'
      }
    },
    volume: '1 sacola de roupas profissionais',
    pesoKg: 1.4,
    dataCriacao: '2026-10-29T17:15:00Z',
    dataDesejada: '30/10/2026 às 10:00',
    turno: 'fechamento',
    status: 'CRIADO',
    tipoTransporte: 'DIRETO',
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1072_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 17:15',
        status: 'CRIADO'
      }
    ]
  },
  {
    id: 'ped_1073',
    codigoCurto: 'SL-1073',
    lojistaId: 'loj_farmacia',
    destinatario: {
      nome: 'Geraldo Magela',
      telefone: '(81) 98822-6677',
      endereco: {
        logradouro: 'Rua Bernardo Vieira de Melo',
        numero: '3890',
        bairro: 'Candeias',
        cidade: 'Jaboatão dos Guararapes',
        cep: '54420-010'
      }
    },
    volume: '1 caixa pequena de remédios contínuos',
    pesoKg: 0.8,
    dataCriacao: '2026-10-29T16:50:00Z',
    dataDesejada: '29/10/2026 às 19:30',
    turno: 'fechamento',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T17:20:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1073_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 16:50',
        status: 'CRIADO'
      },
      {
        id: 'h_1073_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 17:20',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1074',
    codigoCurto: 'SL-1074',
    lojistaId: 'loj_floricultura',
    destinatario: {
      nome: 'Juliana Falcão',
      telefone: '(81) 99611-3388',
      endereco: {
        logradouro: 'Rua do Sol',
        numero: '280',
        bairro: 'Bairro Novo',
        cidade: 'Olinda',
        cep: '53030-030'
      }
    },
    volume: '1 arranjo floral de condolências',
    pesoKg: 1.1,
    perecivel: true,
    dataCriacao: '2026-10-29T17:00:00Z',
    dataDesejada: '29/10/2026 às 19:15',
    turno: 'fechamento',
    status: 'ATRIBUIDO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T17:25:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1074_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 17:00',
        status: 'CRIADO'
      },
      {
        id: 'h_1074_2',
        evento: 'Despachado para Parceira',
        dataHora: '2026-10-29 17:25',
        status: 'ATRIBUIDO'
      }
    ]
  },
  {
    id: 'ped_1075',
    codigoCurto: 'SL-1075',
    lojistaId: 'loj_modachic',
    destinatario: {
      nome: 'Flávia Mendonça',
      telefone: '(81) 99255-7711',
      endereco: {
        logradouro: 'Rua Barão de Souza Leão',
        numero: '1050',
        complemento: 'Apto 1502',
        bairro: 'Boa Viagem',
        cidade: 'Recife',
        cep: '51030-300'
      }
    },
    volume: '1 pacote de moda feminina festa',
    pesoKg: 2.2,
    dataCriacao: '2026-10-29T16:30:00Z',
    dataDesejada: '29/10/2026 às 19:00',
    turno: 'fechamento',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'fretes_seu_ze',
      dataAtribuicao: '2026-10-29T17:00:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1075_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 16:30',
        status: 'CRIADO'
      },
      {
        id: 'h_1075_2',
        evento: 'Em Rota de Entrega Noturna',
        dataHora: '2026-10-29 17:30',
        status: 'EM_TRANSITO'
      }
    ]
  },
  {
    id: 'ped_1076',
    codigoCurto: 'SL-1076',
    lojistaId: 'loj_papelaria',
    destinatario: {
      nome: 'Editora Universitária Pernambuco',
      telefone: '(81) 3444-2200',
      endereco: {
        logradouro: 'Rua Teles Júnior',
        numero: '315',
        bairro: 'Espinheiro',
        cidade: 'Recife',
        cep: '52020-030'
      }
    },
    volume: '2 pacotes de impressos acadêmicos',
    pesoKg: 1.9,
    dataCriacao: '2026-10-29T16:40:00Z',
    dataDesejada: '29/10/2026 às 19:15',
    turno: 'fechamento',
    status: 'EM_TRANSITO',
    tipoTransporte: 'DIRETO',
    atribuicao: {
      parceiraPerna1Id: 'refactor_express',
      dataAtribuicao: '2026-10-29T17:05:00Z'
    },
    elegibilidadeFinanceira: 'PENDENTE',
    historico: [
      {
        id: 'h_1076_1',
        evento: 'Pedido Registrado',
        dataHora: '2026-10-29 16:40',
        status: 'CRIADO'
      },
      {
        id: 'h_1076_2',
        evento: 'Em Rota de Entrega Noturna',
        dataHora: '2026-10-29 17:35',
        status: 'EM_TRANSITO'
      }
    ]
  }
];
