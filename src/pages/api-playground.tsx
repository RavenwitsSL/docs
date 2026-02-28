import React from 'react';
import Layout from '@theme/Layout';
import ApiPlayground from '../components/ApiPlayground';

export default function ApiPlaygroundPage(): JSX.Element {
  return (
    <Layout title="API Playground" description="Try the Ravenwits API directly from the documentation">
      <main style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1>API Playground</h1>
        <p>
          Use the form below to send live requests to <strong>https://api.ravenwits.com</strong>. Enter your
          Bearer token for authenticated endpoints, or leave it empty for the health check and login (login
          uses the request body instead).
        </p>
        <p>
          If you see a network or CORS error, the API may not allow requests from this domain. You can still
          use the <strong>Copy curl</strong> button and run the command in your terminal, or use the{' '}
          <a href="https://api.ravenwits.com/docs/v0/">interactive API docs</a> on the API server.
        </p>
        <ApiPlayground />
      </main>
    </Layout>
  );
}
