
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy as firestoreOrderBy, where as firestoreWhere, type OrderByDirection, type WhereFilterOp } from 'firebase/firestore';

interface QueryOptions {
  orderBy?: [string, OrderByDirection];
  where?: [string, WhereFilterOp, any];
}

export function useFirestoreQuery(path: string | null, options: QueryOptions = {}) {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Destructure for useEffect dependency array
  const { orderBy, where } = options;
  const orderByField = orderBy?.[0];
  const orderByDirection = orderBy?.[1];
  const whereField = where?.[0];
  const whereOp = where?.[1];
  const whereValue = where?.[2];

  useEffect(() => {
    // Don't run query if path is null or if a `where` clause is waiting for a value (e.g., user.uid)
    if (!path || (whereField && whereValue === undefined)) {
      setIsLoading(false);
      setData([]); // Return empty array if query can't run yet
      return;
    }
    
    setIsLoading(true);

    let q = query(collection(db, path));
    
    if (whereField && whereOp && whereValue !== undefined) {
        q = query(q, firestoreWhere(whereField, whereOp, whereValue));
    }
    if (orderByField) {
      q = query(q, firestoreOrderBy(orderByField, orderByDirection || 'asc'));
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
        setError(null);
      },
      (err) => {
        console.error("Firestore query error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, orderByField, orderByDirection, whereField, whereOp, whereValue]);

  return { data, isLoading, error };
}
