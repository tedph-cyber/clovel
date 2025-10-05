import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config/env';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all query parameters to the FastAPI backend
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    const response = await fetch(`${config.api.baseUrl}/api/novels?${params.toString()}`, {
      method: 'GET',
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
    console.error('Novels API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch novels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${config.api.baseUrl}/api/novels`, {
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
    console.error('Novels POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create novel' },
      { status: 500 }
    );
  }
}
