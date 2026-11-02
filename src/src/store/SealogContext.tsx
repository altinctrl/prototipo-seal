import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Pedido,
  Parceira,
  Lojista,
  PerfilUsuario,
  TurnoOperacional,
  TipoTransporte,
  AlertaMassa,
  MagicLinkRota,
  ComprovanteEntrega,
  ElegibilidadeFinanceira,
  StatusPedido,
  EscopoMoscow,
} from '../types';
import {
  PEDIDOS_INICIAIS,
  PARCEIRAS_INICIAIS,
  LOJISTAS_INICIAIS,
} from '../data/initialData';

const STORAGE_KEY = 'sealog_state_v6';

export interface Notificacao {
  id: string;
  tipo: 'success' | 'info' | 'warning' | 'error';
  mensagem: string;
}

export const ABAS_PADRAO_POR_PERFIL: Record<PerfilUsuario, string> = {
  coordenador: 'despacho',
  analista: 'triagem_parceiras',
  atendente: 'triagem',
  financeiro: 'fechamento_parceiras',
  lojista: 'meus_envios',
  parceiro: 'rotas',
  consumidor: 'rastreio',
  entregador_pwa: 'rota_entregador',
};

interface SealogContextType {
  pedidos: Pedido[];
  todosPedidos: Pedido[];
  parceiras: Parceira[];
  lojistas: Lojista[];
  perfilAtivo: PerfilUsuario;
  setPerfilAtivo: (perfil: PerfilUsuario) => void;
  turnoAtivo: TurnoOperacional;
  setTurnoAtivo: (turno: TurnoOperacional) => void;
  escopoMoscow: EscopoMoscow;
  setEscopoMoscow: (escopo: EscopoMoscow) => void;
  lojistaSelecionadoId: string;
  setLojistaSelecionadoId: (id: string) => void;
  parceiraSelecionadaId: string;
  setParceiraSelecionadaId: (id: string) => void;
  alertaContingencia: AlertaMassa | null;
  dispararAlertaMassa: (regiao: string, motivo: string, mensagem: string, pedidosAfetados?: string[]) => void;
  revogarAlertaMassa: () => void;
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  magicLinks: MagicLinkRota[];
  gerarMagicLink: (parceiraId: string, nomeEntregador: string, pedidosCodigos: string[]) => string;
  contestarEntrega: (pedidoId: string, motivo?: string) => void;
  notificacao: Notificacao | null;
  mostrarNotificacao: (tipo: 'success' | 'info' | 'warning' | 'error', mensagem: string) => void;
  fecharNotificacao: () => void;
  resetarDados: () => void;
  obterPedidoPorCodigo: (codigo: string) => Pedido | undefined;
  adicionarPedido: (dados: Omit<Pedido, 'id' | 'historico' | 'codigoCurto'> & { codigoCurto?: string }) => Pedido;
  atualizarPedido: (pedidoId: string, updates: Partial<Pedido>) => void;
  atribuirParceira: (pedidoId: string, parceiraId: string, tipoTransporte?: TipoTransporte) => void;
  atribuirParceirasEmLote: (pedidoIds: string[], parceiraId: string, tipoTransporte?: TipoTransporte) => void;
  reagendarEntrega: (pedidoId: string, novaDataHora: string, parceiraId?: string) => void;
  devolverAoRemetente: (pedidoId: string, motivo: string) => void;
  homologarBaixa: (pedidoId: string, comprovante: ComprovanteEntrega, elegibilidade: ElegibilidadeFinanceira) => void;
  registrarEntradaGalpao: (pedidoId: string) => void;
  liberarPerna2: (pedidoId: string, parceiraPerna2Id: string) => void;
  // Gestão de Transportadoras Parceiras (CRUD)
  adicionarParceira: (dados: Omit<Parceira, 'id' | 'entregasAtribuidasHoje'>) => Parceira;
  atualizarParceira: (id: string, updates: Partial<Parceira>) => void;
  removerParceira: (id: string) => void;
  // Gestão de Lojistas Conveniados (CRUD)
  adicionarLojista: (dados: Omit<Lojista, 'id' | 'totalPedidosMes'>) => Lojista;
  atualizarLojista: (id: string, updates: Partial<Lojista>) => void;
  removerLojista: (id: string) => void;
  // Ações Operacionais Diretas da Parceira
  alterarStatusParceiro: (pedidoId: string, novoStatus: StatusPedido, motivoOuRecebedor?: string) => void;
  // Link Mágico Ativo para Navegação E2E
  linkMagicoAtivoToken: string | null;
  setLinkMagicoAtivoToken: (token: string | null) => void;
}

