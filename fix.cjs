const fs = require('fs');

const path = 'd:\\\\Iworkspaces\\\\alize-template\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

// Find the section end and the main content start
const startPattern = '  </section>\n  <!doctype html>';
const endPattern = '<!-- MAIN CONTENT -->\n    <main>';

const startIdx = content.indexOf(startPattern);
if (startIdx !== -1) {
    const endIdx = content.indexOf(endPattern, startIdx);
    if (endIdx !== -1) {
        // remove the duplicate parts
        const newContent = content.substring(0, startIdx) + '  </section>\n\n    ' + content.substring(endIdx);
        fs.writeFileSync(path, newContent, 'utf8');
        console.log('Successfully fixed index.html');
    } else {
        console.log('Could not find end pattern.');
    }
} else {
    console.log('Could not find start pattern.');
}
