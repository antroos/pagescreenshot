// contentScript.js

window.fullPageScreenshot = async function() {
    const originalScrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const totalHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const numScreens = Math.ceil(totalHeight / viewportHeight);

    const images = [];
    for (let i = 0; i < numScreens; i++) {
        window.scrollTo(0, i * viewportHeight);
        await new Promise(res => setTimeout(res, 300)); // wait for rendering
        const dataUrl = await new Promise(resolve => {
            chrome.runtime.sendMessage({ action: 'captureVisible' }, res => resolve(res.dataUrl));
        });
        images.push(dataUrl);
    }

    // Stitch images together
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * dpr;
    canvas.height = totalHeight * dpr;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < images.length; i++) {
        const img = document.createElement('img');
        img.src = images[i];
        await new Promise(res => { img.onload = res; });
        ctx.drawImage(
            img,
            0, 0, img.width, img.height,
            0, i * viewportHeight * dpr, img.width, img.height
        );
    }

    // Restore scroll
    window.scrollTo(0, originalScrollY);
    document.body.style.overflow = originalOverflow;

    return canvas.toDataURL('image/png');
}; 