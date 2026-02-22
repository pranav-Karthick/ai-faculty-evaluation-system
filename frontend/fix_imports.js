import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixImports(content) {
    // Fix "import * from 'react'" -> "import * as React from 'react'"
    content = content.replace(/import\s+\*\s+from\s+['"]react['"]/g, 'import * as React from "react"');

    // Fix empty imports or trailing commas in named imports
    // e.g. "import { cva, } from" -> "import { cva } from"
    content = content.replace(/import\s*\{([^}]+)\}\s*from/g, (match, body) => {
        let newBody = body.replace(/,\s*,/g, ','); // double commas
        newBody = newBody.replace(/^,/, ''); // leading comma
        newBody = newBody.replace(/,$/, ''); // trailing comma
        newBody = newBody.trim();
        if (newBody.endsWith(',')) newBody = newBody.slice(0, -1);
        return `import { ${newBody} } from`;
    });

    // Fix empty named imports: "import { } from ..." -> remove line
    content = content.replace(/import\s*\{\s*\}\s*from\s+['"][^'"]+['"];?\n?/g, '');

    return content;
}

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const fixed = fixImports(content);
            if (content !== fixed) {
                console.log(`Fixing imports in ${file}`);
                fs.writeFileSync(fullPath, fixed);
            }
        }
    }
}

processDir(path.resolve(__dirname, 'src'));
