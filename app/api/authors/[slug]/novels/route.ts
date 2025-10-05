import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config/env';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort_by') || 'newest';
    
    // Forward the request to your FastAPI backend
    // const backendUrl = `${config.api.baseUrl}/api/authors/${slug}/novels?sort_by=${sortBy}`;
    // commented it out to remove the sort by cos BE doesnt receive that
    const backendUrl = `${config.api.baseUrl}/api/authors/${slug}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers if needed
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!,
        }),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Author novels not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend response: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the novels data directly (unwrap if backend returns { success: true, data: ... })
    if (data.success && data.data) {
      return NextResponse.json(data.data);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Author novels fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author novels' },
      { status: 500 }
    );
  }
}