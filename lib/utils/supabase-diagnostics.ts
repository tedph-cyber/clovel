/**
 * Supabase Connection Test Utility
 * Use this to diagnose database connection issues
 */

import { supabase } from '@/lib/supabase/client';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
  error?: any;
}

/**
 * Test basic Supabase connection
 */
export async function testConnection(): Promise<ConnectionTestResult> {
  try {
    const { data, error } = await supabase
      .from('novels')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return {
        success: false,
        message: 'Database connection failed',
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase',
      details: { count: data },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Connection test failed',
      error: error.message,
    };
  }
}

/**
 * Test if tables exist and are accessible
 */
export async function testTables(): Promise<Record<string, ConnectionTestResult>> {
  const tables = ['novels', 'chapters', 'authors', 'reading_progress', 'bookmarks'];
  const results: Record<string, ConnectionTestResult> = {};

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        results[table] = {
          success: false,
          message: `Table '${table}' query failed`,
          error: {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          },
        };
      } else {
        results[table] = {
          success: true,
          message: `Table '${table}' is accessible`,
          details: { rowCount: data?.length || 0 },
        };
      }
    } catch (error: any) {
      results[table] = {
        success: false,
        message: `Table '${table}' test failed`,
        error: error.message,
      };
    }
  }

  return results;
}

/**
 * Check environment variables
 */
export function testEnvironmentVariables(): ConnectionTestResult {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      success: false,
      message: 'Environment variables not configured',
      details: {
        url: url ? '✓ Set' : '✗ Missing',
        key: key ? '✓ Set' : '✗ Missing',
      },
    };
  }

  // Check if URL is valid
  try {
    new URL(url);
  } catch {
    return {
      success: false,
      message: 'Invalid Supabase URL format',
      details: { url },
    };
  }

  return {
    success: true,
    message: 'Environment variables are configured',
    details: {
      url: url.substring(0, 30) + '...',
      keyLength: key.length,
    },
  };
}

/**
 * Test sample queries
 */
export async function testSampleQueries(): Promise<Record<string, ConnectionTestResult>> {
  const results: Record<string, ConnectionTestResult> = {};

  // Test 1: Fetch novels
  try {
    const { data, error } = await supabase
      .from('novels')
      .select('id, title, slug, author_id')
      .limit(5);

    if (error) {
      results.fetchNovels = {
        success: false,
        message: 'Failed to fetch novels',
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      };
    } else {
      results.fetchNovels = {
        success: true,
        message: `Successfully fetched ${data?.length || 0} novels`,
        details: { count: data?.length, samples: data?.slice(0, 2) },
      };
    }
  } catch (error: any) {
    results.fetchNovels = {
      success: false,
      message: 'Exception while fetching novels',
      error: error.message,
    };
  }

  // Test 2: Fetch novels with author join
  try {
    const { data, error } = await supabase
      .from('novels')
      .select(`
        id,
        title,
        author:authors (
          id,
          name
        )
      `)
      .limit(3);

    if (error) {
      results.fetchNovelsWithAuthor = {
        success: false,
        message: 'Failed to fetch novels with author join',
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
        },
      };
    } else {
      results.fetchNovelsWithAuthor = {
        success: true,
        message: `Successfully fetched ${data?.length || 0} novels with authors`,
        details: { count: data?.length, samples: data?.slice(0, 2) },
      };
    }
  } catch (error: any) {
    results.fetchNovelsWithAuthor = {
      success: false,
      message: 'Exception while fetching novels with authors',
      error: error.message,
    };
  }

  // Test 3: Check foreign key relationship
  try {
    const { data, error } = await supabase
      .from('authors')
      .select('id, name')
      .limit(3);

    if (error) {
      results.fetchAuthors = {
        success: false,
        message: 'Failed to fetch authors',
        error: {
          message: error.message,
          details: error.details,
        },
      };
    } else {
      results.fetchAuthors = {
        success: true,
        message: `Successfully fetched ${data?.length || 0} authors`,
        details: { count: data?.length, samples: data },
      };
    }
  } catch (error: any) {
    results.fetchAuthors = {
      success: false,
      message: 'Exception while fetching authors',
      error: error.message,
    };
  }

  return results;
}

/**
 * Run comprehensive diagnostics
 */
export async function runDiagnostics() {
  console.log('🔍 Running Supabase Diagnostics...\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Testing Environment Variables...');
  const envResult = testEnvironmentVariables();
  console.log(envResult.success ? '✅' : '❌', envResult.message);
  if (envResult.details) console.log('   Details:', envResult.details);
  if (envResult.error) console.error('   Error:', envResult.error);
  console.log('');

  // Test 2: Basic Connection
  console.log('2️⃣ Testing Supabase Connection...');
  const connResult = await testConnection();
  console.log(connResult.success ? '✅' : '❌', connResult.message);
  if (connResult.details) console.log('   Details:', connResult.details);
  if (connResult.error) console.error('   Error:', connResult.error);
  console.log('');

  // Test 3: Table Access
  console.log('3️⃣ Testing Table Access...');
  const tableResults = await testTables();
  for (const [table, result] of Object.entries(tableResults)) {
    console.log(result.success ? '✅' : '❌', result.message);
    if (!result.success && result.error) {
      console.error(`   Error:`, result.error);
    }
  }
  console.log('');

  // Test 4: Sample Queries
  console.log('4️⃣ Testing Sample Queries...');
  const queryResults = await testSampleQueries();
  for (const [query, result] of Object.entries(queryResults)) {
    console.log(result.success ? '✅' : '❌', result.message);
    if (result.details) console.log('   Details:', result.details);
    if (result.error) console.error('   Error:', result.error);
  }
  console.log('');

  // Summary
  const allTests = [
    envResult,
    connResult,
    ...Object.values(tableResults),
    ...Object.values(queryResults),
  ];
  const passedTests = allTests.filter(t => t.success).length;
  const totalTests = allTests.length;

  console.log('📊 Summary:');
  console.log(`   ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('   ✅ All tests passed! Your Supabase connection is working correctly.');
  } else {
    console.log('   ❌ Some tests failed. Please check the errors above.');
  }

  return {
    passed: passedTests === totalTests,
    total: totalTests,
    passed_count: passedTests,
    results: {
      environment: envResult,
      connection: connResult,
      tables: tableResults,
      queries: queryResults,
    },
  };
}
