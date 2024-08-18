function loadImage(src, onLoadCallback) {
    const img = new Image();
    img.src = src;
    img.onload = onLoadCallback;
    return img;
}
