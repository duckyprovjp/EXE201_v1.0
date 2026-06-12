const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const mockProviderStr = `
// Mocks
const mockService = {};
const mockModel = {};
`;

function fixSpecFiles(dir) {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.spec.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // If it's a controller spec, it usually needs the Service.
      if (filePath.endsWith('.controller.spec.ts')) {
        const serviceMatch = content.match(/([A-Z][a-zA-Z0-9_]*)Service/);
        if (serviceMatch) {
          const serviceName = serviceMatch[0];
          content = content.replace(
            /providers: \[(.*?)\]/,
            `providers: [{ provide: ${serviceName}, useValue: {} }]`
          );
        }
      }
      
      // If it's a service spec, it might need Models.
      if (filePath.endsWith('.service.spec.ts')) {
        // Just mock all dependencies using a custom module or we can use generic provider
        if (!content.includes('getModelToken')) {
           content = `import { getModelToken } from '@nestjs/mongoose';\n` + content;
        }
        
        // Let's replace providers with a generic one or empty one? 
        // We don't know the exact models. 
      }
      
      // A better way for NestJS specs: use an auto-mocking or deep mocking approach
      // Actually, if we just want to bypass the DI, we can override providers or use module setup.
      // But we must provide the exact tokens.
    }
  });
}

// Since fixing 25 files correctly is hard with simple regex, let's see exactly what's failing.
