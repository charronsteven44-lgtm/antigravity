const { spawn } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 3000;
const SERVER_CMD = process.execPath; // node
const SERVER_ARGS = ['server.js'];
const TEST_CMD = process.execPath;
const TEST_ARGS = ['test/run-questionnaire-test.js'];

function waitForServer(timeoutMs = 20000, intervalMs = 300) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function ping() {
      const req = http.request({ method: 'GET', host: '127.0.0.1', port: PORT, path: '/questionnaire', timeout: 2000 }, (res) => {
        if (res.statusCode === 200) return resolve();
        res.resume();
        if (Date.now() - start > timeoutMs) return reject(new Error('Timeout waiting for server'));
        setTimeout(ping, intervalMs);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('Timeout waiting for server'));
        setTimeout(ping, intervalMs);
      });
      req.end();
    })();
  });
}

async function main() {
  console.log('Starting server...');
  const server = spawn(SERVER_CMD, SERVER_ARGS, { stdio: ['ignore', 'inherit', 'inherit'] });

  server.on('exit', (code, sig) => {
    console.log(`Server exited (code=${code} sig=${sig})`);
  });

  try {
    await waitForServer();
    console.log('Server is ready. Running questionnaire test...');
    const test = spawn(TEST_CMD, TEST_ARGS, { stdio: 'inherit' });
    test.on('exit', (code) => {
      console.log(`Test process exited with code ${code}`);
      // attempt to gracefully kill server
      try { server.kill(); } catch (e) {}
      process.exit(code === 0 ? 0 : 2);
    });
  } catch (e) {
    console.error('Error waiting for server:', e && e.message);
    try { server.kill(); } catch (err) {}
    process.exit(3);
  }
}

main();
