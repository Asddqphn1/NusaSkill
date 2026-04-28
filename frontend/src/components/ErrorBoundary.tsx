import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center p-6"
          style={{
            background: 'var(--bg-primary)',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: 'rgba(251, 113, 133, 0.1)',
              border: '1px solid rgba(251, 113, 133, 0.2)',
            }}
          >
            <AlertCircle size={28} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Oops, terjadi kesalahan.
          </h1>
          <p
            className="mb-6 text-center max-w-md"
            style={{ color: 'var(--text-secondary)' }}
          >
            Aplikasi mengalami kendala teknis. Kami sedang memperbaikinya.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3 group"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
