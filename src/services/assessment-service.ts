
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

// Wraps a promise in a timeout
export function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, ms);

    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

    