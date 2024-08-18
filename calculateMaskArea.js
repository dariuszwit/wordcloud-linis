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
