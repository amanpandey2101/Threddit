import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { selectedText, modificationType } = await req.json();

  let prompt = '';
  switch (modificationType) {
    case 'casual':
      prompt = `Rewrite the following text in a more casual and conversational tone: "${selectedText}"`;
      break;
    case 'formal':
      prompt = `Rewrite the following text in a more formal and professional tone: "${selectedText}"`;
      break;
    case 'expand':
      prompt = `Expand on the following idea, making it more detailed and descriptive: "${selectedText}"`;
      break;
    default:
        return new NextResponse('Invalid modification type', { status: 400 });
  }

  try {
    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        prompt,
      });
    
    return NextResponse.json({ modifiedText: text });
  } catch (error) {
    console.error('Failed to modify text:', error);
    return new NextResponse('Failed to modify text', { status: 500 });
  }
} 