
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, QuerySnapshot, DocumentData } from 'firebase/firestore';
import type { Assessment } from '@/services/assessment-service';

export function useFirestoreQuery(collectionName: string) {
  const [data, setData] = useState<Assessment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const documents: Assessment[] = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() } as Assessment);
        });
        setData(documents);
        setIsLoading(false);
      }, 
      (err: Error) => {
        setError(err);
        setIsLoading(false);
        console.error("Firestore subscription error:", err);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { data, isLoading, error };
}
