import { config } from 'dotenv';
config(); // Load environment variables from .env. This should be at the very top.

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleAiApiKey = process.env.GOOGLE_API_KEY;

if (!googleAiApiKey) {
  console.warn(
    'WARNING: The GOOGLE_API_KEY environment variable is not set. ' +
    'AI features requiring this key will likely fail. ' +
    'Please ensure the key is correctly defined in your .env file and that you have restarted your development server.'
  );
}

export const ai = genkit({
  // Explicitly pass the apiKey if it exists.
  // If googleAiApiKey is undefined, googleAI() will be called without arguments,
  // and it will attempt its default environment variable lookup.
  plugins: [googleAI(googleAiApiKey ? { apiKey: googleAiApiKey } : undefined)],
  model: 'googleai/gemini-2.0-flash',
});
