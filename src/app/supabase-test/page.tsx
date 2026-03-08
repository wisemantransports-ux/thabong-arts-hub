import { createClient } from '@/lib/supabase/server';

export default async function SupabaseTestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let connectionStatus = '';
  let errorMessage = '';
  let dataResult = '';

  // Log to server console for debugging
  console.log('--- Supabase Connection Test ---');
  console.log('Loaded URL:', supabaseUrl);
  console.log('Loaded Key:', supabaseAnonKey ? 'Exists' : 'MISSING');
  console.log('---------------------------------');

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-url')) {
    connectionStatus = 'Configuration Error';
    errorMessage = 'Your NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or using placeholder values in .env.local. Please check your configuration and restart the server.';
  } else {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('artists').select('id').limit(1);

      if (error) {
        connectionStatus = 'Connection Failed';
        errorMessage = error.message;
        if (error.message.includes('fetch failed')) {
            errorMessage += ' This often means the URL is incorrect or there is a network issue (like a firewall or proxy) blocking the connection.';
        } else if (error.message.includes('Invalid API key') || error.message.includes('invalid JWT')) {
            errorMessage += ' Please double-check your NEXT_PUBLIC_SUPABASE_ANON_KEY.';
        }
      } else {
        connectionStatus = 'Connection Successful!';
        dataResult = JSON.stringify(data, null, 2);
      }
    } catch (e: any) {
      connectionStatus = 'Unhandled Exception';
      errorMessage = e.message || 'An unknown error occurred.';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 font-sans">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Supabase Connection Test</h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Loaded Environment Variables:</h2>
            <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm break-all">
              <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl || 'Not found'}</p>
              <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey ? '********' + supabaseAnonKey.slice(-4) : 'Not found'}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Note: The full values are logged in your server terminal when you load this page.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Test Result:</h2>
            <div className={`mt-2 p-4 rounded-md text-white ${connectionStatus === 'Connection Successful!' ? 'bg-green-600' : 'bg-red-600'}`}>
              <p className="font-bold text-xl">{connectionStatus}</p>
            </div>
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <h3 className="font-bold">Error Details:</h3>
                <p>{errorMessage}</p>
              </div>
            )}
            {dataResult && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <h3 className="font-bold">Data Received:</h3>
                <pre className="mt-2 text-sm">{dataResult}</pre>
                <p className="mt-2">Successfully fetched data from the 'artists' table.</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600">
            <p className="font-bold">Next Steps:</p>
            <ul className="text-left list-disc list-inside mt-2 text-sm">
                <li>If there is a <strong>Configuration Error</strong>, please ensure your <code>.env.local</code> file exists, contains the correct variable names, and that you've restarted the development server after creating/editing it.</li>
                <li>If there is a <strong>Connection Failure</strong>, please verify your Supabase URL and Anon Key are correct. Also, check for any firewall or network issues.</li>
                <li>If the connection is <strong>Successful</strong>, the issue lies elsewhere in the application logic. The credentials are correct.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
