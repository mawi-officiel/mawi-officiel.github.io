// Cookie management functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function toggleLanguage() {
    const currentUrl = new URL(window.location.href);
    const langParam = currentUrl.searchParams.get('lang');
    const langIcon = document.getElementById('langIcon');
    
    if (!langParam || langParam === 'en') {
        currentUrl.searchParams.set('lang', 'ar');
        langIcon.src = 'https://flagcdn.com/w40/ma.png';
        langIcon.alt = 'MA';
        langIcon.title = 'Switch to English';
        setCookie('preferred_lang', 'ar', 365);
    } else {
        currentUrl.searchParams.set('lang', 'en');
        langIcon.src = 'https://flagcdn.com/w40/us.png';
        langIcon.alt = 'EN';
        langIcon.title = 'Switch to Arabic';
        setCookie('preferred_lang', 'en', 365);
    }
    
    window.location.href = currentUrl.toString();
}

window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');
    
    if (!lang) {
        const savedLang = getCookie('preferred_lang');
        if (savedLang) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('lang', savedLang);
            window.location.href = currentUrl.toString();
            return;
        }
    }
    
    const langIcon = document.getElementById('langIcon');
    if (lang === 'ar') {
        langIcon.src = 'https://flagcdn.com/w40/ma.png';
        langIcon.alt = 'MA';
        langIcon.title = 'Switch to English';
    }
});

function loadLanguageScript() {
    const existingScripts = document.querySelectorAll('script[data-lang]');
    existingScripts.forEach(script => script.remove());

    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang') || getCookie('preferred_lang') || 'en';

    const script = document.createElement('script');
    script.src = `https://mawi-officiel.github.io/web/cin/js/script_${lang}.js`;
    script.setAttribute('data-lang', lang);
    document.body.appendChild(script);
}

loadLanguageScript();
