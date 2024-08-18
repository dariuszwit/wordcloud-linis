function calculateMaskArea(imageData, width, height) {
    let count = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        if (r > 200 && g > 200 && b > 200) {
            count++;
        }
    }
    return count;
}

function isEmptyPixel(x, y, imageData, width, height) {
    const pixelIndex = (y * width + x) * 4;
    const r = imageData.data[pixelIndex];
    const g = imageData.data[pixelIndex + 1];
    const b = imageData.data[pixelIndex + 2];

    return r > 200 && g > 200 && b > 200;  // Białe piksele są uważane za "puste"
}

function checkWordFitsInMask(x, y, text, size, imageData, width, height) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;

    tempCtx.font = `${size}px Arial`;
    tempCtx.textBaseline = 'top';

    const textWidth = tempCtx.measureText(text).width;

    for (let i = 0; i < textWidth; i += step) {
        for (let j = 0; j < size; j += step) {
            const pixelIndex = ((Math.floor(y + j) * width) + Math.floor(x + i)) * 4;
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];

            if (r <= 200 || g <= 200 || b <= 200) {
                return false;
            }
        }
    }

    return true;
}

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

function placeWord(word, x, y, container) {
    const wordElement = document.createElement('a');
    wordElement.href = word.link;
    wordElement.target = '_blank';
    wordElement.className = 'word';
    wordElement.style.fontSize = `${word.size}px`;
    wordElement.style.left = `${x}px`;
    wordElement.style.top = `${y}px`;
    wordElement.style.transform = `rotate(${(Math.random() * 5) - 2.5}deg)`;  // Minimalna rotacja
    wordElement.textContent = word.text;
    container.appendChild(wordElement);
}

function markWordArea(x, y, word, imageData, width) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = word.size;

    tempCtx.font = `${word.size}px Arial`;
    tempCtx.textBaseline = 'top';

    const textWidth = tempCtx.measureText(word.text).width;

    for (let i = 0; i < textWidth; i++) {
        for (let j = 0; j < word.size; j++) {
            const pixelIndex = ((Math.floor(y + j) * width) + Math.floor(x + i)) * 4;
            imageData.data[pixelIndex] = 0;    // Czarny kolor, oznaczający zajęte miejsce
            imageData.data[pixelIndex + 1] = 0;
            imageData.data[pixelIndex + 2] = 0;
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
