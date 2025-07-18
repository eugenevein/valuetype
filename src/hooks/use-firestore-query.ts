
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy as firestoreOrderBy, type OrderByDirection } from 'firebase/firestore';

interface QueryOptions {
  orderBy?: [string, OrderByDirection];
}

export function useFirestoreQuery(path: string | null, options: QueryOptions = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If the path is null, don't attempt to query.
    // This is useful for waiting on user authentication.
    if (!path) {
      setIsLoading(false);
      return;
    }

    let q = query(collection(db, path));
    
    if (options.orderBy) {
      q = query(collection(db, path), firestoreOrderBy(options.orderBy[0], options.orderBy[1]));
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setIsLoading(false);
      },
      (err) => {
        console.error("Firestore query error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [path, options.orderBy?.[0], options.orderBy?.[1]]); // Re-run effect if path or orderBy changes

  return { data, isLoading, error };
}
