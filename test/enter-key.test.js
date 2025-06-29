const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');

// helper to load DOM with script executed
function loadApp(initialCards) {
  const html = fs.readFileSync('index.html', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
  dom.window.localStorage.setItem('cards', JSON.stringify(initialCards));
  const script = fs.readFileSync('script.js', 'utf8');
  const context = dom.getInternalVMContext();
  vm.runInContext(script, context);
  return dom;
}

// test Enter key in search input triggers search
(function() {
  const dom = loadApp([
    { title: 'First', description: '', comments: [] },
    { title: 'Second', description: '', comments: [] },
  ]);
  const searchInput = dom.window.document.getElementById('searchInput');
  const inbox = dom.window.document.getElementById('inbox');
  searchInput.value = 'Second';
  searchInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter' }));
  if (inbox.children.length !== 1 || !inbox.textContent.includes('Second')) {
    throw new Error('enter on search did not filter cards');
  }
})();

// test Enter key in comment input adds comment
(function() {
  const dom = loadApp([{ title: 'Card', description: '', comments: [] }]);
  dom.window.showCardDetails(0);
  const textarea = dom.window.document.querySelector('.comment-input');
  textarea.value = 'hello';
  textarea.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter' }));
  const cards = JSON.parse(dom.window.localStorage.getItem('cards'));
  if (cards[0].comments.length !== 1 || cards[0].comments[0].text !== 'hello') {
    throw new Error('enter on comment input did not add comment');
  }
})();

console.log('test passed');
