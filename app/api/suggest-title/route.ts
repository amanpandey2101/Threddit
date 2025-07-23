import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Generate 5 engaging titles for the following blog post. The titles should be optimized for clicks and engagement. Return ONLY the result as a valid JSON array of strings, like ["Title 1", "Title 2", ...].

Content: ${prompt}`,
    });

    // Clean the response to remove markdown fences
    const cleanedText = text.replace(/```json\n|```/g, '').trim();

    const suggestions = JSON.parse(cleanedText);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return new NextResponse('Failed to get suggestions', { status: 500 });
  }
} 