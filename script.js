// Persist cards between sessions (see issue #8)
const cards = JSON.parse(localStorage.getItem('cards') || '[]');
// Normalize comment format to objects with text and timestamp
cards.forEach((card) => {
    if (Array.isArray(card.comments)) {
        card.comments = card.comments.map((c) =>
            typeof c === 'object' && c !== null
                ? c
                : { text: c, timestamp: Date.now() }
        );
    } else {
        card.comments = [];
    }
});
let selectedCard = null;

const inbox = document.getElementById('inbox');
const cardForm = document.getElementById('cardForm');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const overlay = document.getElementById('overlay');
const showFormBtn = document.getElementById('showForm');
const closeFormBtn = document.getElementById('closeForm');
const readingPane = document.getElementById('readingPane');

function saveCards() {
    localStorage.setItem('cards', JSON.stringify(cards));
}

showFormBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    titleInput.focus();
});

closeFormBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    cardForm.reset();
});


cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title) return;
    cards.push({ title, description, comments: [] });
    saveCards();

    cardForm.reset();
    overlay.classList.add('hidden');
    renderCards();
});

function renderCards() {
    inbox.innerHTML = '';
    cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.setAttribute('draggable', 'true');
        cardDiv.dataset.index = index;

        cardDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index.toString());
        });

        cardDiv.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        cardDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const to = parseInt(cardDiv.dataset.index, 10);
            if (from !== to) {
                const selected = selectedCard;
                const [moved] = cards.splice(from, 1);
                cards.splice(to, 0, moved);
                saveCards();
                renderCards();
                if (selected) {
                    const newIndex = cards.indexOf(selected);
                    if (newIndex !== -1) {
                        showCardDetails(newIndex);
                    }
                }
            }
        });

        cardDiv.addEventListener('click', () => {
            showCardDetails(index);
        });

        const titleEl = document.createElement('h3');
        titleEl.textContent = card.title;
        cardDiv.appendChild(titleEl);

        const descEl = document.createElement('p');
        descEl.textContent = card.description;
        cardDiv.appendChild(descEl);



        /*
         * The UI previously included "Move Up" and "Move Down" buttons for
         * reordering cards. Since drag-and-drop support has been implemented
         * these controls are redundant and have been removed (issue #9).
         */

        inbox.appendChild(cardDiv);
    });
}

function showCardDetails(index) {
    const card = cards[index];
    if (!card) return;
    selectedCard = card;
    readingPane.dataset.index = index;
    readingPane.innerHTML = '';

    const titleEl = document.createElement('h2');
    titleEl.textContent = card.title;
    readingPane.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.textContent = card.description;
    readingPane.appendChild(descEl);

    const commentsContainer = document.createElement('div');
    commentsContainer.className = 'comments';
    card.comments.forEach((c) => {
        const commentBox = document.createElement('div');
        commentBox.className = 'comment-box';

        const meta = document.createElement('div');
        meta.className = 'comment-meta';
        meta.textContent = new Date(c.timestamp).toLocaleString();
        commentBox.appendChild(meta);

        const textEl = document.createElement('div');
        textEl.className = 'comment-text';
        textEl.textContent = c.text;
        commentBox.appendChild(textEl);

        commentsContainer.appendChild(commentBox);
    });
    readingPane.appendChild(commentsContainer);

    const commentInput = document.createElement('textarea');
    commentInput.placeholder = 'Add comment';
    commentInput.className = 'comment-input';
    readingPane.appendChild(commentInput);

    const addCommentBtn = document.createElement('button');
    addCommentBtn.textContent = 'Add';
    addCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            card.comments.push({ text, timestamp: Date.now() });
            saveCards();
            commentInput.value = '';
            showCardDetails(index);
        }
    });
    readingPane.appendChild(addCommentBtn);
}

renderCards();
