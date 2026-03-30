const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://alizedanang.net';
const HTML_FILES = [
  'index.html', 'values.html', 'services.html', 'location.html', 'gallery.html', 'floorplans.html', 'architecture.html', 'amenities.html', 'contact.html'
];
const DIRS = ['.', 'en'];

function getCanonicalPath(filePath, isEn) {
  let relative = filePath.replace('.html', '');
  if (relative === 'index') {
    return isEn ? '/en/' : '/';
  }
  return isEn ? `/en/${relative}` : `/${relative}`;
}

const sitemapEntries = [];
const allPagesMap = {};

// Prepare mappings
for (const file of HTML_FILES) {
  allPagesMap[file] = {
    vi: getCanonicalPath(file, false),
    en: getCanonicalPath(file, true)
  };
}

for (const dir of DIRS) {
  const isEn = dir === 'en';
  for (const file of HTML_FILES) {
    const filePath = path.join(__dirname, dir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');
    
    // The canonical path and full URL
    const canPath = getCanonicalPath(file, isEn);
    const absoluteUrl = BASE_URL + canPath;
    
    // Inject logic:
    // Remove if already exists to avoid duplicates
    content = content.replace(/<link rel="canonical" href="[^"]+">\n?\s*/g, '');
    content = content.replace(/<meta name="theme-color" content="[^"]+">\n?\s*/g, '');
    
    // Inject <meta name="theme-color" content="#1A1A1D">
    // and <link rel="canonical" href="...">
    // Under <title>
    const titleRegex = /(<title>[^<]+<\/title>)/;
    const injection = `$1\n  <meta name="theme-color" content="#1A1A1D">\n  <link rel="canonical" href="${absoluteUrl}">`;
    content = content.replace(titleRegex, injection);

    fs.writeFileSync(filePath, content, 'utf-8');
    
    // Prepare sitemap entry
    const priority = canPath === '/' || canPath === '/en/' ? '1.0' : (canPath.includes('contact') ? '0.9' : '0.8');
    const changefreq = canPath === '/' || canPath === '/en/' ? 'daily' : (canPath.includes('contact') || canPath.includes('location') || canPath.includes('values') || canPath.includes('services') || canPath.includes('floorplans') ? 'monthly' : 'weekly');
    
    const viUrl = BASE_URL + allPagesMap[file].vi;
    const enUrl = BASE_URL + allPagesMap[file].en;

    sitemapEntries.push(`
  <url>
    <loc>${absoluteUrl}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="vi" href="${viUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${viUrl}" />
  </url>`);
  }
}

// Generate sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapContent, 'utf-8');

console.log("Successfully updated 18 HTML files and generated sitemap.xml.");
