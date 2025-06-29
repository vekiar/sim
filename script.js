const cards = [];

const cardList = document.getElementById('cardList');
const cardForm = document.getElementById('cardForm');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');

cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title) return;
    cards.push({ title, description, comments: [] });
    renderCards();
    cardForm.reset();
});

function renderCards() {
    cardList.innerHTML = '';
    cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        const titleEl = document.createElement('h3');
        titleEl.textContent = card.title;
        cardDiv.appendChild(titleEl);

        const descEl = document.createElement('p');
        descEl.textContent = card.description;
        cardDiv.appendChild(descEl);

        const commentsList = document.createElement('ul');
        card.comments.forEach((c) => {
            const li = document.createElement('li');
            li.textContent = c;
            commentsList.appendChild(li);
        });
        cardDiv.appendChild(commentsList);

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Add comment';
        cardDiv.appendChild(commentInput);

        const addCommentBtn = document.createElement('button');
        addCommentBtn.textContent = 'Add';
        addCommentBtn.addEventListener('click', () => {
            const text = commentInput.value.trim();
            if (text) {
                card.comments.push(text);
                renderCards();
            }
        });
        cardDiv.appendChild(addCommentBtn);

        const upBtn = document.createElement('button');
        upBtn.textContent = 'Move Up';
        upBtn.disabled = index === 0;
        upBtn.addEventListener('click', () => {
            if (index > 0) {
                [cards[index], cards[index - 1]] = [cards[index - 1], cards[index]];
                renderCards();
            }
        });
        cardDiv.appendChild(upBtn);

        const downBtn = document.createElement('button');
        downBtn.textContent = 'Move Down';
        downBtn.disabled = index === cards.length - 1;
        downBtn.addEventListener('click', () => {
            if (index < cards.length - 1) {
                [cards[index], cards[index + 1]] = [cards[index + 1], cards[index]];
                renderCards();
            }
        });
        cardDiv.appendChild(downBtn);

        cardList.appendChild(cardDiv);
    });
}

renderCards();
