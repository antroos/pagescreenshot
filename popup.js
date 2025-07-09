// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const screenshotBtn = document.getElementById('screenshot-btn');
    const status = document.getElementById('status');

    function showStatus(message, type = 'info') {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 5000);
    }

    screenshotBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        if (!url) {
            showStatus('Пожалуйста, введите URL', 'error');
            return;
        }
        if (!isValidUrl(url)) {
            showStatus('Пожалуйста, введите корректный URL', 'error');
            return;
        }
        showStatus('Запрос отправлен, ожидайте...', 'info');
        chrome.runtime.sendMessage({
            action: 'fullPageScreenshot',
            url: url
        }, function(response) {
            if (response && response.success) {
                showStatus('Скриншот сохранён!', 'success');
            } else {
                showStatus('Ошибка: ' + (response?.error || 'Неизвестная ошибка'), 'error');
            }
        });
    });

    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
}); 