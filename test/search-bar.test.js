const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;
const searchInput = document.getElementById('searchInput');
const title = document.querySelector('h1');
const main = document.getElementById('main');
if (!searchInput) {
  throw new Error('search input not found');
}
// search bar should not be inside title element
if (searchInput.closest('h1')) {
  throw new Error('search input is inside the title');
}
// search bar should come after the title and before the main section
if (!(title.compareDocumentPosition(searchInput) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING)) {
  throw new Error('search input is not after the title');
}
if (!(searchInput.compareDocumentPosition(main) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING)) {
  throw new Error('search input should be placed before the main section');
}
console.log('test passed');
