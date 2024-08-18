function checkOverlap(x, y, text, size, container) {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.fontSize = `${size}px`;
    tempDiv.style.left = `${x}px`;
    tempDiv.style.top = `${y}px`;
    tempDiv.style.visibility = 'hidden';
    tempDiv.textContent = text;

    container.appendChild(tempDiv);

    const rect1 = tempDiv.getBoundingClientRect();
    const words = container.getElementsByClassName('word');

    for (let word of words) {
        const rect2 = word.getBoundingClientRect();

        if (!(rect1.right < rect2.left || 
              rect1.left > rect2.right || 
              rect1.bottom < rect2.top || 
              rect1.top > rect2.bottom)) {
            container.removeChild(tempDiv);
            return true;
        }
    }

    container.removeChild(tempDiv);
    return false;
}
