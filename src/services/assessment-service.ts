
import { db } from '@/lib/firebase';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Add userId to the data structure
export interface Assessment extends ValueTypeFormData {
  id: string;
  createdAt: any; 
  userId: string;
}

// Add userId to the create data payload
export interface CreateAssessmentData extends ValueTypeFormData {
    userId: string;
}

const assessmentsCollection = collection(db, 'assessments');

export const createAssessment = async (data: CreateAssessmentData) => {
    await addDoc(assessmentsCollection, {
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const updateAssessment = async (assessmentId: string, data: Partial<ValueTypeFormData>) => {
    const assessmentDocRef = doc(db, 'assessments', assessmentId);
    // Ensure userId is not part of the update data
    const { userId, ...updateData } = data as any;
    await updateDoc(assessmentDocRef, updateData);
};

export const deleteAssessment = async (assessmentId: string) => {
    const assessmentDocRef = doc(db, 'assessments', assessmentId);
    await deleteDoc(assessmentDocRef);
};
