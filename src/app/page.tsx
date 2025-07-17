
"use client";

import * as React from 'react';
import { ValueTypeForm } from '@/components/value-type-form';
import { ValueTypeResultDisplay } from '@/components/value-type-result-display';
import { AppHeader } from '@/components/app-header';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PrioritizationDialog } from '@/components/prioritization-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';


export interface Assessment extends ValueTypeFormData {
  id: number;
}

export default function HomePage() {
  const [assessments, setAssessments] = React.useState<Assessment[]>([]);
  const [editingAssessment, setEditingAssessment] = React.useState<Assessment | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] = React.useState<Assessment | null>(null);
  const [isPrioritizationOpen, setIsPrioritizationOpen] = React.useState(false);

  const { toast } = useToast();

  const handleSubmit = (data: ValueTypeFormData) => {
    if (editingAssessment) {
      // Update existing assessment
      setAssessments(prev => prev.map(a => a.id === editingAssessment.id ? { ...editingAssessment, ...data } : a));
      toast({
        title: "Success!",
        description: `Assessment for "${data.epicName}" has been updated.`,
      });
      setEditingAssessment(null);
    } else {
      // Add new assessment
      const newAssessment: Assessment = { ...data, id: Date.now() };
      setAssessments(prev => [newAssessment, ...prev]);
      toast({
        title: "Success!",
        description: `Assessment for "${data.epicName}" has been captured.`,
      });
    }
  };

  const handleEdit = (id: number) => {
    const assessment = assessments.find(a => a.id === id);
    if (assessment) {
      setEditingAssessment(assessment);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingAssessment(null);
  }

  const handleDelete = (id: number) => {
     const assessment = assessments.find(a => a.id === id);
     if (assessment) {
        setAssessmentToDelete(assessment);
     }
  };

  const confirmDelete = () => {
    if (assessmentToDelete) {
        setAssessments(prev => prev.filter(a => a.id !== assessmentToDelete.id));
        toast({
            title: "Deleted",
            description: `Assessment for "${assessmentToDelete.epicName}" has been removed.`,
            variant: "destructive",
        });
        setAssessmentToDelete(null);
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ValueTypeForm 
                onSubmit={handleSubmit} 
                isLoading={false} 
                initialData={editingAssessment}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-primary">Captured Assessments</h2>
                 <Button onClick={() => setIsPrioritizationOpen(true)} disabled={assessments.length < 2}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    Prioritize Epics
                 </Button>
              </div>

              {assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.map((data) => (
                    <ValueTypeResultDisplay 
                      key={data.id} 
                      data={data}
                      onEdit={() => handleEdit(data.id)}
                      onDelete={() => handleDelete(data.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground mt-12 border-2 border-dashed border-border rounded-xl p-12">
                  <p className="text-lg">Your captured assessments will appear here.</p>
                  <p className="text-sm mt-2">Fill out the form on the left to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Value Type Generator. All rights reserved.
        </footer>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!assessmentToDelete} onOpenChange={(open) => !open && setAssessmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assessment for <strong>{assessmentToDelete?.epicName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssessmentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Prioritization Dialog */}
      <PrioritizationDialog 
        isOpen={isPrioritizationOpen}
        onClose={() => setIsPrioritizationOpen(false)}
        assessments={assessments}
      />
    </>
  );
}
