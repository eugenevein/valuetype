
import type { ValueTypeFormData } from '@/components/value-type-form-schema';

export interface Assessment extends ValueTypeFormData {
  id: string;
  createdAt: any; // Can be Date or Timestamp
}
