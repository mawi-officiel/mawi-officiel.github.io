const loadingScreen = document.createElement('div');
loadingScreen.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const spinner = document.createElement('div');
spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #1f6fd0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
`;

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

loadingScreen.appendChild(spinner);
document.body.appendChild(loadingScreen);

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const urlLang = getUrlParam('lang');
const cookieLang = getCookie('language');
const lang = urlLang || cookieLang || 'en';

document.cookie = `language=${lang};path=/;max-age=${60*60*24*365}`;

const scriptAr = document.getElementById('langScriptAr');
const scriptEn = document.getElementById('langScriptEn');

if (lang === 'ar') {
    if (scriptEn) {
        scriptEn.remove();
    }
} else {
    if (scriptAr) {
        scriptAr.remove();
    }
}

window.addEventListener('load', () => {
    const langIcon = document.getElementById('langIcon');
    if (langIcon) {
        if (lang === 'ar') {
            langIcon.src = 'https://flagcdn.com/w40/ma.png';
            langIcon.alt = 'MA';
            langIcon.title = 'التبديل إلى الإنجليزية';
            document.documentElement.dir = 'rtl';
        } else {
            langIcon.src = 'https://flagcdn.com/w40/us.png';
            langIcon.alt = 'EN';
            langIcon.title = 'التبديل إلى العربية';
            document.documentElement.dir = 'ltr';
        }
    }
    loadingScreen.style.display = 'none';
});


window.toggleLanguage = function() {
    const currentLang = getUrlParam('lang') || getCookie('language') || 'en';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
};
