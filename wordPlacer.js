function prepareWordsForPlacement(words, maskArea) {
    const wordCopies = 3;
    let extendedWords = [];

    words.forEach(word => {
        for (let i = 0; i < wordCopies; i++) {
            extendedWords.push({ ...word });
        }
    });

    const additionalWords = words.map(word => ({
        ...word,
        size: Math.floor(word.size * 0.5)
    }));
    
    extendedWords = extendedWords.concat(additionalWords);
    extendedWords = shuffleArray(extendedWords);

    let totalWordArea = extendedWords.reduce((sum, word) => sum + (word.size * word.size), 0);
    let scaleFactor = Math.sqrt(maskArea / totalWordArea) * 0.8;

    extendedWords.forEach(word => {
        word.size = Math.floor(word.size * scaleFactor);
    });

    extendedWords.sort((a, b) => b.size - a.size);
    return extendedWords;
}

function placeWords(words, imageData, width, height, container) {
    const step = 3;
    const maxAttempts = 500;

    for (let searchAttempt = 0; searchAttempt < 3; searchAttempt++) {
        let wordsPlaced = 0;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                if (isEmptyPixel(x, y, imageData, width, height)) {
                    for (let word of words) {
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
}
