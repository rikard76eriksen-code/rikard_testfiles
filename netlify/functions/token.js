const https = require('https');
const url   = require('url');

exports.handler = async (event, context) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const TARGET = 'https://eksternapi.fdvweb.no/connect/token/';
  const parsed = new url.URL(TARGET);
  const body   = event.body || 'grant_type=client_credentials';
  const auth   = (event.headers && (event.headers.authorization || event.headers.Authorization)) || '';

  return new Promise((resolve) => {
    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type':   'application/x-www-form-urlencoded',
        'Authorization':  auth,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: { 'Content-Type': 'application/json', ...CORS },
        body: data,
      }));
    });

    req.on('error', (e) => resolve({
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', ...CORS },
      body: JSON.stringify({ error: e.message }),
    }));

    req.write(body);
    req.end();
  });
};
