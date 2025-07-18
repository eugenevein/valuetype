
import { db } from '@/lib/firebase';
import type { ValueTypeFormData } from '@/components/value-type-form-schema';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface Assessment extends ValueTypeFormData {
  id: string;
  createdAt: any; 
}

const assessmentsCollection = collection(db, 'assessments');

export const createAssessment = async (data: ValueTypeFormData) => {
    await addDoc(assessmentsCollection, {
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const updateAssessment = async (assessmentId: string, data: Partial<ValueTypeFormData>) => {
    const assessmentDocRef = doc(db, 'assessments', assessmentId);
    await updateDoc(assessmentDocRef, data);
};

export const deleteAssessment = async (assessmentId: string) => {
    const assessmentDocRef = doc(db, 'assessments', assessmentId);
    await deleteDoc(assessmentDocRef);
};
