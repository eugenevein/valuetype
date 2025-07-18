
import { db } from '@/lib/firebase';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface Assessment extends ValueTypeFormData {
  id: string;
  createdAt: any; 
  userId: string;
}

const getAssessmentsCollection = (userId: string) => {
    return collection(db, `users/${userId}/assessments`);
}

export const createAssessment = async (userId: string, data: ValueTypeFormData) => {
    const assessmentsCollection = getAssessmentsCollection(userId);
    await addDoc(assessmentsCollection, {
        ...data,
        userId: userId,
        createdAt: serverTimestamp(),
    });
};

export const updateAssessment = async (userId: string, assessmentId: string, data: Partial<ValueTypeFormData>) => {
    const assessmentDocRef = doc(db, `users/${userId}/assessments`, assessmentId);
    await updateDoc(assessmentDocRef, data);
};

export const deleteAssessment = async (userId: string, assessmentId: string) => {
    const assessmentDocRef = doc(db, `users/${userId}/assessments`, assessmentId);
    await deleteDoc(assessmentDocRef);
};
