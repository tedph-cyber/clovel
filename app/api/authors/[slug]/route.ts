import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Forward the request to your FastAPI backend
    const backendUrl = `http://localhost:8000/api/authors/${slug}`;
    
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
          { error: 'Author not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend response: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the author data directly (unwrap if backend returns { success: true, data: ... })
    if (data.success && data.data) {
      return NextResponse.json(data.data);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Author fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}