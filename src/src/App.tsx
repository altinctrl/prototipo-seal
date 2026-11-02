import React from 'react';
import { useSealogStore } from './store/SealogContext';
import { DemonstracaoToolbar } from './components/layout/DemonstracaoToolbar';
import { Sidebar } from './components/layout/Sidebar';
import { CoordenadorView } from './components/views/CoordenadorView';
import { AnalistaView } from './components/views/AnalistaView';
import { AtendenteView } from './components/views/AtendenteView';
import { LojistaView } from './components/views/LojistaView';
import { ConsumidorView } from './components/views/ConsumidorView';
import { FinanceiroView } from './components/views/FinanceiroView';
import { ParceiroView } from './components/views/ParceiroView';
import { EntregadorPwaView } from './components/views/EntregadorPwaView';
import { Toast } from './components/common/Toast';

export const App: React.FC = () => {
  const { perfilAtivo } = useSealogStore();

  const ehPerfilExterno = perfilAtivo === 'consumidor' || perfilAtivo === 'entregador_pwa';

  const renderizarConteudo = () => {
    switch (perfilAtivo) {
      case 'coordenador':
        return <CoordenadorView />;
      case 'analista':
        return <AnalistaView />;
      case 'atendente':
        return <AtendenteView />;
      case 'financeiro':
        return <FinanceiroView />;
      case 'lojista':
        return <LojistaView />;
      case 'parceiro':
        return <ParceiroView />;
      case 'consumidor':
        return <ConsumidorView />;
      case 'entregador_pwa':
        return <EntregadorPwaView />;
      default:
        return <CoordenadorView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Barra de Testes / Alternador de Personas (Para a Banca Avaliadora) */}
      <DemonstracaoToolbar />

      {/* Estrutura Principal da Aplicação */}
      {ehPerfilExterno ? (
        // Visão Externa (Consumidor Público ou PWA Entregador) sem barra corporativa
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
          {renderizarConteudo()}
        </main>
      ) : (
        // Visão Corporativa Interna com Barra Lateral (Sidebar)
        <div className="flex-1 flex flex-col lg:flex-row w-full">
          <Sidebar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
            {renderizarConteudo()}
          </main>
        </div>
      )}

      {/* Notificações Flutuantes (Toast) */}
      <Toast />
    </div>
  );
};
