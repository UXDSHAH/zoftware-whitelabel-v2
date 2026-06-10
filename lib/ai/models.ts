export const DEFAULT_CHAT_MODEL = 'chat-model';

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: 'chat-model',
    name: 'Gemini Flash',
    description: 'Fast Gemini model for product advisory chat',
  },
];
