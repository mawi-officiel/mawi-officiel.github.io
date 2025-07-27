// إنشاء عنصر شاشة التحميل
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
style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
document.head.appendChild(style);

loadingScreen.appendChild(spinner);
document.body.appendChild(loadingScreen);

// تتبع حالة تحميل السكريبت
let currentScript = null;
let isScriptLoaded = false;

// دالة لتحميل ملف السكريبت
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // إزالة السكريبت القديم إذا وجد
        if (currentScript) {
            currentScript.remove();
            isScriptLoaded = false;
        }

        const script = document.createElement('script');
        script.src = src;
        currentScript = script;

        script.onload = () => {
            isScriptLoaded = true;
            resolve();
        };
        script.onerror = () => {
            isScriptLoaded = false;
            reject(new Error(`فشل تحميل السكريبت: ${src}`));
        };
        document.head.appendChild(script);
    });
}

// دالة للحصول على معلمة URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// دالة للحصول على اللغة المحفوظة في الكوكيز
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// دالة للتحقق من حالة تحميل السكريبت
function checkScriptStatus() {
    if (!isScriptLoaded) {
        console.warn('السكريبت غير محمل، جاري إعادة التحميل...');
        loadLanguageScript();
    }
}

// دالة لتحميل ملف اللغة
async function loadLanguageScript() {
    const urlLang = getUrlParam('lang');
    const cookieLang = getCookie('language');
    const lang = urlLang || cookieLang || 'en';

    // حفظ اللغة في الكوكيز
    document.cookie = `language=${lang};path=/;max-age=${60*60*24*365}`;

    try {
        await loadScript(`https://mawi-officiel.github.io/web/cin/js/script_${lang}.js`);
        loadingScreen.style.display = 'none';
        
        // تحديث أيقونة اللغة
        const langIcon = document.getElementById('langIcon');
        if (langIcon) {
            if (lang === 'ar') {
                langIcon.src = 'https://flagcdn.com/w40/ma.png';
                langIcon.alt = 'MA';
                langIcon.title = 'Switch to English';
                document.documentElement.dir = 'rtl';
            } else {
                langIcon.src = 'https://flagcdn.com/w40/us.png';
                langIcon.alt = 'EN';
                langIcon.title = 'Switch to Arabic';
                document.documentElement.dir = 'ltr';
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل ملف اللغة:', error);
        loadingScreen.style.display = 'none';
    }
}

// تحميل ملف اللغة عند بدء التشغيل
loadLanguageScript();

// التحقق من حالة السكريبت كل 5 ثواني
setInterval(checkScriptStatus, 5000);

// دالة تبديل اللغة
window.toggleLanguage = function() {
    const currentLang = getUrlParam('lang') || getCookie('language') || 'en';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // تحديث URL وإعادة تحميل الصفحة
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
};
