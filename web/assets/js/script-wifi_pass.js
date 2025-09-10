function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const proButtons = document.querySelectorAll('.mawi-collapse-content .mawi-btn');

proButtons.forEach((btn) => {
    const text = btn.textContent.trim();

    if (text.includes('Wifi Pass - Pro')) {
        btn.addEventListener('click', () => {
            downloadFile(
                'https://github.com/mawi-officiel/wifi-pass/releases/download/v16.12.1-pro/mawi-wifi_pass-pro.exe',
                'mawi-wifi_pass-pro.exe'
            );
        });
    } else if (text.includes('wordlist 2025')) {
        btn.addEventListener('click', () => {
            downloadFile(
                'https://github.com/mawi-officiel/wifi-pass/releases/download/v16.12.1-pro/wordlist-2025.zip',
                'wordlist.zip'
            );
        });
    } 
    else if (text.includes('wordlist 2000-2024')) {
        btn.addEventListener('click', () => {
            const phone = '+212636608296';
            const message = encodeURIComponent('Hello, I want to download Wordlist 2000-2024');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
     else if (text.includes('pins.csv')) {
        btn.addEventListener('click', () => {
            downloadFile(
                'https://github.com/mawi-officiel/wifi-pass/releases/download/v16.12.1-pro/pins.csv',
                'pins.csv'
            );
        });
    }
     else if (text.includes('pins_all.csv')) {
        btn.addEventListener('click', () => {
            const phone = '+212636608296';
            const message = encodeURIComponent('Hi, I want to download pins_all.csv');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
     else if (btn.classList.contains('mawi-btn-primary')) {
        btn.addEventListener('click', () => {
            const phone = '+212636608296';
            const message = encodeURIComponent('Hello, I want to activate the Wifi Pass tool');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
});

document.getElementById('wifiPassBtn').addEventListener('click', function() {
    downloadFile(
        'https://github.com/mawi-officiel/wifi-pass/releases/download/v5.0.4-free/mawi-wifi_pass-free.exe',
        'mawi-wifi_pass-free.exe'
    );
});

document.getElementById('wordlistBtn').addEventListener('click', function() {
    downloadFile(
        'https://github.com/mawi-officiel/wifi-pass/releases/download/v5.0.4-free/wordlist.zip',
        'wordlist.zip'
    );
});

document.getElementById('pinsBtn').addEventListener('click', function() {
    downloadFile(
        'https://github.com/mawi-officiel/wifi-pass/releases/download/v5.0.4-free/pins.csv',
        'pins.csv'
    );
});
