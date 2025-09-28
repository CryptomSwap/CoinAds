#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface ButtonInfo {
  file: string;
  line: number;
  text: string;
  type: string;
  onClick?: string;
  href?: string;
  status: 'WORKING' | 'NO-OP' | 'BROKEN' | 'AUTH-GATED' | 'MISSING-TARGET';
  notes?: string;
}

class ButtonScanner {
  private buttons: ButtonInfo[] = [];
  private sourceFiles: string[] = [];

  constructor() {
    this.scanDirectory('app');
    this.scanDirectory('components');
  }

  private scanDirectory(dir: string) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(fullPath, file.name);
      
      if (file.isDirectory()) {
        this.scanDirectory(path.join(dir, file.name));
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        this.sourceFiles.push(filePath);
      }
    }
  }

  private analyzeFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      this.analyzeContent(content, filePath);
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error);
    }
  }

  private analyzeContent(content: string, filePath: string) {
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // Look for button patterns
      if (this.isButtonLine(line)) {
        const buttonInfo = this.extractButtonInfo(line, lineNumber, filePath, content);
        if (buttonInfo) {
          this.buttons.push(buttonInfo);
        }
      }
    }
  }

  private isButtonLine(line: string): boolean {
    const buttonPatterns = [
      /<Button/,
      /<button/,
      /<Link/,
      /<a\s+href/,
      /onClick=/,
      /role="button"/,
      /data-testid.*button/,
      /aria-label.*button/
    ];
    
    return buttonPatterns.some(pattern => pattern.test(line));
  }

  private extractButtonInfo(line: string, lineNumber: number, filePath: string, content: string): ButtonInfo | null {
    // Extract text content
    const textMatch = line.match(/>([^<]+)</);
    const text = textMatch ? textMatch[1].trim() : 'Unknown';
    
    // Extract onClick
    const onClickMatch = line.match(/onClick=\{([^}]+)\}/);
    const onClick = onClickMatch ? onClickMatch[1] : undefined;
    
    // Extract href
    const hrefMatch = line.match(/href=["']([^"']+)["']/);
    const href = hrefMatch ? hrefMatch[1] : undefined;
    
    // Determine type
    let type = 'Unknown';
    if (line.includes('<Button')) type = 'Button';
    else if (line.includes('<button')) type = 'button';
    else if (line.includes('<Link')) type = 'Link';
    else if (line.includes('<a')) type = 'a';
    
    // Determine status
    const status = this.determineStatus(onClick, href, text, content);
    
    return {
      file: path.relative(process.cwd(), filePath),
      line: lineNumber,
      text,
      type,
      onClick,
      href,
      status
    };
  }

  private determineStatus(onClick?: string, href?: string, text?: string, fileContent?: string): ButtonInfo['status'] {
    // Check for NO-OP patterns
    if (onClick && (
      onClick.includes('alert(') ||
      onClick.includes('console.log') ||
      onClick.includes('// TODO') ||
      onClick.includes('() => {}') ||
      onClick.includes('() => { }')
    )) {
      return 'NO-OP';
    }

    // Check for broken patterns
    if (onClick && (
      onClick.includes('throw new Error') ||
      onClick.includes('undefined') ||
      onClick.includes('null')
    )) {
      return 'BROKEN';
    }

    // Check for missing targets
    if (href && (
      href === '#' ||
      href === '' ||
      href.includes('javascript:void(0)')
    )) {
      return 'MISSING-TARGET';
    }

    // Check for auth-gated patterns
    if (fileContent && (
      fileContent.includes('RequireAuth') ||
      fileContent.includes('useSession') ||
      fileContent.includes('getServerSession')
    )) {
      return 'AUTH-GATED';
    }

    // Default to working if we have some action
    if (onClick || href) {
      return 'WORKING';
    }

    return 'NO-OP';
  }

  public scan(): ButtonInfo[] {
    for (const filePath of this.sourceFiles) {
      this.analyzeFile(filePath);
    }
    return this.buttons;
  }
}

// Main execution
if (require.main === module) {
  const scanner = new ButtonScanner();
  const buttons = scanner.scan();
  
  console.log(`Found ${buttons.length} buttons/clickable elements`);
  
  // Group by status
  const byStatus = buttons.reduce((acc, button) => {
    acc[button.status] = (acc[button.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\nStatus breakdown:');
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  
  // Save to file
  const outputPath = path.join(process.cwd(), 'tools', '.artifacts', 'button-scan.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(buttons, null, 2));
  
  console.log(`\nResults saved to: ${outputPath}`);
}