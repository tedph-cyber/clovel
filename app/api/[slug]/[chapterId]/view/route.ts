import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config/env';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapterId: string }> }
) {
  try {
    const { slug, chapterId } = await params;
    
    // Extract chapter number from chapterId (e.g., 'chapter-1' -> '1')
    const chapterNumber = chapterId.replace(/^chapter-/, '');
    
    // Call backend API to track chapter view
    const response = await fetch(`${config.api.baseUrl}/api/${slug}/${chapterNumber}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chapter view tracking API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track chapter view' },
      { status: 500 }
    );
  }
}