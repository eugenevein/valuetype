"use client";

import { Zap } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-center">
        <Zap className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Value Type Generator
        </h1>
      </div>
    </header>
  );
}
