import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME_PATH =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9339;
const APP_URL = 'http://127.0.0.1:4180/invite/289';
const QA_DIR = path.resolve('qa');

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const startApiFixture = (fixtureState) =>
  new Promise((resolve, reject) => {
    const server = createServer((request, response) => {
      response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4180');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      response.setHeader('Content-Type', 'application/json; charset=utf-8');

      if (request.method === 'OPTIONS') {
        response.statusCode = 204;
        response.end();
        return;
      }

      if (request.url?.startsWith('/api/remaining-time')) {
        const serverTime = new Date();
        const remainingTime = Math.max(0, fixtureState.remainingTimeMs);
        response.end(
          JSON.stringify({
            invitationId: '289',
            remaining_time_milliseconds: remainingTime,
            target_at: new Date(serverTime.getTime() + remainingTime).toISOString(),
            server_time: serverTime.toISOString(),
          })
        );
        return;
      }

      if (request.url === '/api/vote' && request.method === 'POST') {
        response.statusCode = 201;
        response.end(JSON.stringify({ message: 'Response saved' }));
        return;
      }

      response.statusCode = 404;
      response.end(JSON.stringify({ message: 'Not found' }));
    });

    server.once('error', reject);
    server.listen(5000, '127.0.0.1', () => resolve(server));
  });

class CdpClient {
  constructor(webSocketUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.socket = new WebSocket(webSocketUrl);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });

    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending?.reject(new Error(message.error.message));
        else pending?.resolve(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() {
    this.socket.close();
  }
}

