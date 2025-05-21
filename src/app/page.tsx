
"use client";

import * as React from 'react';
import { ValueTypeForm } from '@/components/value-type-form';
import { ValueTypeResultDisplay } from '@/components/value-type-result-display';
import { AppHeader } from '@/components/app-header';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [submittedData, setSubmittedData] = React.useState<ValueTypeFormData | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: ValueTypeFormData) => {
    // Directly set the submitted data for display
    setSubmittedData(data);
    toast({
      title: "Success!",
      description: "Value type assessment captured.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Pass false for isLoading as there's no async AI call anymore for this form */}
          <ValueTypeForm onSubmit={handleSubmit} isLoading={false} />
          {submittedData && (
             <div className="mt-12">
                <ValueTypeResultDisplay data={submittedData} />
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
