const cards = [];

const inbox = document.getElementById('inbox');
const cardForm = document.getElementById('cardForm');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const overlay = document.getElementById('overlay');
const showFormBtn = document.getElementById('showForm');
const closeFormBtn = document.getElementById('closeForm');
const readingPane = document.getElementById('readingPane');

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
                const [moved] = cards.splice(from, 1);
                cards.splice(to, 0, moved);
                renderCards();

                if (readingPane.dataset.index) {
                    showCardDetails(parseInt(readingPane.dataset.index, 10));
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


        const upBtn = document.createElement('button');
        upBtn.textContent = 'Move Up';
        upBtn.disabled = index === 0;
        upBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (index > 0) {
                [cards[index], cards[index - 1]] = [cards[index - 1], cards[index]];
                renderCards();
            }
        });
        cardDiv.appendChild(upBtn);

        const downBtn = document.createElement('button');
        downBtn.textContent = 'Move Down';
        downBtn.disabled = index === cards.length - 1;

        downBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (index < cards.length - 1) {
                [cards[index], cards[index + 1]] = [cards[index + 1], cards[index]];
                renderCards();
            }
        });
        cardDiv.appendChild(downBtn);

        inbox.appendChild(cardDiv);
    });
}

function showCardDetails(index) {
    const card = cards[index];
    if (!card) return;
    readingPane.dataset.index = index;
    readingPane.innerHTML = '';

    const titleEl = document.createElement('h2');
    titleEl.textContent = card.title;
    readingPane.appendChild(titleEl);

    const descEl = document.createElement('p');
    descEl.textContent = card.description;
    readingPane.appendChild(descEl);

    const commentsList = document.createElement('ul');
    card.comments.forEach((c) => {
        const li = document.createElement('li');
        li.textContent = c;
        commentsList.appendChild(li);
    });
    readingPane.appendChild(commentsList);

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add comment';
    readingPane.appendChild(commentInput);

    const addCommentBtn = document.createElement('button');
    addCommentBtn.textContent = 'Add';
    addCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            card.comments.push(text);
            commentInput.value = '';
            showCardDetails(index);
        }
    });
    readingPane.appendChild(addCommentBtn);
}

renderCards();
