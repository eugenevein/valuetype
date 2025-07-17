
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ValueTypeForm } from '@/components/value-type-form';
import { ValueTypeResultDisplay } from '@/components/value-type-result-display';
import { AppHeader } from '@/components/app-header';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [submittedDataList, setSubmittedDataList] = React.useState<ValueTypeFormData[]>([]);
  const { toast } = useToast();
  const formRef = React.useRef<{ reset: () => void }>(null);

  const handleSubmit = async (data: ValueTypeFormData) => {
    setSubmittedDataList(prevList => [...prevList, data]);
    toast({
      title: "Success!",
      description: "Value type assessment captured.",
      variant: "default",
    });
    // Reset the form after submission
    if (formRef.current) {
        formRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ValueTypeForm onSubmit={handleSubmit} isLoading={false} formRef={formRef} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-primary">Captured Assessments</h2>
            {submittedDataList.length > 0 ? (
              <div className="space-y-6">
                {submittedDataList.map((data, index) => (
                  <ValueTypeResultDisplay key={index} data={data} />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-12">
                <p>Your generated value type assessments will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Value Type Generator. All rights reserved.
      </footer>
    </div>
  );
}
