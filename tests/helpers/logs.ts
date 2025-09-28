import { Page } from '@playwright/test';

export interface LogCollector {
  consoleMessages: Array<{
    type: 'log' | 'info' | 'warn' | 'error';
    text: string;
    timestamp: number;
  }>;
  networkErrors: Array<{
    url: string;
    status: number;
    statusText: string;
    method: string;
    timestamp: number;
  }>;
}

export function attachLogCollectors(page: Page): LogCollector {
  const collector: LogCollector = {
    consoleMessages: [],
    networkErrors: []
  };

  // Collect console messages
  page.on('console', (msg) => {
    const type = msg.type() as 'log' | 'info' | 'warn' | 'error';
    collector.consoleMessages.push({
      type,
      text: msg.text(),
      timestamp: Date.now()
    });
  });

  // Collect failed network requests
  page.on('response', (response) => {
    if (response.status() >= 400) {
      collector.networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        method: response.request().method(),
        timestamp: Date.now()
      });
    }
  });

  return collector;
}

export function getConsoleErrors(collector: LogCollector): string[] {
  return collector.consoleMessages
    .filter(msg => msg.type === 'error')
    .map(msg => msg.text);
}

export function getConsoleWarnings(collector: LogCollector): string[] {
  return collector.consoleMessages
    .filter(msg => msg.type === 'warn')
    .map(msg => msg.text);
}

export function getFailedRequests(collector: LogCollector): Array<{
  url: string;
  status: number;
  statusText: string;
  method: string;
}> {
  return collector.networkErrors.map(error => ({
    url: error.url,
    status: error.status,
    statusText: error.statusText,
    method: error.method
  }));
}
