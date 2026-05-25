import React from 'react';
import { Link } from 'react-router-dom';

const AuthShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="text-xl font-medium text-neutral-900 no-underline">
            Lumi<span className="text-primary">Skin</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-16">{children}</main>
    </div>
  );
};

export default AuthShell;
