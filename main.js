document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('wordCloud');
    const canvas = document.getElementById('maskCanvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'twitter_mask.png';

    img.onload = function() {
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const maskArea = calculateMaskArea(imageData, width, height);
        console.log(`Powierzchnia maski: ${maskArea}`);

        const wordCopies = 3; // Zmniejszenie liczby powtórzeń każdego słowa
        let extendedWords = [];
        words.forEach(word => {
            for (let i = 0; i < wordCopies; i++) {
                extendedWords.push({ ...word });
            }
        });

        const additionalWords = words.map(word => {
            return { ...word, size: Math.floor(word.size * 0.5) };
        });
        extendedWords = extendedWords.concat(additionalWords);

        extendedWords = shuffleArray(extendedWords);

        let totalWordArea = extendedWords.reduce((sum, word) => sum + (word.size * word.size), 0);
        let scaleFactor = Math.sqrt(maskArea / totalWordArea) * 0.8;  // Skalowanie o 20% mniejsze dla szybszego dopasowania
        extendedWords.forEach(word => {
            word.size = Math.floor(word.size * scaleFactor);
        });

        extendedWords.sort((a, b) => b.size - a.size);

        const step = 3; // Przeszukiwanie co 3 piksele
        const maxAttempts = 500; // Zmniejszenie maksymalnej liczby prób rozmieszczenia

        for (let searchAttempt = 0; searchAttempt < 3; searchAttempt++) {
            let wordsPlaced = 0;

            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    if (isEmptyPixel(x, y, imageData, width, height)) {
                        for (let word of extendedWords) {
                            let attempts = 0;
                            while (attempts < maxAttempts) {
                                attempts++;
                                if (checkWordFitsInMask(x, y, word.text, word.size, imageData, width, height) &&
                                    !checkOverlap(x, y, word.text, word.size, container)) {
                                    placeWord(word, x, y, container);
                                    markWordArea(x, y, word, imageData, width);
                                    wordsPlaced++;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (wordsPlaced === 0) {
                console.log(`Nie umieszczono żadnych nowych słów podczas przeszukania nr ${searchAttempt + 1}. Przerwano dalsze przeszukania.`);
                break;
            }
            console.log(`Przeszukanie nr ${searchAttempt + 1} zakończone, umieszczono ${wordsPlaced} słów.`);
        }
    };

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
});
