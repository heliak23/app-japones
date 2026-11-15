import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro não tratado na aplicação:', error, errorInfo);
  }

  private handleReload = () => {
    // Limpa caches do Service Worker e recarrega
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center p-4 text-slate-800 dark:text-slate-100">
          <div className="max-w-md w-full bg-white dark:bg-[#111927] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Algo inesperado aconteceu
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              O aplicativo encontrou uma inconsistência temporária ao carregar os dados. Tente recarregar a página para atualizar o cache.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-3 rounded-xl bg-slate-100 dark:bg-[#0c121e] text-[11px] text-slate-600 dark:text-slate-400 font-mono text-left overflow-x-auto border border-slate-200/60 dark:border-slate-800">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recarregar Aplicativo</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
