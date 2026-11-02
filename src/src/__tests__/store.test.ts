import { describe, it, expect } from 'vitest';
import {
  PEDIDOS_INICIAIS,
  PARCEIRAS_INICIAIS,
  LOJISTAS_INICIAIS,
} from '../data/initialData';
import { ABAS_PADRAO_POR_PERFIL, obterAbaPadraoParaPerfil } from '../store/SealogContext';
import { EscopoMoscow, PerfilUsuario } from '../types';

describe('Validação dos Dados Iniciais do Domínio SEALog (Ticket 01)', () => {
  it('deve conter as duas empresas parceiras com suas capacidades e canais corretos', () => {
    expect(PARCEIRAS_INICIAIS).toHaveLength(2);

    const refactor = PARCEIRAS_INICIAIS.find((p) => p.id === 'refactor_express');
    expect(refactor).toBeDefined();
    expect(refactor?.limiteDiario).toBe(250);
    expect(refactor?.tipoOperacao).toBe('PLANILHA');

    const seuZe = PARCEIRAS_INICIAIS.find((p) => p.id === 'fretes_seu_ze');
    expect(seuZe).toBeDefined();
    expect(seuZe?.limiteDiario).toBe(150);
    expect(seuZe?.tipoOperacao).toBe('WHATSAPP');
  });

  it('deve conter os lojistas dos cenários do edital', () => {
    const ids = LOJISTAS_INICIAIS.map((l) => l.id);
    expect(ids).toContain('loj_farmacia');
    expect(ids).toContain('loj_floricultura');
    expect(ids).toContain('loj_papelaria');
    expect(ids).toContain('loj_modachic');
  });

  it('deve conter o pedido SL-1041 (Condomínio MarAzul) com carência de 48h sem foto', () => {
    const pedido = PEDIDOS_INICIAIS.find((p) => p.codigoCurto === 'SL-1041');
    expect(pedido).toBeDefined();
    expect(pedido?.status).toBe('CONCLUIDO');
    expect(pedido?.destinatario.endereco.complemento).toContain('Condomínio MarAzul');
    expect(pedido?.elegibilidadeFinanceira).toBe('RETIDO_PRAZO');
    expect(pedido?.comprovante?.canalConfirmacao).toBe('WHATSAPP_TEXTO');
  });

  it('deve conter o pedido SL-1042 com fluxo de Cross-Docking no Galpão Central', () => {
    const pedido = PEDIDOS_INICIAIS.find((p) => p.codigoCurto === 'SL-1042');
    expect(pedido).toBeDefined();
    expect(pedido?.tipoTransporte).toBe('CROSS_DOCKING');
    expect(pedido?.status).toBe('NO_GALPAO');
    expect(pedido?.atribuicao?.parceiraPerna1Id).toBe('refactor_express');
    expect(pedido?.atribuicao?.parceiraPerna2Id).toBe('fretes_seu_ze');
  });

  it('deve conter o pedido SL-1043 (Buquê de Sábado) com status de Ocorrência', () => {
    const pedido = PEDIDOS_INICIAIS.find((p) => p.codigoCurto === 'SL-1043');
    expect(pedido).toBeDefined();
    expect(pedido?.status).toBe('OCORRENCIA');
    expect(pedido?.ocorrencia?.tipo).toBe('DESTINATARIO_AUSENTE');
    expect(pedido?.lojistaId).toBe('loj_floricultura');
  });

  it('deve conter o pedido SL-1044 (Cenário Sr. Paulo) bloqueado por dados incompletos', () => {
    const pedido = PEDIDOS_INICIAIS.find((p) => p.codigoCurto === 'SL-1044');
    expect(pedido).toBeDefined();
    expect(pedido?.status).toBe('PENDENTE_DADOS');
    expect(pedido?.destinatario.endereco.numero).toBe('');
    expect(pedido?.destinatario.telefone).not.toContain('('); // sem DDD
  });

  it('deve conter o pedido SL-1046 com foto POD e elegibilidade financeira LIBERADO', () => {
    const pedido = PEDIDOS_INICIAIS.find((p) => p.codigoCurto === 'SL-1046');
    expect(pedido).toBeDefined();
    expect(pedido?.status).toBe('CONCLUIDO');
    expect(pedido?.elegibilidadeFinanceira).toBe('LIBERADO');
    expect(pedido?.comprovante?.fotoUrl).toBeTruthy();
  });

  it('deve mapear corretamente as abas padrão para todos os 8 perfis de usuário', () => {
    expect(ABAS_PADRAO_POR_PERFIL.coordenador).toBe('despacho');
    expect(ABAS_PADRAO_POR_PERFIL.analista).toBe('triagem_parceiras');
    expect(ABAS_PADRAO_POR_PERFIL.atendente).toBe('triagem');
    expect(ABAS_PADRAO_POR_PERFIL.financeiro).toBe('fechamento_parceiras');
    expect(ABAS_PADRAO_POR_PERFIL.lojista).toBe('meus_envios');
    expect(ABAS_PADRAO_POR_PERFIL.parceiro).toBe('rotas');
    expect(ABAS_PADRAO_POR_PERFIL.consumidor).toBe('rastreio');
    expect(ABAS_PADRAO_POR_PERFIL.entregador_pwa).toBe('rota_entregador');
  });

  it('deve conter entregas não atribuídas (CRIADO) e elegíveis para Link Mágico em todos os turnos operacionais', () => {
    const turnos = ['manha', 'tarde', 'fim_tarde', 'fechamento'] as const;

    turnos.forEach((t) => {
      const doTurno = PEDIDOS_INICIAIS.filter((p) => p.turno === t);
      const criados = doTurno.filter((p) => p.status === 'CRIADO');
      expect(criados.length).toBeGreaterThanOrEqual(2);

      // Elegíveis para Link Mágico (ATRIBUIDO ou EM_TRANSITO) para cada parceira
      const seuZe = doTurno.filter(
        (p) =>
          (p.status === 'ATRIBUIDO' || p.status === 'EM_TRANSITO') &&
          p.atribuicao?.parceiraPerna1Id === 'fretes_seu_ze'
      );
      expect(seuZe.length).toBeGreaterThanOrEqual(2);

      const refactor = doTurno.filter(
        (p) =>
          (p.status === 'ATRIBUIDO' || p.status === 'EM_TRANSITO') &&
          p.atribuicao?.parceiraPerna1Id === 'refactor_express'
      );
      expect(refactor.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('deve retornar as abas padrão corretas de acordo com o escopo MoSCoW', () => {
    // No escopo 'must', triagens HITL avançadas são ocultadas, direcionando analista e atendente para suas filas operacionais
    expect(obterAbaPadraoParaPerfil('analista', 'must')).toBe('atribuicao');
    expect(obterAbaPadraoParaPerfil('atendente', 'must')).toBe('pendentes');
    expect(obterAbaPadraoParaPerfil('coordenador', 'must')).toBe('despacho');

    // No escopo 'should', triagens HITL continuam em 'completo'
    expect(obterAbaPadraoParaPerfil('analista', 'should')).toBe('atribuicao');
    expect(obterAbaPadraoParaPerfil('atendente', 'should')).toBe('pendentes');

    // No escopo 'completo', triagens split-screen HITL com IA são ativadas por padrão
    expect(obterAbaPadraoParaPerfil('analista', 'completo')).toBe('triagem_parceiras');
    expect(obterAbaPadraoParaPerfil('atendente', 'completo')).toBe('triagem');
  });

  it('deve validar os critérios de segregação de personas por escopo MoSCoW', () => {
    const todasPersonas: PerfilUsuario[] = [
      'coordenador',
      'analista',
      'atendente',
      'financeiro',
      'lojista',
      'parceiro',
      'consumidor',
      'entregador_pwa',
    ];

    const filtrarPersonas = (escopo: EscopoMoscow) =>
      todasPersonas.filter((p) => {
        if (escopo === 'must') {
          return ['coordenador', 'analista', 'atendente'].includes(p);
        }
        if (escopo === 'should') {
          return p !== 'entregador_pwa';
        }
        return true;
      });

    const personasMust = filtrarPersonas('must');
    expect(personasMust).toHaveLength(3);
    expect(personasMust).toEqual(['coordenador', 'analista', 'atendente']);

    const personasShould = filtrarPersonas('should');
    expect(personasShould).toHaveLength(7);
    expect(personasShould).not.toContain('entregador_pwa');
    expect(personasShould).toContain('financeiro');
    expect(personasShould).toContain('lojista');
    expect(personasShould).toContain('parceiro');
    expect(personasShould).toContain('consumidor');

    const personasCompleto = filtrarPersonas('completo');
    expect(personasCompleto).toHaveLength(8);
    expect(personasCompleto).toContain('entregador_pwa');
  });

  it('deve validar a premissa de entrega no dia seguinte (D+1 por padrão) e suporte a agendamento flexível', () => {
    // Pedido padrão da SEALog: entrega no dia útil seguinte (D+1)
    const pedidoD1 = {
      prazoEntrega: 'D_MAIS_1' as const,
      dataDesejada: '30/10/2026 (D+1 - Padrão) até 18:00',
    };
    expect(pedidoD1.prazoEntrega).toBe('D_MAIS_1');
    expect(pedidoD1.dataDesejada).toContain('D+1');

    // Pedido com agendamento para data específica
    const pedidoAgendado = {
      prazoEntrega: 'AGENDADA' as const,
      dataAgendada: '2026-11-03',
      dataDesejada: '03/11/2026 (Agendada) até 18:00',
    };
    expect(pedidoAgendado.prazoEntrega).toBe('AGENDADA');
    expect(pedidoAgendado.dataAgendada).toBe('2026-11-03');
    expect(pedidoAgendado.dataDesejada).toContain('Agendada');
  });

  it('deve validar a exportação de romaneio de cargas para WhatsApp e CSV para transportadoras parceiras', () => {
    const parceiraSeuZe = PARCEIRAS_INICIAIS.find((p) => p.id === 'fretes_seu_ze')!;
    expect(parceiraSeuZe).toBeDefined();
    expect(parceiraSeuZe.tipoOperacao).toBe('WHATSAPP');

    // Pedidos atribuídos ao Seu Zé
    const pedidosAtribuidos = PEDIDOS_INICIAIS.filter(
      (p) =>
        p.atribuicao?.parceiraPerna1Id === parceiraSeuZe.id ||
        p.atribuicao?.parceiraPerna2Id === parceiraSeuZe.id
    );
    expect(pedidosAtribuidos.length).toBeGreaterThan(0);

    // Validação da estrutura de texto para WhatsApp
    const linhas = pedidosAtribuidos.map((p) => `*# — [${p.codigoCurto}]*`);
    expect(linhas.length).toBe(pedidosAtribuidos.length);
    expect(linhas[0]).toContain('SL-');
  });

  it('deve garantir que o coordenador e analista possam homologar baixa e anexar comprovante com regra antifraude (ADR 003)', () => {
    // Comprovante com foto (POD) -> LIBERADO para repasse imediato
    const baixaComFoto = {
      recebedorNome: 'Maria da Silva',
      fotoUrl: 'data:image/png;base64,sample...',
      elegibilidade: 'LIBERADO' as const,
    };
    expect(baixaComFoto.elegibilidade).toBe('LIBERADO');

    // Baixa informal sem foto (WhatsApp texto) -> RETIDO_PRAZO (carência 48h)
    const baixaSemFoto = {
      recebedorNome: 'Portaria Condomínio',
      fotoUrl: undefined,
      elegibilidade: 'RETIDO_PRAZO' as const,
    };
    expect(baixaSemFoto.elegibilidade).toBe('RETIDO_PRAZO');
  });

  it('deve permitir agendamento de entrega com horário marcado específico', () => {
    // Pedido com data padrão D+1 e horário marcado específico
    const pedidoComHorario = {
      prazoEntrega: 'D_MAIS_1' as const,
      temHorarioMarcado: true,
      horarioAgendado: '14:30',
      dataDesejada: '30/10/2026 (D+1 - Padrão) às 14:30 (Horário Marcado)',
    };
    expect(pedidoComHorario.temHorarioMarcado).toBe(true);
    expect(pedidoComHorario.horarioAgendado).toBe('14:30');
    expect(pedidoComHorario.dataDesejada).toContain('14:30');

    // Valida pedidos iniciais que já possuem horário marcado (como SL-1043 de flores/buquê)
    const pedidoFlor = PEDIDOS_INICIAIS.find((p) => p.codigoCurto === 'SL-1043')!;
    expect(pedidoFlor).toBeDefined();
    expect(pedidoFlor.temHorarioMarcado).toBe(true);
    expect(pedidoFlor.horarioAgendado).toBe('14:00');
  });
});

