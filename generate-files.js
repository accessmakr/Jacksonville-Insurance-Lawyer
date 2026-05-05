/**
 * generate-files.js
 * 
 * This script automatically scans the repository for .html files and generates:
 * 1. A clean-URL sitemap.xml (Root directory)
 * 2. A pages.json data file (Root directory)
 * 3. A registry.js file for your frontend scripts (js/ directory)
 */

const fs = require('fs');
const path = require('path');

// Target domain from the blueprint
const BASE_URL = 'https://jacksonvilleinsurancelawyer.com';

// The exact list of directories to scan, based on your blueprint
const FOLDERS = [
    'guide', 'answer', 'lawyer', 'location', 'compare', 
    'claims', 'settlement', 'bad-faith', 'small-claims', 
    'resources', 'reviews', 'calculator', 'statute'
];

const pages = [];

/**
 * Helper function to format clean URLs
 * Ensures /index.html becomes / and /folder/page.html becomes /folder/page/
 */
function createCleanUrl(folder, filename) {
    if (folder === 'root') {
        if (filename === 'index.html') return `${BASE_URL}/`;
        return `${BASE_URL}/${filename.replace('.html', '')}/`;
    } else {
        if (filename === 'index.html') return `${BASE_URL}/${folder}/`;
        return `${BASE_URL}/${folder}/${filename.replace('.html', '')}/`;
    }
}

try {
    console.log('Starting file generation process...');

    // 1. Process root directory for index.html and legal/policy pages
    const rootFiles = fs.readdirSync(__dirname);
    rootFiles.forEach(file => {
        // Only target HTML files, ignore node_modules or hidden folders
        if (fs.statSync(file).isFile() && file.endsWith('.html')) {
            const cleanUrl = createCleanUrl('root', file);
            pages.push({ url: cleanUrl, path: file });
        }
    });

    // 2. Process all mapped subdirectories
    FOLDERS.forEach(folder => {
        const folderPath = path.join(__dirname, folder);
        
        // Check if the folder exists before trying to read it
        if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                if (file.endsWith('.html')) {
                    const cleanUrl = createCleanUrl(folder, file);
                    pages.push({ url: cleanUrl, path: `${folder}/${file}` });
                }
            });
        }
    });

    // 3. Generate sitemap.xml in root
    const today = new Date().toISOString().split('T')[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.url === `${BASE_URL}/` ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml.trim());
    console.log('✅ sitemap.xml generated successfully in root.');

    // 4. Generate pages.json in root
    fs.writeFileSync(path.join(__dirname, 'pages.json'), JSON.stringify(pages, null, 2));
    console.log('✅ pages.json generated successfully in root.');

    // 5. Generate registry.js inside the /js/ directory
    const jsDirectory = path.join(__dirname, 'js');
    
    // Safely create the /js/ directory if it doesn't already exist
    if (!fs.existsSync(jsDirectory)) {
        fs.mkdirSync(jsDirectory, { recursive: true });
        console.log('📁 Created /js/ directory.');
    }

    const registryJsPath = path.join(jsDirectory, 'registry.js');
    const registryJs = `// Auto-generated registry of all site pages
const sitePagesRegistry = ${JSON.stringify(pages, null, 2)};

// Expose to global window object for other scripts to consume
window.pageRegistry = sitePagesRegistry;
`;
    
    // Write directly to js/registry.js
    fs.writeFileSync(registryJsPath, registryJs);
    console.log('✅ js/registry.js generated successfully with fresh data.');

    console.log(`🎉 Process complete! Registered a total of ${pages.length} URLs.`);

} catch (error) {
    console.error('❌ Error during file generation:', error);
    process.exit(1); 
}
