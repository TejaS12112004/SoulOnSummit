import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  timestamp: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
    timestamp: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: `ERR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-3">Internal Server Error</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            An unexpected application error occurred. We've logged the issue and are looking into it. Please try refreshing the page.
          </p>
          
          {import.meta.env.DEV && (
            <div className="mb-8 p-4 rounded bg-muted/50 text-left text-xs font-mono text-muted-foreground w-full max-w-2xl overflow-auto max-h-64 border border-border">
              <p className="font-semibold text-foreground mb-2">Development Details:</p>
              <p><strong>Error ID:</strong> {this.state.errorId}</p>
              <p><strong>Timestamp:</strong> {this.state.timestamp}</p>
              <p className="mt-2"><strong>Message:</strong> {this.state.error?.message}</p>
              <pre className="mt-2 whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </div>
          )}
          
          <div className="flex gap-4">
            <Button onClick={this.handleReset} className="px-8">
              Refresh Page
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="px-8">
              Go Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
