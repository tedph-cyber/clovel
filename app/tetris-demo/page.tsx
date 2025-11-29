'use client';

import TetrisLoading from '@/components/ui/tetris-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export default function TetrisDemo() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showText, setShowText] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tetris Loading Component
          </h1>
          <p className="text-gray-600">
            An animated Tetris-style loading indicator for your app. Customize size, speed, and text.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[400px]">
              <TetrisLoading
                size={size}
                speed={speed}
                showLoadingText={showText}
                loadingText={loadingText}
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Size Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={size === 'sm' ? 'primary' : 'outline'}
                    onClick={() => setSize('sm')}
                    size="sm"
                  >
                    Small
                  </Button>
                  <Button
                    variant={size === 'md' ? 'primary' : 'outline'}
                    onClick={() => setSize('md')}
                    size="sm"
                  >
                    Medium
                  </Button>
                  <Button
                    variant={size === 'lg' ? 'primary' : 'outline'}
                    onClick={() => setSize('lg')}
                    size="sm"
                  >
                    Large
                  </Button>
                </div>
              </div>

              {/* Speed Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={speed === 'slow' ? 'primary' : 'outline'}
                    onClick={() => setSpeed('slow')}
                    size="sm"
                  >
                    Slow
                  </Button>
                  <Button
                    variant={speed === 'normal' ? 'primary' : 'outline'}
                    onClick={() => setSpeed('normal')}
                    size="sm"
                  >
                    Normal
                  </Button>
                  <Button
                    variant={speed === 'fast' ? 'primary' : 'outline'}
                    onClick={() => setSpeed('fast')}
                    size="sm"
                  >
                    Fast
                  </Button>
                </div>
              </div>

              {/* Show Text Control */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showText}
                    onChange={(e) => setShowText(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show Loading Text
                  </span>
                </label>
              </div>

              {/* Custom Text */}
              {showText && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loading Text
                  </label>
                  <input
                    type="text"
                    value={loadingText}
                    onChange={(e) => setLoadingText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter loading text..."
                  />
                </div>
              )}

              {/* Code Example */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code
                </label>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`<TetrisLoading
  size="${size}"
  speed="${speed}"
  showLoadingText={${showText}}
  loadingText="${loadingText}"
/>`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Basic Usage</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import TetrisLoading from '@/components/ui/tetris-loader';

export default function MyPage() {
  return <TetrisLoading />;
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Loading Page</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import TetrisLoading from '@/components/ui/tetris-loader';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <TetrisLoading 
        size="md" 
        speed="normal" 
        loadingText="Loading Clovel..." 
      />
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Conditional Loading</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import TetrisLoading from '@/components/ui/tetris-loader';

export default function MyComponent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <TetrisLoading size="sm" speed="fast" />
      </div>
    );
  }

  return <div>Your content here</div>;
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Props Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Props</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Prop</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Default</th>
                    <th className="text-left py-2 px-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">size</td>
                    <td className="py-2 px-4 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                    <td className="py-2 px-4 font-mono text-xs">'md'</td>
                    <td className="py-2 px-4">Size of the Tetris grid</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">speed</td>
                    <td className="py-2 px-4 font-mono text-xs">'slow' | 'normal' | 'fast'</td>
                    <td className="py-2 px-4 font-mono text-xs">'normal'</td>
                    <td className="py-2 px-4">Animation speed</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">showLoadingText</td>
                    <td className="py-2 px-4 font-mono text-xs">boolean</td>
                    <td className="py-2 px-4 font-mono text-xs">true</td>
                    <td className="py-2 px-4">Show loading text below animation</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-mono">loadingText</td>
                    <td className="py-2 px-4 font-mono text-xs">string</td>
                    <td className="py-2 px-4 font-mono text-xs">'Loading...'</td>
                    <td className="py-2 px-4">Custom loading text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
