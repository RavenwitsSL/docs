import React, { useState } from 'react';

const API_BASE = 'https://api.ravenwits.com';

const ENDPOINTS = [
  {
    id: 'health',
    label: 'Health check',
    method: 'GET',
    path: '/health/',
    auth: false,
    body: null,
  },
  {
    id: 'login',
    label: 'Login',
    method: 'POST',
    path: '/api/v0/auth/login/',
    auth: false,
    body: { email: 'your-email@example.com', password: 'your-password' },
  },
  {
    id: 'strategies',
    label: 'List strategies',
    method: 'GET',
    path: '/api/v0/strategies/{user}',
    auth: true,
    pathParams: [{ name: 'user', placeholder: 'user-id' }],
    queryParams: [{ name: 'idretailer', placeholder: 'retailer-id' }],
    body: null,
  },
  {
    id: 'forecasts',
    label: 'Latest forecast',
    method: 'GET',
    path: '/api/v0/forecasts/latest/',
    auth: true,
    queryParams: [{ name: 'format', placeholder: 'json', optional: true }],
    body: null,
  },
];

function buildUrl(path: string, pathParams: Record<string, string>, queryParams: Record<string, string>): string {
  let url = path;
  Object.entries(pathParams).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, value || `{${key}}`);
  });
  const search = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return `${API_BASE}${url}${qs ? '?' + qs : ''}`;
}

export default function ApiPlayground(): JSX.Element {
  const [selectedId, setSelectedId] = useState('health');
  const [token, setToken] = useState('');
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [bodyJson, setBodyJson] = useState('');
  const [response, setResponse] = useState<{ status: number; body: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const endpoint = ENDPOINTS.find((e) => e.id === selectedId)!;
  const fullUrl = buildUrl(endpoint.path, pathParams, queryParams);
  const requestBody = endpoint.body ? (bodyJson || JSON.stringify(endpoint.body, null, 2)) : bodyJson;

  const runRequest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(endpoint.method !== 'GET' && requestBody ? { 'Content-Type': 'application/json' } : {}),
      };
      if (endpoint.auth && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(fullUrl, {
        method: endpoint.method,
        headers,
        ...(endpoint.method !== 'GET' && requestBody ? { body: requestBody } : {}),
      });
      const text = await res.text();
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // keep as text
      }
      setResponse({ status: res.status, body });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResponse({
        status: 0,
        body: '',
        error: message.includes('Failed to fetch') || message.includes('NetworkError')
          ? 'Network error. If you see a CORS error in the console, the API may not allow requests from this site. Use the curl examples in the API Reference or try from the same origin.'
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyCurl = () => {
    const parts = [`curl --request ${endpoint.method}`, `  --url '${fullUrl}'`];
    if (endpoint.auth && token) parts.push(`  --header 'Authorization: Bearer ${token}'`);
    parts.push("  --header 'Accept: application/json'");
    if (endpoint.method !== 'GET' && requestBody) {
      parts.push(`  --data '${requestBody.replace(/'/g, "'\\''")}'`);
    }
    navigator.clipboard.writeText(parts.join(' \\\n'));
  };

  return (
    <div className="api-playground" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <strong>CREDENTIALS</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.9rem' }}>Header</span>
          <input
            type="password"
            placeholder="Bearer token (for authenticated endpoints)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '0.35rem 0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
            aria-label="Bearer token"
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>ENDPOINT</strong>
        <div style={{ marginTop: '0.25rem' }}>
          <select
            value={selectedId}
            onChange={(e) => {
              const next = ENDPOINTS.find((x) => x.id === e.target.value)!;
              setSelectedId(e.target.value);
              setPathParams({});
              setQueryParams({});
              setBodyJson(next.body ? JSON.stringify(next.body, null, 2) : '');
            }}
            style={{ padding: '0.35rem 0.5rem', minWidth: '220px', fontSize: '0.9rem' }}
          >
            {ENDPOINTS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.method} {e.path}
              </option>
            ))}
          </select>
        </div>
        {endpoint.pathParams?.map((p) => (
          <div key={p.name} style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>{p.name}:</label>
            <input
              type="text"
              placeholder={p.placeholder}
              value={pathParams[p.name] ?? ''}
              onChange={(e) => setPathParams((prev) => ({ ...prev, [p.name]: e.target.value }))}
              style={{ padding: '0.25rem 0.5rem', fontFamily: 'monospace', width: '180px' }}
            />
          </div>
        ))}
        {endpoint.queryParams?.map((p) => (
          <div key={p.name} style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>{p.name}:</label>
            <input
              type="text"
              placeholder={p.placeholder}
              value={queryParams[p.name] ?? ''}
              onChange={(e) => setQueryParams((prev) => ({ ...prev, [p.name]: e.target.value }))}
              style={{ padding: '0.25rem 0.5rem', fontFamily: 'monospace', width: '180px' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>URL</strong>
        <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {fullUrl}
        </div>
      </div>

      {endpoint.method !== 'GET' && endpoint.body && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>REQUEST BODY</strong>
          <textarea
            value={bodyJson}
            onChange={(e) => setBodyJson(e.target.value)}
            placeholder="JSON body"
            rows={4}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          />
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <strong>REQUEST</strong>
        <pre
          style={{
            marginTop: '0.25rem',
            padding: '0.75rem',
            background: 'var(--ifm-code-background)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            overflow: 'auto',
          }}
        >
          <code>{`curl --request ${endpoint.method} \\
  --url '${fullUrl}' \\
  --header 'Accept: application/json'${
            endpoint.auth && token ? ` \\
  --header 'Authorization: Bearer ***'` : ''
          }${endpoint.method !== 'GET' && requestBody ? ` \\
  --data '...'` : ''}`}</code>
        </pre>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={copyCurl}
            className="button button--secondary"
            style={{ fontSize: '0.85rem' }}
          >
            Copy curl
          </button>
          <button
            type="button"
            onClick={runRequest}
            disabled={loading}
            className="button button--primary"
            style={{ fontSize: '0.85rem' }}
          >
            {loading ? 'Sending…' : 'Try it!'}
          </button>
        </div>
      </div>

      {response && (
        <div style={{ marginTop: '1rem' }}>
          <strong>RESPONSE</strong>
          {response.error ? (
            <div
              style={{
                marginTop: '0.25rem',
                padding: '0.75rem',
                background: 'var(--ifm-color-danger)',
                color: 'var(--ifm-color-danger-contrast-background)',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}
            >
              {response.error}
            </div>
          ) : (
            <>
              <div
                style={{
                  marginTop: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: response.status >= 200 && response.status < 300 ? 'var(--ifm-color-success)' : 'var(--ifm-color-warning)',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                  {response.status}
                </span>
              </div>
              <pre
                style={{
                  marginTop: '0.25rem',
                  padding: '0.75rem',
                  background: 'var(--ifm-code-background)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  overflow: 'auto',
                  maxHeight: '300px',
                }}
              >
                <code>{response.body || '(empty)'}</code>
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
