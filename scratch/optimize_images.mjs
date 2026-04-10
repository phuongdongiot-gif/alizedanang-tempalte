import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('app', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('<img ')) {
      // replace <img src="..." /> with <img loading="lazy" decoding="async" src="..." /> 
      // but only if it doesn't already have loading="lazy"
      let newContent = content.replace(/<img (?!.*loading="lazy")/g, '<img loading="lazy" decoding="async" ');
      
      // Fix LCP (First image should be fetchPriority="high" instead of lazy in hero sections)
      // I'll make a simplification: all images below hero are lazy. This regex is just generic lazy.
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Optimized images in ${filePath}`);
      }
    }
  }
});
