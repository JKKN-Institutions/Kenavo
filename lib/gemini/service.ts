/**
 * Gemini AI Service
 * Handles RAG Store management, file upload, and AI chat functionality
 */

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GroundingChunk, ChatMessage } from '@/lib/types/database';

let ai: GoogleGenAI | null = null;

/**
 * Initialize Gemini AI with API key
 */
export function initializeGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return ai;
}

/**
 * Get initialized Gemini AI instance
 */
function getAI() {
  if (!ai) {
    return initializeGemini();
  }
  return ai;
}

/**
 * Delay utility for polling operations
 */
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a new RAG Store
 */
export async function createRagStore(displayName: string): Promise<string> {
  const geminiAI = getAI();

  const ragStore = await geminiAI.fileSearchStores.create({
    config: { displayName }
  });

  if (!ragStore.name) {
    throw new Error("Failed to create RAG store: name is missing");
  }

  return ragStore.name;
}

/**
 * Check if a RAG Store is accessible with current API key
 */
export async function isRagStoreAccessible(ragStoreName: string): Promise<boolean> {
  try {
    const geminiAI = getAI();
    await geminiAI.fileSearchStores.get({ name: ragStoreName });
    return true;
  } catch (error: any) {
    // If we get a 403/404 or permission error, the store is not accessible
    if (error?.status === 403 || error?.status === 404 ||
        error?.error?.status === 'PERMISSION_DENIED' ||
        error?.message?.toLowerCase().includes('permission') ||
        error?.message?.toLowerCase().includes('not exist')) {
      return false;
    }
    // For other errors, assume accessible but log the error
    console.warn('Error checking RAG store accessibility:', error);
    return true; // Optimistic - assume accessible if we can't determine
  }
}

/**
 * Upload file to RAG Store
 */
export async function uploadToRagStore(
  ragStoreName: string,
  file: Buffer,
  fileName: string,
  mimeType: string
): Promise<void> {
  const geminiAI = getAI();

  // Create a File-like object from Buffer
  const uint8Array = new Uint8Array(file);
  const fileBlob = new Blob([uint8Array], { type: mimeType });
  const fileObject = new File([fileBlob], fileName, { type: mimeType });

  let op = await geminiAI.fileSearchStores.uploadToFileSearchStore({
    fileSearchStoreName: ragStoreName,
    file: fileObject
  });

  // Poll until operation is complete
  while (!op.done) {
    await delay(3000);
    op = await geminiAI.operations.get({ operation: op });
  }

  if (op.error) {
    throw new Error(`Upload failed: ${op.error.message || 'Unknown error'}`);
  }
}

/**
 * Perform file search and generate response
 */
export async function fileSearch(
  ragStoreName: string,
  query: string
): Promise<{ text: string; groundingChunks: GroundingChunk[] }> {
  const geminiAI = getAI();

  const systemPrompt = `You are Kenavo AI Assistant for the Montfort Class of 2000 Alumni Directory. Provide natural, friendly, and conversational responses. Answer directly without mentioning documents or asking users to read anything. Share alumni information naturally as if you personally know them.`;

  const response: GenerateContentResponse = await geminiAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: systemPrompt + "\n\nUser question: " + query,
    config: {
      tools: [
        {
          fileSearch: {
            fileSearchStoreNames: [ragStoreName],
          }
        }
      ]
    }
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    text: response.text || '',
    groundingChunks: groundingChunks,
  };
}

/**
 * Generate example questions based on uploaded documents
 */
export async function generateExampleQuestions(ragStoreName: string): Promise<string[]> {
  const geminiAI = getAI();

  try {
    const response = await geminiAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "You are generating example questions for the Kenavo Alumni Directory (Montfort Class of 2000). Generate 6 short, natural, conversational questions that users might ask. Questions should be friendly and casual, as if asking a classmate. Return ONLY a JSON array of question strings. Examples: [\"Who's working in tech these days?\", \"Any alumni in my city?\", \"Tell me about someone working in medicine\", \"What do people do now?\"]",
      config: {
        tools: [
          {
            fileSearch: {
              fileSearchStoreNames: [ragStoreName],
            }
          }
        ]
      }
    });

    if (!response.text) {
      console.warn("No response text from Gemini for example questions");
      return [];
    }

    let jsonText = response.text.trim();

    // Try to extract JSON from markdown code blocks
    const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find array brackets
      const firstBracket = jsonText.indexOf('[');
      const lastBracket = jsonText.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        jsonText = jsonText.substring(firstBracket, lastBracket + 1);
      }
    }

    const parsedData = JSON.parse(jsonText);

    if (Array.isArray(parsedData)) {
      return parsedData.filter(q => typeof q === 'string');
    }

    console.warn("Received unexpected format for example questions:", parsedData);
    return [];
  } catch (error) {
    console.error("Failed to generate or parse example questions:", error);
    return [];
  }
}

/**
 * Delete a RAG Store
 */
export async function deleteRagStore(ragStoreName: string): Promise<void> {
  const geminiAI = getAI();

  await geminiAI.fileSearchStores.delete({
    name: ragStoreName,
    config: { force: true },
  });
}

/**
 * Chat with documents using conversation history
 */
export async function chatWithDocuments(
  ragStoreName: string,
  message: string,
  history: ChatMessage[] = []
): Promise<{ text: string; groundingChunks: GroundingChunk[] }> {
  const geminiAI = getAI();

  // System instructions for natural conversation
  const systemPrompt = `You are Kenavo AI Assistant, a friendly and knowledgeable helper for the Kenavo Alumni Directory (Montfort Class of 2000).

Your role:
- Provide natural, conversational responses using information from the alumni documents
- Be warm, friendly, and helpful - like talking to a classmate
- Answer questions directly and concisely
- Use the information from the documents to give specific, relevant answers
- When mentioning alumni, share their details naturally (name, current job, location, etc.)
- If you find multiple relevant results, summarize them in a friendly way
- Keep responses concise but informative

Important:
- DO NOT say "according to the document" or "based on the provided information"
- DO NOT ask users to "refer to" or "read" anything
- DO NOT format responses as bullet points unless specifically asked
- Answer naturally as if you personally know the alumni information`;

  // Build conversation history
  const contents = [
    ...history.map(msg => ({
      role: msg.role,
      parts: msg.parts
    })),
    {
      role: 'user' as const,
      parts: [{ text: systemPrompt + "\n\nUser question: " + message }]
    }
  ];

  const response: GenerateContentResponse = await geminiAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      tools: [
        {
          fileSearch: {
            fileSearchStoreNames: [ragStoreName],
          }
        }
      ]
    }
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    text: response.text || '',
    groundingChunks: groundingChunks,
  };
}
