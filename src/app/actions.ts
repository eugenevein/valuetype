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
    let errorMessage = "An unknown error occurred while generating value types.";
    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage.toLowerCase().includes("api key") || errorMessage.toLowerCase().includes("authentication") || errorMessage.toLowerCase().includes("permission denied")) {
        errorMessage = `API Key or Authentication Error: ${errorMessage}. Please ensure your GOOGLE_API_KEY is correctly set in the .env file and that you have refreshed or restarted your development environment.`;
      }
    }
    return { success: false, error: errorMessage };
  }
}
