
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, QuerySnapshot, DocumentData, orderBy, OrderByDirection } from 'firebase/firestore';
import type { Assessment } from '@/services/assessment-service';

interface QueryOptions {
  orderBy?: [string, OrderByDirection];
}

export function useFirestoreQuery(collectionName: string, options?: QueryOptions) {
  const [data, setData] = useState<Assessment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q;
    const collectionRef = collection(db, collectionName);

    if (options?.orderBy) {
      q = query(collectionRef, orderBy(options.orderBy[0], options.orderBy[1]));
    } else {
      q = query(collectionRef);
    }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, JSON.stringify(options)]); // Use JSON.stringify to prevent re-renders on object reference change

  return { data, isLoading, error };
}
