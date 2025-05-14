"use client";

import * as React from 'react';
import { ValueTypeForm } from '@/components/value-type-form';
import { ValueTypeResultDisplay } from '@/components/value-type-result-display';
import { AppHeader } from '@/components/app-header';
import { generateValueTypesAction } from './actions';
import type { DetermineValueTypeInput, DetermineValueTypeOutput } from '@/ai/flows/determine-value-type';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [results, setResults] = React.useState<DetermineValueTypeOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: DetermineValueTypeInput) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await generateValueTypesAction(data);
      if (response.success && response.data) {
        setResults(response.data);
        toast({
          title: "Success!",
          description: "Value types generated successfully.",
          variant: "default",
        });
      } else {
        setError(response.error || "Failed to generate value types.");
        toast({
          title: "Error",
          description: response.error || "Failed to generate value types.",
          variant: "destructive",
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <ValueTypeForm onSubmit={handleSubmit} isLoading={isLoading} />
          {(results || isLoading || error) && (
             <div className="mt-12">
                <ValueTypeResultDisplay results={results} isLoading={isLoading} error={error} />
             </div>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Value Type Generator. All rights reserved.
      </footer>
    </div>
  );
}
