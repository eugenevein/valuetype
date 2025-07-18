
import { db } from '@/lib/firebase';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface Assessment extends ValueTypeFormData {
  id: string;
  createdAt: any; 
  userId: string;
}

export interface CreateAssessmentData extends ValueTypeFormData {
    userId: string;
}

const assessmentsCollection = collection(db, 'assessments');

export const createAssessment = async (data: CreateAssessmentData) => {
    return addDoc(assessmentsCollection, {
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const updateAssessment = async (assessmentId: string, data: Partial<Assessment>) => {
    const assessmentDocRef = doc(db, 'assessments', assessmentId);
    return updateDoc(assessmentDocRef, data);
};

export const deleteAssessment = async (assessmentId: string) => {
    const assessmentDocRef = doc(db, 'assessments', assessmentId);
    return deleteDoc(assessmentDocRef);
};
