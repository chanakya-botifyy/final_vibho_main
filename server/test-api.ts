import fetch from 'node-fetch';

const urls = [
  'http://localhost:3001/api/auth',
  'http://localhost:3001/api/employees',
  'http://localhost:3001/api/attendance',
  'http://localhost:3001/api/leave',
  'http://localhost:3001/api/payroll'
];

(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`GET ${url} - Status: ${res.status}`);
      const text = await res.text();
      console.log(text);
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
    }
  }
})();
