const fs = require('fs');
const path = require('path');

const dir = 'd:\\Iworkspaces\\alize-template';
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const searchStr = `      <!-- Contact / Booking -->\n      <a href="contact.html"`;
const replaceStr = `      <!-- Contact / Booking -->\n      <a href="https://zalo.me/0799036842" target="_blank"`;

// fallback pattern if newlines are different
const searchRegex = /<!-- Contact \/ Booking -->\s*<a href="contact\.html"/g;
const replaceRegexStr = `<!-- Contact / Booking -->\n      <a href="https://zalo.me/0799036842" target="_blank"`;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.match(searchRegex)) {
        content = content.replace(searchRegex, replaceRegexStr);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Pattern not found in ${file}`);
    }
});
