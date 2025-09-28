import { Page, Locator } from '@playwright/test';

export interface ClickableControl {
  locator: Locator;
  text: string;
  type: 'button' | 'link' | 'tab' | 'accordion' | 'form' | 'pagination' | 'filter';
  isSafe: boolean;
  reason?: string;
}

export async function discoverControls(page: Page): Promise<ClickableControl[]> {
  const controls: ClickableControl[] = [];
  
  // Buttons
  const buttons = page.locator('button, [role="button"]');
  const buttonCount = await buttons.count();
  
  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);
    const text = (await button.textContent()) || '';
    const isVisible = await button.isVisible();
    
    if (!isVisible) continue;
    
    const isSafe = isSafeButton(text, button);
    controls.push({
      locator: button,
      text: text.trim(),
      type: 'button',
      isSafe: isSafe.safe,
      reason: isSafe.reason
    });
  }
  
  // Links (excluding external)
  const links = page.locator('a[href]:not([target="_blank"]):not([href^="http"]):not([href^="mailto:"]):not([href^="tel:"])');
  const linkCount = await links.count();
  
  for (let i = 0; i < linkCount; i++) {
    const link = links.nth(i);
    const text = (await link.textContent()) || '';
    const isVisible = await link.isVisible();
    
    if (!isVisible) continue;
    
    const isSafe = isSafeLink(text, link);
    controls.push({
      locator: link,
      text: text.trim(),
      type: 'link',
      isSafe: isSafe.safe,
      reason: isSafe.reason
    });
  }
  
  // Tabs
  const tabs = page.locator('[role="tab"], .tab, [data-tab]');
  const tabCount = await tabs.count();
  
  for (let i = 0; i < tabCount; i++) {
    const tab = tabs.nth(i);
    const text = (await tab.textContent()) || '';
    const isVisible = await tab.isVisible();
    
    if (!isVisible) continue;
    
    controls.push({
      locator: tab,
      text: text.trim(),
      type: 'tab',
      isSafe: true
    });
  }
  
  // Accordion triggers
  const accordions = page.locator('[role="button"][aria-expanded], .accordion-trigger, [data-accordion]');
  const accordionCount = await accordions.count();
  
  for (let i = 0; i < accordionCount; i++) {
    const accordion = accordions.nth(i);
    const text = (await accordion.textContent()) || '';
    const isVisible = await accordion.isVisible();
    
    if (!isVisible) continue;
    
    controls.push({
      locator: accordion,
      text: text.trim(),
      type: 'accordion',
      isSafe: true
    });
  }
  
  // Pagination
  const pagination = page.locator('.pagination a, .pagination button, [aria-label*="page" i]');
  const paginationCount = await pagination.count();
  
  for (let i = 0; i < paginationCount; i++) {
    const pag = pagination.nth(i);
    const text = (await pag.textContent()) || '';
    const isVisible = await pag.isVisible();
    
    if (!isVisible) continue;
    
    controls.push({
      locator: pag,
      text: text.trim(),
      type: 'pagination',
      isSafe: true
    });
  }
  
  return controls;
}

function isSafeButton(text: string, locator: Locator): { safe: boolean; reason?: string } {
  const lowerText = text.toLowerCase();
  
  // Dangerous actions
  const dangerousKeywords = [
    'delete', 'remove', 'destroy', 'cancel', 'abort',
    'danger', 'warning', 'irreversible', 'permanent'
  ];
  
  for (const keyword of dangerousKeywords) {
    if (lowerText.includes(keyword)) {
      return { safe: false, reason: `Contains dangerous keyword: ${keyword}` };
    }
  }
  
  // Check for danger attributes
  const hasDangerAttr = locator.getAttribute('data-test')?.then(attr => 
    attr?.includes('danger') || false
  );
  
  // Safe actions
  const safeKeywords = [
    'save', 'apply', 'submit', 'next', 'continue', 'generate',
    'download', 'export', 'view', 'show', 'hide', 'toggle',
    'refresh', 'reload', 'filter', 'search', 'sort'
  ];
  
  for (const keyword of safeKeywords) {
    if (lowerText.includes(keyword)) {
      return { safe: true };
    }
  }
  
  // Default to safe for buttons without clear danger indicators
  return { safe: true };
}

function isSafeLink(text: string, locator: Locator): { safe: boolean; reason?: string } {
  const lowerText = text.toLowerCase();
  
  // Dangerous actions
  const dangerousKeywords = [
    'delete', 'remove', 'destroy', 'cancel', 'abort'
  ];
  
  for (const keyword of dangerousKeywords) {
    if (lowerText.includes(keyword)) {
      return { safe: false, reason: `Contains dangerous keyword: ${keyword}` };
    }
  }
  
  return { safe: true };
}

export async function safeClick(locator: Locator, page: Page): Promise<{ success: boolean; error?: string }> {
  try {
    // Ensure element is visible and enabled
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if element is enabled
    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      return { success: false, error: 'Element is disabled' };
    }
    
    // Click the element
    await locator.click();
    
    // Wait for any network activity to settle
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function fillFormFields(page: Page): Promise<{ filled: number; skipped: number; errors: string[] }> {
  const result = { filled: 0, skipped: 0, errors: [] as string[] };
  
  try {
    // Find text inputs with placeholders
    const textInputs = page.locator('input[type="text"], input[type="email"], input[type="url"], textarea');
    const inputCount = await textInputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = textInputs.nth(i);
      const isVisible = await input.isVisible();
      const isEnabled = await input.isEnabled();
      const hasValue = await input.inputValue();
      
      if (!isVisible || !isEnabled || hasValue) {
        result.skipped++;
        continue;
      }
      
      const placeholder = await input.getAttribute('placeholder') || '';
      const name = await input.getAttribute('name') || '';
      const id = await input.getAttribute('id') || '';
      
      // Generate appropriate test data
      let testValue = '';
      if (placeholder.toLowerCase().includes('email') || name.toLowerCase().includes('email')) {
        testValue = 'test@example.com';
      } else if (placeholder.toLowerCase().includes('url') || name.toLowerCase().includes('url')) {
        testValue = 'https://example.com';
      } else if (placeholder.toLowerCase().includes('name') || name.toLowerCase().includes('name')) {
        testValue = 'Test User';
      } else if (placeholder.toLowerCase().includes('title') || name.toLowerCase().includes('title')) {
        testValue = 'Test Title';
      } else if (placeholder.toLowerCase().includes('description') || name.toLowerCase().includes('description')) {
        testValue = 'Test description for audit purposes';
      } else {
        testValue = 'Test Value';
      }
      
      try {
        await input.fill(testValue);
        result.filled++;
      } catch (error) {
        result.errors.push(`Failed to fill input ${i}: ${error}`);
        result.skipped++;
      }
    }
  } catch (error) {
    result.errors.push(`Form filling error: ${error}`);
  }
  
  return result;
}
