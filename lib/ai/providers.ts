import { createVertex } from '@ai-sdk/google-vertex';
import { customProvider } from 'ai';
import { DEFAULT_CHAT_MODEL } from './models';

export const activeProvider = 'vertex';

export function getProviderConfigError() {
  if (!process.env.GOOGLE_VERTEX_PROJECT) {
    return 'Missing GOOGLE_VERTEX_PROJECT. Configure Vertex AI project details to enable Zain chat.';
  }

  return null;
}

export function getZainGeminiModelId() {
  return process.env.GOOGLE_VERTEX_MODEL ?? process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
}

function getVertexCredentials() {
  return process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
    ? {
        googleAuthOptions: {
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
        },
      }
    : {};
}

export function getZainProvider() {
  const vertex = createVertex({
    project: process.env.GOOGLE_VERTEX_PROJECT,
    location: process.env.GOOGLE_VERTEX_LOCATION ?? 'global',
    ...getVertexCredentials(),
  });

  return customProvider({
    languageModels: {
      [DEFAULT_CHAT_MODEL]: vertex(getZainGeminiModelId()),
    },
  });
}

export function getZainLanguageModel(modelId = DEFAULT_CHAT_MODEL) {
  return getZainProvider().languageModel(modelId);
}
