function checkWordFitsInMask(x, y, text, size, imageData, width, height) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;

    tempCtx.font = `${size}px Arial`;
    tempCtx.textBaseline = 'top';

    const textWidth = tempCtx.measureText(text).width;

    for (let i = 0; i < textWidth; i += 1) {
        for (let j = 0; j < size; j += 1) {
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
