import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
