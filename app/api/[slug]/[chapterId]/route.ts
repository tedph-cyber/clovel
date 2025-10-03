import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapterId: string }> }
) {
  try {
    const { slug, chapterId } = await params;
    
    // Extract chapter number from chapterId (e.g., 'chapter-1' -> '1')
    const chapterNumber = chapterId.replace(/^chapter-/, '');
    
    // Call backend API with novel title (slug) and chapter number
    const response = await fetch(`${API_BASE_URL}/api/${slug}/chapter-${chapterNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Chapter not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chapter API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}