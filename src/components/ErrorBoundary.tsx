import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Unknown error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Sisyphus Game:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('eternal_push_stats');
      localStorage.removeItem('sisyphus_checklist_state');
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121110] text-[#E8E4DF] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#1A1815] border border-[#3E3529] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F5EFE6]">
              Le Rocher a Trébuché
            </h2>
            <p className="text-xs sm:text-sm text-[#A89D8D] font-editorial leading-relaxed">
              Une anomalie inattendue a interrompu l'ascension. Vous pouvez recharger la page ou réinitialiser les données de jeu pour reprendre immédiatement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl font-cinzel font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recharger la page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="py-3 px-4 rounded-xl font-cinzel text-xs uppercase tracking-wider bg-[#262019] hover:bg-[#342C23] border border-[#483B2B] text-[#D4C8B8] transition-colors cursor-pointer"
              >
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
