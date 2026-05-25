const https = require('https');
const url   = require('url');

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  const TARGET = 'https://eksternapi.fdvweb.no/connect/token/';
  const parsed = new url.URL(TARGET);

  return new Promise((resolve) => {
    const body = event.body || '';
    const auth = (event.headers && event.headers.authorization) || '';

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
