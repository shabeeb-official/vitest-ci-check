import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { IS_DEV } from "@/config";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <AlertTriangle className="mb-6 h-16 w-16 text-muted-foreground/50" />

          <h1 className="font-sans text-8xl font-bold tracking-tight text-foreground/10 sm:text-9xl">
            500
          </h1>

          <h2 className="mt-2 font-sans text-2xl font-semibold text-foreground sm:text-3xl">
            Internal Server Error
          </h2>

          <p className="mt-3 max-w-md text-base text-muted-foreground">
            Something went wrong while loading this page. Please try again or
            contact support if the problem persists.
          </p>

          <div className="mt-8 flex gap-3">
            <Button onClick={this.handleReset} size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>

          {IS_DEV && this.state.error && (
            <details className="mt-10 w-[80vw]">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Error Details
              </summary>
              <pre className="mt-3 overflow-auto rounded-md border bg-muted p-4 text-left text-xs text-muted-foreground">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
