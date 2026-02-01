import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/db';
import { brandManuals } from '@/db/schema';

export const runtime = 'nodejs';
export const maxDuration = 60;

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BrandAnalysis {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    neutral: string[];
  };
  typography: {
    headingFonts: string[];
    bodyFonts: string[];
    fontSizes: {
      heading: string[];
      body: string[];
    };
  };
  spacing: {
    scale: string;
    recommendations: string[];
  };
  borderRadius: string[];
  brandVoice: string;
  keyGuidelines: string[];
  logoUsage?: string;
  doAndDonts?: string[];
}

async function analyzeBrandManual(file: File): Promise<{ analysis: BrandAnalysis; extractedText: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload file to OpenAI first
  const uploadedFile = await openaiClient.files.create({
    file: new globalThis.File([buffer], file.name, { type: file.type }),
    purpose: 'assistants',
  });

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a brand identity expert. Analyze the provided brand manual and extract key brand elements in a structured JSON format.

Extract the following information:
1. Color palette (primary, secondary, accent, and neutral colors in hex format)
2. Typography (font families for headings and body text, recommended sizes)
3. Spacing system (spacing scale and recommendations)
4. Border radius values
5. Brand voice and tone
6. Key brand guidelines
7. Logo usage guidelines (if mentioned)
8. Do's and don'ts (if mentioned)

Return ONLY valid JSON matching this structure:
{
  "colors": {
    "primary": ["#hex1", "#hex2"],
    "secondary": ["#hex3"],
    "accent": ["#hex4"],
    "neutral": ["#hex5", "#hex6"]
  },
  "typography": {
    "headingFonts": ["Font Name 1", "Font Name 2"],
    "bodyFonts": ["Font Name 3"],
    "fontSizes": {
      "heading": ["32px", "24px", "18px"],
      "body": ["16px", "14px"]
    }
  },
  "spacing": {
    "scale": "8px",
    "recommendations": ["Use multiples of 8px for consistent spacing"]
  },
  "borderRadius": ["4px", "8px", "12px"],
  "brandVoice": "Description of brand voice and tone",
  "keyGuidelines": ["Guideline 1", "Guideline 2"],
  "logoUsage": "Logo usage guidelines",
  "doAndDonts": ["Do: ...", "Don't: ..."]
}

If specific information is not found in the manual, use empty arrays or reasonable defaults based on common brand practices.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this brand manual and extract brand identity elements. Return the response as valid JSON only.',
            },
            {
              type: 'file' as any,
              file: {
                file_id: uploadedFile.id,
              },
            },
          ] as any,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || '';

    // Remove markdown code block markers if present
    const cleanedText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      const analysis = JSON.parse(cleanedText);
      return {
        analysis,
        extractedText: cleanedText.substring(0, 500),
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response text:', text);
      console.error('Cleaned text:', cleanedText);
      throw new Error('Failed to analyze brand manual. Please try again.');
    }
  } finally {
    // Clean up uploaded file
    try {
      await openaiClient.files.delete(uploadedFile.id);
    } catch (error) {
      console.error('Failed to delete uploaded file:', error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (32MB limit for PDFs)
    const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB in bytes
    if (file.type === 'application/pdf' && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'PDF file size exceeds 32MB limit' },
        { status: 400 }
      );
    }

    // Analyze with OpenAI (PDF sent directly, no parsing needed)
    const { analysis, extractedText } = await analyzeBrandManual(file);

    // Save to database
    const [savedManual] = await db
      .insert(brandManuals)
      .values({
        content: JSON.stringify(analysis),
      })
      .returning();

    return NextResponse.json({
      success: true,
      manualId: savedManual.id,
      analysis,
      preview: extractedText,
    });
  } catch (error) {
    console.error('Error processing brand manual:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process brand manual',
      },
      { status: 500 }
    );
  }
}
