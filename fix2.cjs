const fs = require('fs');

const path = 'd:\\\\Iworkspaces\\\\alize-template\\\\index.html';
let content = fs.readFileSync(path, 'utf8');

const regex = /(<\/section>[\s\S]*?)(<!doctype html>[\s\S]*?)(<!-- MAIN CONTENT -->)/i;
const match = content.match(regex);

if (match) {
    console.log('Found match!');
    const newContent = content.substring(0, match.index) + match[1] + match[3] + content.substring(match.index + match[0].length);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Fixed index.html successfully.');
} else {
    console.log('Could not find regex match.');
}
