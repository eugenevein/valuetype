
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import AuthGuard from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { createAssessment, deleteAssessment, updateAssessment, type Assessment } from '@/services/assessment-service';
import { useFirestoreQuery } from '@/hooks/use-firestore-query';

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: assessments, isLoading: isLoadingAssessments } = useFirestoreQuery(
    'assessments',
    { 
      where: ["userId", "==", user?.uid],
      orderBy: ["createdAt", "desc"] 
    }
  );

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
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to perform this action.", variant: "destructive" });
        return;
    }

    setIsMutating(true);
    try {
      if (editingAssessment) {
        // We only pass the data, not the userId, as it should not be changed on update.
        await updateAssessment(editingAssessment.id, data);
        toast({
          title: "Success!",
          description: `Assessment for "${data.epicName}" has been updated.`,
        });
        setEditingAssessment(null);
      } else {
        await createAssessment({ ...data, userId: user.uid });
        toast({
          title: "Success!",
          description: `Assessment for "${data.epicName}" has been captured.`,
        });
        form.reset(getDefaultValues());
      }
    } catch (error) {
       console.error("Failed to save assessment:", error);
       toast({
        title: "Error Saving Assessment",
        description: `Could not save the assessment. Please check the console for details and ensure your database rules are correct.`,
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
    if (assessmentToDelete && user) {
      setIsMutating(true);
      try {
        await deleteAssessment(assessmentToDelete.id);
        toast({
            title: "Deleted",
            description: `Assessment for "${assessmentToDelete.epicName}" has been removed.`,
            variant: "destructive",
        });
        setAssessmentToDelete(null);
      } catch (e) {
        console.error("Failed to delete assessment:", e);
        toast({
               title: "Error Deleting Assessment",
               description: "Could not delete the assessment. Please check console for details.",
               variant: "destructive",
        });
      } finally {
        setIsMutating(false);
      }
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold">Captured Assessments</h2>
                 <Button onClick={() => setIsPrioritizationOpen(true)} disabled={!assessments || assessments.length < 2}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    Prioritize
                 </Button>
              </div>

              {isLoadingAssessments ? (
                 <div className="text-center text-muted-foreground mt-12 border-2 border-dashed border-border rounded-xl p-12 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
              ) : assessments && assessments.length > 0 ? (
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

      <PrioritizationDialog 
        isOpen={isPrioritizationOpen}
        onClose={() => setIsPrioritizationOpen(false)}
        assessments={assessments || []}
      />
    </AuthGuard>
  );
}
