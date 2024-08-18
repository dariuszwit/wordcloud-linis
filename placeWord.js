function placeWord(word, x, y, container) {
    const wordElement = document.createElement('a');
    wordElement.href = word.link;
    wordElement.target = '_blank';
    wordElement.className = 'word';
    wordElement.style.fontSize = `${word.size}px`;
    wordElement.style.left = `${x}px`;
    wordElement.style.top = `${y}px`;
    wordElement.style.transform = `rotate(${(Math.random() * 30) - 15}deg)`;
    wordElement.textContent = word.text;
    container.appendChild(wordElement);
}
