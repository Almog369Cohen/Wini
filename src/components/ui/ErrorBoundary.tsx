import { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Wini ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-coral" />
          </div>
          <h2 className="text-lg font-bold text-text mb-2">אופס, משהו השתבש</h2>
          <p className="text-sm text-text-light mb-1 max-w-xs">
            זה לא אתה, זה אנחנו. ננסה שוב?
          </p>
          <p className="text-[10px] text-text-light/50 mb-5 font-mono max-w-xs truncate">
            {this.state.error?.message}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-sage text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg"
          >
            <RefreshCw size={16} />
            <span>נסה שוב</span>
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
