import React, { Component, type ReactNode, type ErrorInfo } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error Boundary Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong 💥</h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred while rendering this page.
            </p>
            <Link
              to="/"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