const waitForChrome = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`).then(
        (response) => response.json()
      );
      const page = targets.find((target) => target.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await delay(100);
  }
  throw new Error('Chrome DevTools endpoint did not become ready');
};

const waitForPage = async (client) => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const result = await client.send('Runtime.evaluate', {
      expression: 'document.readyState',
      returnByValue: true,
    });
    if (result.result?.value === 'complete') break;
    await delay(100);
  }

  await client.send('Runtime.evaluate', {
    expression: `Promise.all([
      document.fonts?.ready,
      ...Array.from(document.images).map((image) => image.decode?.().catch(() => undefined))
    ])`,
    awaitPromise: true,
  });
  await delay(500);
};

const capture = async (client, filename) => {
  const screenshot = await client.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(path.join(QA_DIR, filename), screenshot.data, 'base64');
};

const navigate = async (client, viewport, suffix = '') => {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await client.send('Emulation.setTouchEmulationEnabled', {
    enabled: viewport.mobile,
    maxTouchPoints: viewport.mobile ? 5 : 1,
  });
  await client.send('Page.navigate', { url: `${APP_URL}${suffix}` });
  await waitForPage(client);
};

const captureDesktopComparison = async (client) => {
  const [source, implementation] = await Promise.all([
    readFile(path.join(QA_DIR, 'design-reference-option-3.png'), 'base64'),
    readFile(path.join(QA_DIR, 'opening-desktop.png'), 'base64'),
  ]);
  const frameTree = await client.send('Page.getFrameTree');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1488,
    height: 590,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.setDocumentContent', {
    frameId: frameTree.frameTree.frame.id,
    html: `<!doctype html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            html, body { margin: 0; width: 100%; height: 100%; background: #24211d; }
            body { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; font: 600 14px Arial, sans-serif; color: white; }
            figure { margin: 0; min-width: 0; display: grid; grid-template-rows: 24px 1fr; gap: 6px; }
            figcaption { letter-spacing: .08em; text-transform: uppercase; }
            img { display: block; width: 100%; height: 524px; object-fit: contain; background: #17130f; }
          </style>
        </head>
        <body>
          <figure><figcaption>Selected design</figcaption><img src="data:image/png;base64,${source}" /></figure>
          <figure><figcaption>Browser implementation</figcaption><img src="data:image/png;base64,${implementation}" /></figure>
        </body>
      </html>`,
  });
  await delay(300);
  await capture(client, 'comparison-desktop.png');
};

const main = async () => {
  await mkdir(QA_DIR, { recursive: true });
  const profile = await mkdtemp(path.join(tmpdir(), 'wedding-chrome-qa-'));
  const fixtureState = { remainingTimeMs: 1000 * 60 * 60 * 24 * 120 };
  const apiFixture = await startApiFixture(fixtureState);
  const chrome = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore', windowsHide: true }
  );

  let client;
  try {
    const webSocketUrl = await waitForChrome();
    client = new CdpClient(webSocketUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');
    await client.send('Log.enable');
    await client.send('Accessibility.enable');

    await navigate(client, { width: 1488, height: 1058, mobile: false });
    await capture(client, 'opening-desktop.png');

    const accessibility = await client.send('Accessibility.getFullAXTree');
    const openButton = accessibility.nodes.find(
      (node) =>
        node.role?.value === 'button' &&
        node.name?.value?.includes('Հակոբի և Լիլիթի')
    );
    if (!openButton) throw new Error('Accessible invitation-open button not found');

    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.openingCover__open')?.click()`,
      returnByValue: true,
    });
    await delay(1100);
    const desktopState = await client.send('Runtime.evaluate', {
      expression: `({
        coverRemoved: !document.querySelector('.openingCover'),
        contentVisible: Boolean(document.querySelector('main .header'))
      })`,
      returnByValue: true,
    });
    if (!desktopState.result?.value?.coverRemoved) {
      throw new Error('Opening interaction did not reveal the invitation');
    }
    await capture(client, 'invitation-desktop.png');

    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.countdown')?.scrollIntoView({ block: 'center' })`,
    });
    await delay(900);
    const countdownBefore = await client.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-testid="countdown-seconds"]')?.textContent`,
      returnByValue: true,
    });
    await delay(1100);
    const countdownAfter = await client.send('Runtime.evaluate', {
      expression: `document.querySelector('[data-testid="countdown-seconds"]')?.textContent`,
      returnByValue: true,
    });
    if (
      countdownBefore.result?.value == null ||
      countdownBefore.result.value === countdownAfter.result?.value
    ) {
      throw new Error('Countdown was not visible or did not update in real time');
    }
    await capture(client, 'countdown-desktop.png');

    await navigate(
      client,
      { width: 390, height: 844, mobile: true },
      '?qa=mobile'
    );
    await capture(client, 'opening-mobile.png');
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.openingCover__open')?.click()`,
    });
    await delay(1100);
    await capture(client, 'invitation-mobile.png');
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.countdown')?.scrollIntoView({ block: 'center' })`,
    });
    await delay(900);
    await capture(client, 'countdown-mobile.png');

    fixtureState.remainingTimeMs = 0;
    await navigate(
      client,
      { width: 390, height: 844, mobile: true },
      '?qa=expired'
    );
    await client.send('Runtime.evaluate', {
      expression: `document.querySelector('.openingCover__open')?.click()`,
    });
    await delay(1400);
    const celebrationState = await client.send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('.celebration'))`,
      returnByValue: true,
    });
    if (!celebrationState.result?.value) {
      throw new Error('Expired countdown did not start the celebration');
    }
    await capture(client, 'celebration-mobile.png');
    await captureDesktopComparison(client);

    const errors = client.events
      .filter(
        (event) =>
          event.method === 'Runtime.exceptionThrown' ||
          (event.method === 'Log.entryAdded' &&
            ['error', 'warning'].includes(event.params?.entry?.level))
      )
      .map((event) => ({ method: event.method, params: event.params }));

    await writeFile(
      path.join(QA_DIR, 'browser-console.json'),
      `${JSON.stringify(errors, null, 2)}\n`
    );
    await writeFile(
      path.join(QA_DIR, 'accessibility.json'),
      `${JSON.stringify({
        openButton,
        desktopState: desktopState.result.value,
        countdown: {
          before: countdownBefore.result.value,
          after: countdownAfter.result.value,
        },
        celebrationVisible: celebrationState.result.value,
      }, null, 2)}\n`
    );

    process.stdout.write(
      `${JSON.stringify({
        screenshots: [
          'qa/opening-desktop.png',
          'qa/invitation-desktop.png',
          'qa/countdown-desktop.png',
          'qa/opening-mobile.png',
          'qa/invitation-mobile.png',
          'qa/countdown-mobile.png',
          'qa/celebration-mobile.png',
          'qa/comparison-desktop.png',
        ],
        consoleErrors: errors.length,
        interaction: desktopState.result.value,
      })}\n`
    );
  } finally {
    client?.close();
    const chromeExited =
      chrome.exitCode !== null
        ? Promise.resolve()
        : new Promise((resolve) => chrome.once('exit', resolve));
    chrome.kill();
    await Promise.race([chromeExited, delay(3000)]);
    apiFixture.closeAllConnections?.();
    await new Promise((resolve) => apiFixture.close(resolve));
    if (path.basename(profile).startsWith('wedding-chrome-qa-')) {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await rm(profile, { recursive: true, force: true });
          break;
        } catch (error) {
          if (attempt === 4) throw error;
          await delay(250);
        }
      }
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
