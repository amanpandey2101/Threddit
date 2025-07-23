import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    maxTokens:1000,
    system:
      'You are an AI assistant that generates engaging and well-structured Reddit posts in markdown format up to 300 words.',
    messages,
  });

  return result.toDataStreamResponse();
} 