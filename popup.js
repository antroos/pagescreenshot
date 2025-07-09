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
            showStatus('Please enter a URL', 'error');
            return;
        }
        if (!isValidUrl(url)) {
            showStatus('Please enter a valid URL', 'error');
            return;
        }
        showStatus('Request sent, please wait...', 'info');
        chrome.runtime.sendMessage({
            action: 'fullPageScreenshot',
            url: url
        }, function(response) {
            if (response && response.success) {
                showStatus('Screenshot saved!', 'success');
            } else {
                showStatus('Error: ' + (response?.error || 'Unknown error'), 'error');
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