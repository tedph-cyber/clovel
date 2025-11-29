'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TetrisLoading from '@/components/ui/tetris-loader';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  RefreshCw,
  Terminal,
  Table,
  Search
} from 'lucide-react';
import { runDiagnostics } from '@/lib/utils/supabase-diagnostics';

// Sanitize sensitive information from diagnostic results
const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    } else if (typeof sanitized[key] === 'string') {
      // Redact URLs, keys, and other sensitive patterns
      if (key.toLowerCase().includes('url') && sanitized[key].includes('.supabase.')) {
        const url = new URL(sanitized[key]);
        sanitized[key] = `${url.protocol}//${url.hostname.split('.')[0]}.***.[redacted]`;
      } else if (key.toLowerCase().includes('key') && sanitized[key].length > 20) {
        sanitized[key] = `${sanitized[key].substring(0, 8)}...[redacted]`;
      } else if (key === 'email' || key.includes('email')) {
        sanitized[key] = '[email-redacted]';
      }
    }
  }
  
  return sanitized;
};

export default function DiagnosticsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const diagnosticsResults = await runDiagnostics();
      setResults(diagnosticsResults);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800">Passed</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Failed</Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Supabase Connection Diagnostics
            </h1>
          </div>
          <p className="text-gray-600 mb-4">
            Test and debug your Supabase database connection. Run diagnostics to identify and fix any issues.
          </p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Security Note:</strong> Sensitive information (URLs, keys, personal data) is automatically redacted in the output below.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <Button 
            onClick={runTests} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running Tests...' : 'Run Diagnostics'}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Error Running Diagnostics</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !results && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <TetrisLoading size="md" speed="normal" loadingText="Running diagnostics tests..." />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Summary */}
            <Card className={`mb-6 ${results.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {results.passed ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${results.passed ? 'text-green-900' : 'text-red-900'}`}>
                        {results.passed ? 'All Tests Passed!' : 'Some Tests Failed'}
                      </h3>
                      <p className={results.passed ? 'text-green-700' : 'text-red-700'}>
                        {results.passed_count} of {results.total} tests passed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.round((results.passed_count / results.total) * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables Test */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    <CardTitle>Environment Variables</CardTitle>
                  </div>
                  {getStatusBadge(results.results.environment.success)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {getStatusIcon(results.results.environment.success)}
                    <div className="flex-1">
                      <p className="font-medium">{results.results.environment.message}</p>
                      {results.results.environment.details && (
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(sanitizeData(results.results.environment.details), null, 2)}
                        </pre>
                      )}
                      {results.results.environment.error && (
                        <pre className="mt-2 p-3 bg-red-50 rounded text-xs overflow-x-auto text-red-900">
                          {JSON.stringify(sanitizeData(results.results.environment.error), null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connection Test */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    <CardTitle>Database Connection</CardTitle>
                  </div>
                  {getStatusBadge(results.results.connection.success)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  {getStatusIcon(results.results.connection.success)}
                  <div className="flex-1">
                    <p className="font-medium">{results.results.connection.message}</p>
                    {results.results.connection.details && (
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(sanitizeData(results.results.connection.details), null, 2)}
                      </pre>
                    )}
                    {results.results.connection.error && (
                      <pre className="mt-2 p-3 bg-red-50 rounded text-xs overflow-x-auto text-red-900">
                        {JSON.stringify(sanitizeData(results.results.connection.error), null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table Access Tests */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  <CardTitle>Table Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(results.results.tables).map(([table, result]: [string, any]) => (
                    <div key={table} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                      {getStatusIcon(result.success)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{table}</p>
                          {getStatusBadge(result.success)}
                        </div>
                        <p className="text-sm text-gray-600">{result.message}</p>
                        {result.error && (
                          <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-x-auto text-red-900">
                            {JSON.stringify(sanitizeData(result.error), null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Query Tests */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  <CardTitle>Sample Queries</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(results.results.queries).map(([query, result]: [string, any]) => (
                    <div key={query} className="flex items-start gap-2 p-3 bg-gray-50 rounded">
                      {getStatusIcon(result.success)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{query}</p>
                          {getStatusBadge(result.success)}
                        </div>
                        <p className="text-sm text-gray-600">{result.message}</p>
                        {result.details && (
                          <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                            {JSON.stringify(sanitizeData(result.details), null, 2)}
                          </pre>
                        )}
                        {result.error && (
                          <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-x-auto text-red-900">
                            {JSON.stringify(sanitizeData(result.error), null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting Tips */}
            {!results.passed && (
              <Card className="mt-6 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <CardTitle className="text-yellow-900">Troubleshooting Tips</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-yellow-900">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Verify your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file contains valid Supabase credentials</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Check that your Supabase project is active and not paused</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Ensure database tables have been created using the SQL schema</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Verify Row Level Security (RLS) policies allow anonymous access for reading</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Check your Supabase project settings and API keys</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>Review the <code className="bg-yellow-100 px-1 rounded">SETUP.md</code> file for complete setup instructions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
