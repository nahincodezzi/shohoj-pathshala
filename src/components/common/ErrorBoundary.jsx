import React from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[Sohoj Pathshala ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-danger-soft text-danger flex items-center justify-center mx-auto mb-5 border border-danger/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono font-bold text-danger uppercase tracking-wider">
              System Recovery
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text mt-1 mb-2">
              একটি অপ্রত্যাশিত ত্রুটি ঘটেছে
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed mb-6">
              আমরা দুঃখিত। পেজটি লোড করার সময় একটি সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা হোমপেজে ফিরে যান।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                পেজ রিফ্রেশ করুন
              </button>
              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-surface-2 border border-border text-text text-xs font-semibold hover:bg-border transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                হোমপেজে যান
              </a>
            </div>

            {/* Collapsible Technical Details for Debugging */}
            {this.state.error && (
              <div className="border-t border-border pt-4 text-left">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="flex items-center justify-between w-full text-[11px] text-muted hover:text-text cursor-pointer py-1"
                >
                  <span className="font-mono">কারিগরি বিবরণ (Error Details)</span>
                  {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-lg bg-bg text-[10px] font-mono text-danger overflow-x-auto max-h-40 border border-border">
                    <p className="font-bold">{this.state.error.toString()}</p>
                    {this.state.errorInfo && (
                      <pre className="mt-1 whitespace-pre-wrap text-muted">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
