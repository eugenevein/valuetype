
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';
import { ValueTypeForm } from '@/components/value-type-form';
import { ValueTypeResultDisplay } from '@/components/value-type-result-display';
import { AppHeader } from '@/components/app-header';
import { valueTypeFormSchema, type ValueTypeFormData } from '@/components/value-type-form-schema';
import { getDefaultValues } from '@/components/value-type-form';
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
import { ListChecks, Loader2 } from 'lucide-react';
import { assessmentService, type Assessment } from '@/services/assessment-service';


export default function HomePage() {
  const { data: assessments, isLoading, error } = useFirestoreQuery('assessments');

  const [editingAssessment, setEditingAssessment] = React.useState<Assessment | null>(null);
  const [assessmentToDelete, setAssessmentToDelete] = React.useState<Assessment | null>(null);
  const [isPrioritizationOpen, setIsPrioritizationOpen] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);

  const { toast } = useToast();

  const form = useForm<ValueTypeFormData>({
    resolver: zodResolver(valueTypeFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });
  
  React.useEffect(() => {
    if (editingAssessment) {
      form.reset(editingAssessment);
    } else {
      form.reset(getDefaultValues());
    }
  }, [editingAssessment, form]);


  const handleSubmit = async (data: ValueTypeFormData) => {
    setIsMutating(true);
    try {
      if (editingAssessment) {
        // Update existing assessment
        await assessmentService.update(editingAssessment.id, data);
        toast({
          title: "Success!",
          description: `Assessment for "${data.epicName}" has been updated.`,
        });
        setEditingAssessment(null); // This will trigger the useEffect to reset the form
      } else {
        // Add new assessment
        await assessmentService.create(data);
        toast({
          title: "Success!",
          description: `Assessment for "${data.epicName}" has been captured.`,
        });
        // We no longer call form.reset() here. The useEffect handles it when editingAssessment changes.
        // For new items, the form is already in the default state or will be reset by the effect if an edit is cancelled.
        // To be safe, we can trigger the effect for new items as well by just resetting the form manually.
        form.reset(getDefaultValues()); // Reset form for new entry after submission
      }
    } catch (e) {
        toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsMutating(false);
    }
  };

  const handleEdit = (id: string) => {
    const assessment = assessments?.find(a => a.id === id);
    if (assessment) {
      setEditingAssessment(assessment);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingAssessment(null);
  }

  const handleDelete = (id: string) => {
     const assessment = assessments?.find(a => a.id === id);
     if (assessment) {
        setAssessmentToDelete(assessment);
     }
  };

  const confirmDelete = async () => {
    if (assessmentToDelete) {
      setIsMutating(true);
      try {
        await assessmentService.delete(assessmentToDelete.id);
        toast({
            title: "Deleted",
            description: `Assessment for "${assessmentToDelete.epicName}" has been removed.`,
            variant: "destructive",
        });
        setAssessmentToDelete(null);
      } catch (e) {
          toast({
              title: "Error",
              description: "Could not delete the assessment. Please try again.",
              variant: "destructive",
          });
      } finally {
          setIsMutating(false);
      }
    }
  }
  
  const sortedAssessments = React.useMemo(() => {
    if (!assessments) return [];
    // Sort by creation time, newest first. Assumes a 'createdAt' field.
    return [...assessments].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [assessments]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ValueTypeForm 
                form={form}
                onSubmit={handleSubmit} 
                isLoading={isMutating} 
                isEditing={!!editingAssessment}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-primary">Captured Assessments</h2>
                 <Button onClick={() => setIsPrioritizationOpen(true)} disabled={!assessments || assessments.length < 2}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    Prioritize Epics
                 </Button>
              </div>

              {isLoading && (
                  <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              )}

              {!isLoading && error && (
                  <div className="text-center text-red-500 mt-12 border-2 border-dashed border-red-400 rounded-xl p-12">
                      <p className="text-lg">Could not load assessments.</p>
                      <p className="text-sm mt-2">{error.message}</p>
                  </div>
              )}

              {!isLoading && !error && assessments && assessments.length > 0 ? (
                <div className="space-y-4">
                  {sortedAssessments.map((data) => (
                    <ValueTypeResultDisplay 
                      key={data.id} 
                      data={data}
                      onEdit={() => handleEdit(data.id)}
                      onDelete={() => handleDelete(data.id)}
                    />
                  ))}
                </div>
              ) : (
                !isLoading && !error && (
                  <div className="text-center text-muted-foreground mt-12 border-2 border-dashed border-border rounded-xl p-12">
                    <p className="text-lg">Your captured assessments will appear here.</p>
                    <p className="text-sm mt-2">Fill out the left to get started.</p>
                  </div>
                )
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
            <AlertDialogAction onClick={confirmDelete} className={buttonVariants({ variant: "destructive" })} disabled={isMutating}>
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Prioritization Dialog */}
      <PrioritizationDialog 
        isOpen={isPrioritizationOpen}
        onClose={() => setIsPrioritizationOpen(false)}
        assessments={assessments || []}
      />
    </>
  );
}
