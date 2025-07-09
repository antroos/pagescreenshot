// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fullPageScreenshot') {
        handleFullPageScreenshot(message.url, sendResponse);
        return true; // async
    }
    if (message.action === 'captureVisible') {
        // Получаем tabId из sender
        const tabId = sender.tab.id;
        chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png', quality: 100 }, (dataUrl) => {
            sendResponse({ dataUrl });
        });
        return true;
    }
});

async function handleFullPageScreenshot(url, sendResponse) {
    try {
        // 1. Открываем новую вкладку
        const tab = await chrome.tabs.create({ url, active: true });
        const tabId = tab.id;

        // 2. Ждем полной загрузки страницы
        await waitForTabLoad(tabId);

        // 3. Ждем еще 3 секунды
        await new Promise(res => setTimeout(res, 3000));

        // 4. Инжектим content script и собираем скриншоты
        const result = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => window.fullPageScreenshot()
        });
        const dataUrl = result[0].result;

        // 5. Сохраняем скриншот
        await downloadScreenshot(dataUrl);

        // 6. (Опционально) Закрываем вкладку
        // await chrome.tabs.remove(tabId);

        sendResponse({ success: true });
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}

function waitForTabLoad(tabId) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout loading tab')), 30000);
        function listener(updatedTabId, changeInfo) {
            if (updatedTabId === tabId && changeInfo.status === 'complete') {
                clearTimeout(timeout);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        }
        chrome.tabs.onUpdated.addListener(listener);
    });
}

async function downloadScreenshot(dataUrl) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshot_${timestamp}.png`;
    const url = dataUrl;
    await chrome.downloads.download({ url, filename, saveAs: false });
} 