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
    
    // Call backend API to get reading progress
    const response = await fetch(`${API_BASE_URL}/api/${slug}/${chapterNumber}/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Progress not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chapter progress API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reading progress' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapterId: string }> }
) {
  try {
    const { slug, chapterId } = await params;
    const body = await request.json();
    
    // Extract chapter number from chapterId (e.g., 'chapter-1' -> '1')
    const chapterNumber = chapterId.replace(/^chapter-/, '');
    
    // Call backend API to update reading progress
    const response = await fetch(`${API_BASE_URL}/api/${slug}/${chapterNumber}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chapter progress update API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reading progress' },
      { status: 500 }
    );
  }
}