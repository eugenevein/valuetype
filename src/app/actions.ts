"use server";

import { determineValueType, type DetermineValueTypeInput, type DetermineValueTypeOutput } from "@/ai/flows/determine-value-type";

export async function generateValueTypesAction(
  data: DetermineValueTypeInput
): Promise<{ success: boolean; data?: DetermineValueTypeOutput; error?: string }> {
  try {
    const result = await determineValueType(data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error determining value types:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}
