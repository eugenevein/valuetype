"use client";

import { Zap } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 mb-8 bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-center">
        <Zap className="h-10 w-10 text-primary mr-3" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Value Type Generator
        </h1>
      </div>
    </header>
  );
}
