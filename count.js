const fs = require('fs');
const html = fs.readFileSync('dsa-tracker.html', 'utf-8');
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const total = dom.window.document.querySelectorAll('.card input[type="checkbox"]').length;
console.log('Total:', total);
