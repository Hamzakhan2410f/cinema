import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-8 rounded-sm text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/20 text-[#E50914] mx-auto flex items-center justify-center rounded-sm border border-[#E50914]/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">Something Went Wrong</h2>
              <p className="text-xs text-zinc-400 font-medium">
                An unexpected interface error occurred. The system has prevented a blank screen and preserved your state.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-zinc-900 p-3 rounded-sm text-left overflow-x-auto text-[10px] font-mono text-zinc-400 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="bg-[#E50914] hover:bg-red-700 text-white font-black py-3 px-6 rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors shadow-lg shadow-[#E50914]/20"
            >
              <RefreshCw className="w-4 h-4" /> Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
