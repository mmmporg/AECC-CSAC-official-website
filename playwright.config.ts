import { defineConfig, devices } from '@playwright/test';
import path from 'path';

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://127.0.0.1:3210',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      `powershell -NoProfile -Command "$existing = netstat -ano | Select-String '127.0.0.1:3210' | Select-Object -First 1; if ($existing) { $portProcessId = (($existing -split '\\s+')[-1]); if ($portProcessId -match '^\\d+$') { taskkill /PID $portProcessId /F | Out-Null } }; if (Test-Path .next) { Remove-Item -Recurse -Force .next }; npm run build; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npx next start --hostname 127.0.0.1 --port 3210"`,
    url: 'http://127.0.0.1:3210',
    reuseExistingServer: false,
    timeout: 300000,
  },
});
