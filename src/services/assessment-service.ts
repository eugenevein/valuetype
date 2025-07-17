
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { ValueTypeFormData } from '@/components/value-type-form-schema';

export interface Assessment extends ValueTypeFormData {
  id: string;
  createdAt: Timestamp;
}

const assessmentsCollection = collection(db, 'assessments');

class AssessmentService {
  async getAll(): Promise<Assessment[]> {
    const snapshot = await getDocs(assessmentsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assessment));
  }

  async create(data: ValueTypeFormData): Promise<string> {
    const docRef = await addDoc(assessmentsCollection, {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  async update(id: string, data: Partial<ValueTypeFormData>): Promise<void> {
    const docRef = doc(db, 'assessments', id);
    await updateDoc(docRef, data);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'assessments', id);
    await deleteDoc(docRef);
  }
}

export const assessmentService = new AssessmentService();
