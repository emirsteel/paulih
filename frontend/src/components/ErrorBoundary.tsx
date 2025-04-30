import React from 'react';

// Define the props for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode; // Allow children to be any valid React node
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log the error
    console.error('Error caught in ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>; // Render fallback UI
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
