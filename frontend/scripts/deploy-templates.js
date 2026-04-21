import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const templatesDir = path.join(rootDir, 'templates');
const distTemplatesDir = path.join(rootDir, 'dist', 'templates');

// Ensure the target dist/templates exists
if (!fs.existsSync(distTemplatesDir)) {
    fs.mkdirSync(distTemplatesDir, { recursive: true });
}

// Read all folders inside /templates
const templates = fs.readdirSync(templatesDir).filter(file => {
    return fs.statSync(path.join(templatesDir, file)).isDirectory();
});

templates.forEach(template => {
    const templateDist = path.join(templatesDir, template, 'dist');
    const targetDist = path.join(distTemplatesDir, template);

    if (fs.existsSync(templateDist)) {
        console.log(`Copying built template: ${template} to dist/templates/${template}`);
        
        // Use recursive copy
        fs.cpSync(templateDist, targetDist, { recursive: true });
    } else {
        console.log(`Skipped template ${template}: No dist folder found. Ensure it built successfully.`);
    }
});

console.log('Template deployment build completed!');
