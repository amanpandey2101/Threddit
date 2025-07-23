import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant that summarizes text. Provide a concise summary of the user message.',
    messages,
  });

  return result.toDataStreamResponse();
} 