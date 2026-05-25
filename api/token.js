const https = require('https');
const url   = require('url');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const TARGET = 'https://eksternapi.fdvweb.no/connect/token/';
  const parsed = new url.URL(TARGET);

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    if (!body) body = 'grant_type=client_credentials';
    const auth = req.headers['authorization'] || '';

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

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', c => data += c);
      apiRes.on('end', () => {
        res.status(apiRes.statusCode)
           .setHeader('Content-Type', 'application/json')
           .end(data);
      });
    });

    apiReq.on('error', (e) => {
      res.status(502).json({ error: e.message });
    });

    apiReq.write(body);
    apiReq.end();
  });
};

