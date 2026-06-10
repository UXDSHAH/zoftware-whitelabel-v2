import * as ai from 'ai';
import type { UIMessage } from 'ai';
import { Client } from 'langsmith';
import { createLangSmithProviderOptions, wrapAISDK } from 'langsmith/experimental/vercel';
import { after } from 'next/server';
import { z } from 'zod';
import { catalogTools } from '@/lib/ai/catalog-tools';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { getProviderConfigError, getZainGeminiModelId, getZainLanguageModel } from '@/lib/ai/providers';
import { ZAIN_SYSTEM_PROMPT } from '@/lib/ai/zain-system-prompt';

export const maxDuration = 30;
export const runtime = 'nodejs';

const { streamText } = wrapAISDK(ai);
const langSmithClient = new Client();
const isLangSmithTracingEnabled =
  process.env.LANGSMITH_TRACING === 'true' ||
  process.env.LANGCHAIN_TRACING_V2 === 'true';
const isChatTelemetryEnabled =
  process.env.ZAIN_CHAT_TELEMETRY === 'true' ||
  isLangSmithTracingEnabled;
const shouldRecordChatTraceContent = process.env.ZAIN_CHAT_TRACE_CONTENT === 'true';
const chatRequestSchema = z.object({
  messages: z.array(
    z.custom<UIMessage>(
      message => {
        if (!message || typeof message !== 'object') return false;

        const candidate = message as Partial<UIMessage>;
        return (
          typeof candidate.id === 'string' &&
          ['user', 'assistant', 'system'].includes(candidate.role ?? '') &&
          Array.isArray(candidate.parts)
        );
      },
      { message: 'Each message must include an id, role, and parts array.' },
    ),
  ).min(1).max(20),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function summarizeUiMessages(messages: UIMessage[]) {
  return messages.map((message, index) => ({
    index,
    id: message.id,
    role: message.role,
    partTypes: message.parts.map(part => part.type),
    textLength: message.parts.reduce(
      (total, part) => total + (part.type === 'text' ? part.text.length : 0),
      0,
    ),
  }));
}

function summarizeContentParts(content: unknown) {
  if (typeof content === 'string') {
    return [{ type: 'text', textLength: content.length }];
  }

  if (!Array.isArray(content)) return [];

  return content.map((part, index) => {
    if (!isRecord(part)) return { index, type: typeof part };

    const text = part.text;
    const toolName = part.toolName ?? part.name;

    return {
      index,
      type: typeof part.type === 'string' ? part.type : 'unknown',
      textLength: typeof text === 'string' ? text.length : undefined,
      toolName: typeof toolName === 'string' ? toolName : undefined,
    };
  });
}

function summarizeProviderPrompt(prompt: unknown) {
  if (!Array.isArray(prompt)) return '[redacted]';

  return prompt.map((message, index) => {
    if (!isRecord(message)) return { index, type: typeof message };

    return {
      index,
      role: typeof message.role === 'string' ? message.role : 'unknown',
      content: summarizeContentParts(message.content),
    };
  });
}

function summarizeToolCalls(output: Record<string, unknown>) {
  const toolCalls = output.toolCalls ?? output.tool_calls;
  if (!Array.isArray(toolCalls)) return undefined;

  return toolCalls.map((toolCall, index) => {
    if (!isRecord(toolCall)) return { index, type: typeof toolCall };

    const fn = isRecord(toolCall.function) ? toolCall.function : {};
    const name = toolCall.toolName ?? toolCall.name ?? fn.name;
    const args = toolCall.args ?? toolCall.arguments ?? fn.arguments;

    return {
      index,
      name: typeof name === 'string' ? name : undefined,
      argumentsLength: typeof args === 'string' ? args.length : undefined,
      argumentKeys: isRecord(args) ? Object.keys(args) : undefined,
    };
  });
}

function summarizeRunOutput(output: unknown) {
  if (!isRecord(output)) {
    return { response: '[redacted]' };
  }

  const outputs = isRecord(output.outputs) ? output.outputs : output;
  const text = outputs.text ?? outputs.response;

  return {
    finishReason: typeof outputs.finishReason === 'string' ? outputs.finishReason : undefined,
    textLength: typeof text === 'string' ? text.length : undefined,
    content: summarizeContentParts(outputs.content),
    toolCalls: summarizeToolCalls(outputs),
    usage: isRecord(outputs.usage) ? outputs.usage : undefined,
  };
}

export async function POST(req: Request) {
  const configError = getProviderConfigError();
  if (configError) {
    return Response.json(
      { error: configError },
      { status: 500 },
    );
  }

  let messages: UIMessage[];
  try {
    const parsed = chatRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid chat request. Send 1-20 UI messages.' },
        { status: 400 },
      );
    }

    messages = parsed.data.messages;
  } catch {
    return Response.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const modelId = getZainGeminiModelId();

  const result = streamText({
    model: getZainLanguageModel(DEFAULT_CHAT_MODEL),
    system: ZAIN_SYSTEM_PROMPT,
    messages: await ai.convertToModelMessages(messages),
    tools: catalogTools,
    stopWhen: ai.stepCountIs(5),
    experimental_telemetry: {
      isEnabled: isChatTelemetryEnabled,
      recordInputs: shouldRecordChatTraceContent,
      recordOutputs: shouldRecordChatTraceContent,
      functionId: 'zain-whitelabel-chat',
      metadata: {
        route: '/api/chat',
        provider: 'vertex',
        model: modelId,
        messageCount: messages.length,
      },
    },
    providerOptions: {
      langsmith: createLangSmithProviderOptions<typeof ai.streamText>({
        name: 'zain-whitelabel-chat',
        client: langSmithClient,
        project_name: process.env.LANGSMITH_PROJECT || 'zain-whitelabel',
        tracingEnabled: isLangSmithTracingEnabled,
        tags: ['zain-chat', 'zoftware', 'vertex'],
        metadata: {
          route: '/api/chat',
          provider: 'vertex',
          model: modelId,
          messageCount: messages.length,
        },
        processInputs: inputs =>
          shouldRecordChatTraceContent
            ? (inputs as unknown as Record<string, unknown>)
            : {
                route: '/api/chat',
                model: modelId,
                messageCount: messages.length,
                messages: summarizeUiMessages(messages),
                availableTools: Object.keys(catalogTools),
              },
        processOutputs: outputs =>
          shouldRecordChatTraceContent
            ? (outputs as unknown as Record<string, unknown>)
            : {
                ...summarizeRunOutput(outputs),
                traceContent: 'Set ZAIN_CHAT_TRACE_CONTENT=true to capture full prompts and responses.',
              },
        processChildLLMRunInputs: inputs =>
          shouldRecordChatTraceContent
            ? (inputs as unknown as Record<string, unknown>)
            : {
                model: modelId,
                prompt: summarizeProviderPrompt(inputs.prompt),
              },
        processChildLLMRunOutputs: outputs =>
          shouldRecordChatTraceContent
            ? (outputs as unknown as Record<string, unknown>)
            : summarizeRunOutput(outputs),
      }),
    },
    onStepFinish({ toolCalls, finishReason, usage }) {
      if (process.env.DEBUG) {
        const toolNames = toolCalls.map(toolCall => toolCall.toolName).join(', ') || 'none';
        console.log(
          `[Zain Chat] model=${modelId} finish=${finishReason} tools=[${toolNames}] inputTokens=${usage.inputTokens ?? '?'} outputTokens=${usage.outputTokens ?? '?'}`,
        );
      }
    },
  });

  if (isLangSmithTracingEnabled) {
    after(async () => {
      try {
        await langSmithClient.awaitPendingTraceBatches();
      } catch (error) {
        console.error('LangSmith trace flush failed', error);
      }
    });
  }

  return result.toUIMessageStreamResponse({
    onError(error) {
      console.error('Zain chat stream failed', error);
      return 'Zain could not complete that response. Please try again.';
    },
  });
}