const SealogContext = createContext<SealogContextType | undefined>(undefined);

interface StoragePayload {
  pedidos: Pedido[];
  parceiras: Parceira[];
  lojistas: Lojista[];
  perfilAtivo: PerfilUsuario;
  turnoAtivo: TurnoOperacional;
  escopoMoscow: EscopoMoscow;
  lojistaSelecionadoId: string;
  parceiraSelecionadaId: string;
  alertaContingencia: AlertaMassa | null;
  abaAtiva: string;
  magicLinks: MagicLinkRota[];
}

export const obterAbaPadraoParaPerfil = (perfil: PerfilUsuario, escopo: EscopoMoscow): string => {
  if (perfil === 'analista' && escopo !== 'completo') return 'atribuicao';
  if (perfil === 'atendente' && escopo !== 'completo') return 'pendentes';
  return ABAS_PADRAO_POR_PERFIL[perfil] || 'despacho';
};

export const SealogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const carregarEstadoInicial = (): StoragePayload => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed.pedidos) && Array.isArray(parsed.parceiras)) {
          const escopo: EscopoMoscow = parsed.escopoMoscow || (parsed.versaoCompleta ? 'completo' : 'must');
          const perfil: PerfilUsuario = parsed.perfilAtivo || 'coordenador';
          return {
            pedidos: parsed.pedidos,
            parceiras: parsed.parceiras,
            lojistas: parsed.lojistas || LOJISTAS_INICIAIS,
            perfilAtivo: perfil,
            turnoAtivo: parsed.turnoAtivo || 'todos',
            escopoMoscow: escopo,
            lojistaSelecionadoId: parsed.lojistaSelecionadoId || 'loj_farmacia',
            parceiraSelecionadaId: parsed.parceiraSelecionadaId || 'fretes_seu_ze',
            alertaContingencia: parsed.alertaContingencia || null,
            abaAtiva: parsed.abaAtiva || obterAbaPadraoParaPerfil(perfil, escopo),
            magicLinks: parsed.magicLinks || [],
          };
        }
      }
    } catch (err) {
      console.warn('Falha ao ler dados do localStorage, restaurando seed padrão:', err);
    }
    return {
      pedidos: PEDIDOS_INICIAIS,
      parceiras: PARCEIRAS_INICIAIS,
      lojistas: LOJISTAS_INICIAIS,
      perfilAtivo: 'coordenador',
      turnoAtivo: 'todos',
      escopoMoscow: 'must',
      lojistaSelecionadoId: 'loj_farmacia',
      parceiraSelecionadaId: 'fretes_seu_ze',
      alertaContingencia: null,
      abaAtiva: 'despacho',
      magicLinks: [],
    };
  };

  const [estado, setEstado] = useState<StoragePayload>(carregarEstadoInicial);
  const [notificacao, setNotificacao] = useState<Notificacao | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch (err) {
      console.error('Falha ao gravar estado no localStorage:', err);
    }
  }, [estado]);

  const mostrarNotificacao = (tipo: 'success' | 'info' | 'warning' | 'error', mensagem: string) => {
    const id = Date.now().toString();
    setNotificacao({ id, tipo, mensagem });
  };

  const fecharNotificacao = () => {
    setNotificacao(null);
  };

  const [linkMagicoAtivoToken, setLinkMagicoAtivoToken] = useState<string | null>(null);

  const resetarDados = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora erro de limpeza
    }
    const estadoPadrao: StoragePayload = {
      pedidos: PEDIDOS_INICIAIS,
      parceiras: PARCEIRAS_INICIAIS,
      lojistas: LOJISTAS_INICIAIS,
      perfilAtivo: 'coordenador',
      turnoAtivo: 'todos',
      escopoMoscow: 'must',
      lojistaSelecionadoId: 'loj_farmacia',
      parceiraSelecionadaId: 'fretes_seu_ze',
      alertaContingencia: null,
      abaAtiva: 'despacho',
      magicLinks: [],
    };
    setEstado(estadoPadrao);
    setLinkMagicoAtivoToken(null);
    mostrarNotificacao('info', 'Dados iniciais restaurados com sucesso! Estado de demonstração recarregado.');
  };

  const setPerfilAtivo = (perfilAtivo: PerfilUsuario) => {
    setEstado((ant) => ({
      ...ant,
      perfilAtivo,
      abaAtiva: obterAbaPadraoParaPerfil(perfilAtivo, ant.escopoMoscow),
    }));
  };

  const setTurnoAtivo = (turnoAtivo: TurnoOperacional) => {
    setEstado((ant) => ({ ...ant, turnoAtivo }));
  };

  const setEscopoMoscow = (novoEscopo: EscopoMoscow) => {
    setEstado((ant) => {
      let novoPerfil = ant.perfilAtivo;
      let novaAba = ant.abaAtiva;

      if (novoEscopo === 'must') {
        if (!['coordenador', 'analista', 'atendente'].includes(novoPerfil)) {
          novoPerfil = 'coordenador';
          novaAba = 'despacho';
        } else if (novoPerfil === 'coordenador' && ['contingencia', 'mesa_decisao'].includes(novaAba)) {
          novaAba = 'despacho';
        } else if (novoPerfil === 'analista' && novaAba === 'triagem_parceiras') {
          novaAba = 'atribuicao';
        } else if (novoPerfil === 'atendente' && novaAba === 'triagem') {
          novaAba = 'pendentes';
        }
      } else if (novoEscopo === 'should') {
        if (novoPerfil === 'entregador_pwa') {
          novoPerfil = 'parceiro';
          novaAba = 'rotas';
        } else if (novoPerfil === 'parceiro' && novaAba === 'link_magico') {
          novaAba = 'rotas';
        } else if (novoPerfil === 'analista' && novaAba === 'triagem_parceiras') {
          novaAba = 'atribuicao';
        } else if (novoPerfil === 'atendente' && novaAba === 'triagem') {
          novaAba = 'pendentes';
        }
      }

      return {
        ...ant,
        escopoMoscow: novoEscopo,
        perfilAtivo: novoPerfil,
        abaAtiva: novaAba,
      };
    });

    const mensagens: Record<EscopoMoscow, string> = {
      must: 'Escopo alterado para Must (MVP Essencial): operação interna prioritária ativa.',
      should: 'Escopo alterado para Should (Operação Expandida): portais de lojistas, parceiras, financeiro e contingência habilitados.',
      completo: 'Escopo alterado para Versão Completa (Inovações & Automações): PWA do motorista, Link Mágico e Triagem HITL habilitados.',
    };
    mostrarNotificacao('info', mensagens[novoEscopo]);
  };

  const setAbaAtiva = (abaAtiva: string) => {
    setEstado((ant) => ({ ...ant, abaAtiva }));
  };

  const setLojistaSelecionadoId = (lojistaSelecionadoId: string) => {
    setEstado((ant) => ({ ...ant, lojistaSelecionadoId }));
  };

  const setParceiraSelecionadaId = (parceiraSelecionadaId: string) => {
    setEstado((ant) => ({ ...ant, parceiraSelecionadaId }));
  };

  const dispararAlertaMassa = (
    regiao: string,
    motivo: string,
    mensagem: string,
    pedidosAfetados?: string[]
  ) => {
    const novoAlerta: AlertaMassa = {
      id: `alt_${Date.now()}`,
      regiao,
      motivo,
      mensagem,
      dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      pedidosAfetados,
      ativo: true,
    };
    setEstado((ant) => ({ ...ant, alertaContingencia: novoAlerta }));
    mostrarNotificacao('warning', `Alerta de contingência emitido para ${regiao}!`);
  };

  const revogarAlertaMassa = () => {
    setEstado((ant) => ({ ...ant, alertaContingencia: null }));
    mostrarNotificacao('info', 'Alerta de contingência desativado com sucesso.');
  };

  const contestarEntrega = (pedidoId: string, motivo: string = 'Contestação formal registrada pelo lojista.') => {
    atualizarPedido(pedidoId, {
      elegibilidadeFinanceira: 'BLOQUEADO_GLOSA',
      observacoes: motivo,
    });
    mostrarNotificacao('error', 'Entrega contestada! Repasse bloqueado para averiguação.');
  };

  const gerarMagicLink = (parceiraId: string, nomeEntregador: string, pedidosCodigos: string[]): string => {
    if (!pedidosCodigos || pedidosCodigos.length === 0) {
      mostrarNotificacao('warning', 'Selecione pelo menos um pedido para a rota do entregador.');
      return '';
    }
    const token = `tok_${Math.random().toString(36).substring(2, 9)}`;
    const novoLink: MagicLinkRota = {
      token,
      parceiraId,
      nomeEntregador: nomeEntregador.trim() || 'Entregador Parceiro',
      pedidosCodigos,
      criadoEm: new Date().toISOString(),
      expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    setEstado((ant) => ({
      ...ant,
      magicLinks: [...(ant.magicLinks || []), novoLink],
    }));
    setLinkMagicoAtivoToken(token);
    mostrarNotificacao('success', `Link mágico de 24h gerado com ${pedidosCodigos.length} entregas para ${nomeEntregador}!`);
    return token;
  };

  const obterPedidoPorCodigo = (codigo: string): Pedido | undefined => {
    const normalizado = codigo.trim().toUpperCase();
    return estado.pedidos.find(
      (p) => p.codigoCurto.toUpperCase() === normalizado || p.id.toUpperCase() === normalizado
    );
  };

  const gerarProximoCodigoCurto = (): string => {
    const codigos = estado.pedidos
      .map((p) => {
        const match = p.codigoCurto.match(/^SL-(\d+)$/i);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const max = codigos.length > 0 ? Math.max(...codigos) : 1085;
    return `SL-${max + 1}`;
  };

  const adicionarPedido = (
    dados: Omit<Pedido, 'id' | 'historico' | 'codigoCurto'> & { codigoCurto?: string }
  ): Pedido => {
    const novoId = `ped_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const codigoCurto = dados.codigoCurto?.trim() ? dados.codigoCurto : gerarProximoCodigoCurto();
    const turno = dados.turno || (estado.turnoAtivo !== 'todos' ? estado.turnoAtivo : 'manha');
    const novoPedido: Pedido = {
      ...dados,
      turno,
      id: novoId,
      codigoCurto,
      historico: [
        {
          id: `hist_${Date.now()}`,
          evento: 'Pedido Registrado',
          dataHora: new Date().toLocaleString('pt-BR'),
          detalhes: 'Criado no sistema SEALog',
          status: dados.status,
          autor: estado.perfilAtivo,
        },
      ],
    };

    setEstado((ant) => ({
      ...ant,
      pedidos: [novoPedido, ...ant.pedidos],
    }));

    mostrarNotificacao('success', `Pedido ${novoPedido.codigoCurto} cadastrado com sucesso!`);
    return novoPedido;
  };

  const atualizarPedido = (pedidoId: string, updates: Partial<Pedido>) => {
    setEstado((estadoAnterior) => {
      const pedidosAtualizados = estadoAnterior.pedidos.map((p) => {
        if (p.id !== pedidoId && p.codigoCurto !== pedidoId) return p;

        const historicoAtualizado = [...p.historico];
        if (updates.status && updates.status !== p.status) {
          historicoAtualizado.push({
            id: `hist_${Date.now()}`,
            evento: `Status alterado para ${updates.status}`,
            dataHora: new Date().toLocaleString('pt-BR'),
            detalhes: updates.observacoes || 'Atualização de status operacional',
            status: updates.status,
            autor: estadoAnterior.perfilAtivo,
          });
        }

        const atribuicaoAtualizada = updates.atribuicao
          ? { ...p.atribuicao, ...updates.atribuicao }
          : p.atribuicao;

        return {
          ...p,
          ...updates,
          atribuicao: atribuicaoAtualizada,
          historico: historicoAtualizado,
        };
      });

      return { ...estadoAnterior, pedidos: pedidosAtualizados };
    });
  };

  const atribuirParceira = (pedidoId: string, parceiraId: string, tipoTransporte: TipoTransporte = 'DIRETO') => {
    const parceira = estado.parceiras.find((p) => p.id === parceiraId);
    if (!parceira) return;

    atualizarPedido(pedidoId, {
      status: 'ATRIBUIDO',
      tipoTransporte,
      atribuicao: {
        parceiraPerna1Id: parceiraId,
        dataAtribuicao: new Date().toISOString(),
      },
    });

    setEstado((ant) => ({
      ...ant,
      parceiras: ant.parceiras.map((prc) =>
        prc.id === parceiraId
          ? { ...prc, entregasAtribuidasHoje: prc.entregasAtribuidasHoje + 1 }
          : prc
      ),
    }));

    mostrarNotificacao('info', `Pedido atribuído à transportadora ${parceira.nome}.`);
  };

  const atribuirParceirasEmLote = (
    pedidoIds: string[],
    parceiraId: string,
    tipoTransporte: TipoTransporte = 'DIRETO'
  ) => {
    const parceira = estado.parceiras.find((p) => p.id === parceiraId);
    if (!parceira || pedidoIds.length === 0) return;

    setEstado((estadoAnterior) => {
      const idsSet = new Set(pedidoIds);
      const dataHoraAgora = new Date().toLocaleString('pt-BR');
      const isoAgora = new Date().toISOString();

      const pedidosAtualizados = estadoAnterior.pedidos.map((p) => {
        if (!idsSet.has(p.id) && !idsSet.has(p.codigoCurto)) return p;

        return {
          ...p,
          status: 'ATRIBUIDO' as const,
          tipoTransporte,
          atribuicao: {
            ...p.atribuicao,
            parceiraPerna1Id: parceiraId,
            dataAtribuicao: isoAgora,
          },
          historico: [
            ...p.historico,
            {
              id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              evento: 'Despachado para Coleta e Entrega',
              dataHora: dataHoraAgora,
              detalhes: `Alocado para ${parceira.nome} (${tipoTransporte})`,
              status: 'ATRIBUIDO' as const,
              autor: estadoAnterior.perfilAtivo,
            },
          ],
        };
      });

      const parceirasAtualizadas = estadoAnterior.parceiras.map((prc) =>
        prc.id === parceiraId
          ? { ...prc, entregasAtribuidasHoje: prc.entregasAtribuidasHoje + pedidoIds.length }
          : prc
      );

      return {
        ...estadoAnterior,
        pedidos: pedidosAtualizados,
        parceiras: parceirasAtualizadas,
      };
    });

    mostrarNotificacao(
      'success',
      `${pedidoIds.length} pedido(s) despachado(s) com sucesso para ${parceira.nome}!`
    );
  };

  const reagendarEntrega = (pedidoId: string, novaDataHora: string, parceiraId?: string) => {
    setEstado((ant) => {
      const pedidosAtualizados = ant.pedidos.map((p) => {
        if (p.id !== pedidoId && p.codigoCurto !== pedidoId) return p;

        const atribuicao = parceiraId
          ? { ...p.atribuicao, parceiraPerna1Id: parceiraId }
          : p.atribuicao;

        return {
          ...p,
          status: 'ATRIBUIDO' as const,
          dataDesejada: novaDataHora,
          atribuicao,
          ocorrencia: p.ocorrencia ? { ...p.ocorrencia, resolvida: true } : null,
          historico: [
            ...p.historico,
            {
              id: `hist_${Date.now()}`,
              evento: 'Reentrega Reagendada (Mesa de Decisão)',
              dataHora: new Date().toLocaleString('pt-BR'),
              detalhes: `Reagendado para ${novaDataHora} com transportadora parceira.`,
              status: 'ATRIBUIDO' as const,
              autor: 'Coordenador de Operações',
            },
          ],
        };
      });

      return { ...ant, pedidos: pedidosAtualizados };
    });

    mostrarNotificacao('success', `Pedido reagendado para ${novaDataHora} com sucesso!`);
  };

  const devolverAoRemetente = (pedidoId: string, motivo: string) => {
    setEstado((ant) => {
      const pedidosAtualizados = ant.pedidos.map((p) => {
        if (p.id !== pedidoId && p.codigoCurto !== pedidoId) return p;

        return {
          ...p,
          status: 'DEVOLVIDO' as const,
          ocorrencia: p.ocorrencia ? { ...p.ocorrencia, resolvida: true } : null,
          observacoes: `Devolução ao remetente autorizada: ${motivo}`,
          historico: [
            ...p.historico,
            {
              id: `hist_${Date.now()}`,
              evento: 'Devolução ao Remetente Autorizada',
              dataHora: new Date().toLocaleString('pt-BR'),
              detalhes: `Devolução autorizada na Mesa de Decisão. Motivo: ${motivo}`,
              status: 'DEVOLVIDO' as const,
              autor: 'Coordenador de Operações',
            },
          ],
        };
      });

      return { ...ant, pedidos: pedidosAtualizados };
    });

    mostrarNotificacao('info', 'Devolução ao remetente registrada. Guia gerada.');
  };

  const homologarBaixa = (
    pedidoId: string,
    comprovante: ComprovanteEntrega,
    elegibilidade: ElegibilidadeFinanceira
  ) => {
    setEstado((ant) => {
      const pedidosAtualizados = ant.pedidos.map((p) => {
        if (p.id !== pedidoId && p.codigoCurto !== pedidoId) return p;

        return {
          ...p,
          status: 'CONCLUIDO' as const,
          comprovante,
          elegibilidadeFinanceira: elegibilidade,
          historico: [
            ...p.historico,
            {
              id: `hist_${Date.now()}`,
              evento: 'Entrega Homologada (Baixa Operacional)',
              dataHora: new Date().toLocaleString('pt-BR'),
              detalhes: `Baixa homologada com elegibilidade financeira ${elegibilidade}. Recebedor: ${comprovante.recebedorNome}`,
              status: 'CONCLUIDO' as const,
              autor: ant.perfilAtivo,
            },
          ],
        };
      });

      return { ...ant, pedidos: pedidosAtualizados };
    });

    mostrarNotificacao('success', `Baixa do pedido homologada com status ${elegibilidade}!`);
  };

  const registrarEntradaGalpao = (pedidoId: string) => {
    atualizarPedido(pedidoId, {
      status: 'NO_GALPAO',
    });
    mostrarNotificacao('info', `Entrada no Galpão Central registrada com sucesso.`);
  };

  const liberarPerna2 = (pedidoId: string, parceiraPerna2Id: string) => {
    const parceira = estado.parceiras.find((p) => p.id === parceiraPerna2Id);
    atualizarPedido(pedidoId, {
      status: 'LIBERADO_PERNA_2',
      atribuicao: {
        parceiraPerna2Id,
      },
    });
    mostrarNotificacao(
      'success',
      `Pedido liberado para entrega com ${parceira ? parceira.nome : 'transportadora'}.`
    );
  };

  // Gestão de Transportadoras Parceiras (CRUD)
  const adicionarParceira = (dados: Omit<Parceira, 'id' | 'entregasAtribuidasHoje'>): Parceira => {
    const nova: Parceira = {
      ...dados,
      id: `parc_${Date.now()}`,
      entregasAtribuidasHoje: 0,
    };
    setEstado((ant) => ({
      ...ant,
      parceiras: [...ant.parceiras, nova],
    }));
    mostrarNotificacao('success', `Transportadora parceira ${nova.nome} cadastrada com sucesso!`);
    return nova;
  };

  const atualizarParceira = (id: string, updates: Partial<Parceira>) => {
    setEstado((ant) => ({
      ...ant,
      parceiras: ant.parceiras.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
    mostrarNotificacao('success', 'Cadastro da parceira atualizado com sucesso.');
  };

  const removerParceira = (id: string) => {
    setEstado((ant) => {
      const restantes = ant.parceiras.filter((p) => p.id !== id);
      return {
        ...ant,
        parceiras: restantes,
        parceiraSelecionadaId: ant.parceiraSelecionadaId === id ? (restantes[0]?.id || '') : ant.parceiraSelecionadaId,
      };
    });
    mostrarNotificacao('info', 'Transportadora parceira removida do sistema.');
  };

  // Gestão de Lojistas Conveniados (CRUD)
  const adicionarLojista = (dados: Omit<Lojista, 'id' | 'totalPedidosMes'>): Lojista => {
    const novo: Lojista = {
      ...dados,
      id: `loj_${Date.now()}`,
      totalPedidosMes: 0,
    };
    setEstado((ant) => ({
      ...ant,
      lojistas: [...ant.lojistas, novo],
    }));
    mostrarNotificacao('success', `Lojista ${novo.nome} conveniado com sucesso!`);
    return novo;
  };

  const atualizarLojista = (id: string, updates: Partial<Lojista>) => {
    setEstado((ant) => ({
      ...ant,
      lojistas: ant.lojistas.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
    mostrarNotificacao('success', 'Cadastro do lojista atualizado com sucesso.');
  };

  const removerLojista = (id: string) => {
    setEstado((ant) => {
      const restantes = ant.lojistas.filter((l) => l.id !== id);
      return {
        ...ant,
        lojistas: restantes,
        lojistaSelecionadoId: ant.lojistaSelecionadoId === id ? (restantes[0]?.id || '') : ant.lojistaSelecionadoId,
      };
    });
    mostrarNotificacao('info', 'Lojista descredenciado do sistema.');
  };

  // Ações Operacionais Diretas da Parceira
  const alterarStatusParceiro = (
    pedidoId: string,
    novoStatus: StatusPedido,
    motivoOuRecebedor?: string
  ) => {
    setEstado((ant) => {
      const dataHoraAgora = new Date().toLocaleString('pt-BR');
      const pedidosAtualizados = ant.pedidos.map((p) => {
        if (p.id !== pedidoId && p.codigoCurto !== pedidoId) return p;

        let comprovante = p.comprovante;
        let elegibilidadeFinanceira = p.elegibilidadeFinanceira;
        let ocorrencia = p.ocorrencia;

        if (novoStatus === 'CONCLUIDO') {
          comprovante = {
            recebedorNome: motivoOuRecebedor || 'Recebedor no Destino',
            entregueEm: new Date().toISOString(),
            canalConfirmacao: 'MANUAL',
            observacao: 'Baixa direta efetuada pela transportadora parceira.',
          };
          elegibilidadeFinanceira = 'RETIDO_PRAZO'; // Baixa manual/sem foto POD inicia carência de 48h
          ocorrencia = null;
        } else if (novoStatus === 'OCORRENCIA') {
          ocorrencia = {
            tipo: 'OUTROS',
            descricao: motivoOuRecebedor || 'Insucesso operacional reportado pela transportadora.',
            registradaEm: new Date().toISOString(),
            imputavelParceira: false,
            resolvida: false,
          };
        } else if (novoStatus === 'EM_TRANSITO') {
          ocorrencia = null;
        }

        return {
          ...p,
          status: novoStatus,
          comprovante,
          elegibilidadeFinanceira,
          ocorrencia,
          historico: [
            ...p.historico,
            {
              id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              evento: `Status alterado para ${novoStatus} pela Transportadora`,
              dataHora: dataHoraAgora,
              detalhes: motivoOuRecebedor || `Ação operacional da parceira responsável`,
              status: novoStatus,
              autor: 'Parceira de Transporte',
            },
          ],
        };
      });

      return { ...ant, pedidos: pedidosAtualizados };
    });

    mostrarNotificacao('success', `Status da entrega atualizado para ${novoStatus}!`);
  };

  // Filtragem reativa de pedidos por turno operacional ativo (simulação de horário)
  const pedidosFiltrados = useMemo(() => {
    if (!estado.turnoAtivo || estado.turnoAtivo === 'todos') {
      return estado.pedidos;
    }
    return estado.pedidos.filter(
      (p) => p.turno === estado.turnoAtivo || (!p.turno && estado.turnoAtivo === 'manha')
    );
  }, [estado.pedidos, estado.turnoAtivo]);

  return (
    <SealogContext.Provider
      value={{
        pedidos: pedidosFiltrados,
        todosPedidos: estado.pedidos,
        parceiras: estado.parceiras,
        lojistas: estado.lojistas,
        perfilAtivo: estado.perfilAtivo,
        setPerfilAtivo,
        turnoAtivo: estado.turnoAtivo || 'todos',
        setTurnoAtivo,
        escopoMoscow: estado.escopoMoscow || 'must',
        setEscopoMoscow,
        lojistaSelecionadoId: estado.lojistaSelecionadoId,
        setLojistaSelecionadoId,
        parceiraSelecionadaId: estado.parceiraSelecionadaId,
        setParceiraSelecionadaId,
        alertaContingencia: estado.alertaContingencia,
        dispararAlertaMassa,
        revogarAlertaMassa,
        abaAtiva: estado.abaAtiva,
        setAbaAtiva,
        magicLinks: estado.magicLinks,
        gerarMagicLink,
        linkMagicoAtivoToken,
        setLinkMagicoAtivoToken,
        contestarEntrega,
        notificacao,
        mostrarNotificacao,
        fecharNotificacao,
        resetarDados,
        obterPedidoPorCodigo,
        adicionarPedido,
        atualizarPedido,
        atribuirParceira,
        atribuirParceirasEmLote,
        reagendarEntrega,
        devolverAoRemetente,
        homologarBaixa,
        registrarEntradaGalpao,
        liberarPerna2,
        adicionarParceira,
        atualizarParceira,
        removerParceira,
        adicionarLojista,
        atualizarLojista,
        removerLojista,
        alterarStatusParceiro,
      }}
    >
      {children}
    </SealogContext.Provider>
  );
};

export const useSealogStore = (): SealogContextType => {
  const context = useContext(SealogContext);
  if (!context) {
    throw new Error('useSealogStore deve ser utilizado dentro de um SealogProvider');
  }
  return context;
};
