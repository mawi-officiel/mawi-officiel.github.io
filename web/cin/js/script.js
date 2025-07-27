// إنشاء عنصر شاشة التحميل (Loading Screen)
const loadingScreen = document.createElement('div');
loadingScreen.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9); /* خلفية شبه شفافة */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* التأكد من أنها تظهر فوق كل شيء */
`;

// إنشاء عنصر الدوار (Spinner) داخل شاشة التحميل
const spinner = document.createElement('div');
spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3; /* لون الحدود الخفيف */
    border-top: 5px solid #1f6fd0; /* لون الجزء المتحرك من الدوار */
    border-radius: 50%; /* لجعلها دائرية */
    animation: spin 1s linear infinite; /* تطبيق حركة الدوران */
`;

// إضافة قواعد CSS لحركة الدوران
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style); // إضافة قواعد CSS إلى رأس المستند

// إضافة الدوار إلى شاشة التحميل، ثم إضافة شاشة التحميل إلى جسم المستند
loadingScreen.appendChild(spinner);
document.body.appendChild(loadingScreen);

/**
 * دالة للحصول على قيمة معلمة URL من عنوان الصفحة.
 * @param {string} param - اسم المعلمة المراد البحث عنها.
 * @returns {string|null} - قيمة المعلمة أو null إذا لم يتم العثور عليها.
 */
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * دالة للحصول على قيمة كوكيز معينة.
 * @param {string} name - اسم الكوكيز المراد الحصول عليها.
 * @returns {string|null} - قيمة الكوكيز أو null إذا لم يتم العثور عليها.
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// تحديد اللغة المطلوبة:
// 1. من معلمة URL (مثال: ?lang=ar)
// 2. من الكوكيز المحفوظة
// 3. الافتراضي هو 'en' (الإنجليزية)
const urlLang = getUrlParam('lang');
const cookieLang = getCookie('language');
const lang = urlLang || cookieLang || 'en';

// حفظ اللغة المحددة في الكوكيز لمدة عام واحد
document.cookie = `language=${lang};path=/;max-age=${60*60*24*365}`;

// الحصول على عنصر السكريبت Placeholder من HTML (الذي يجب أن يكون موجودًا في ملف HTML الخاص بك)
const existingScriptPlaceholder = document.getElementById('languageLoaderScriptPlaceholder');

// إذا كان العنصر موجودًا، قم بإزالته لضمان إعادة تحميل السكريبت بشكل صحيح
// هذا ضروري لضمان أن المتصفح يقوم بتنفيذ السكريبت الجديد باللغة الصحيحة
if (existingScriptPlaceholder) {
    existingScriptPlaceholder.remove();
}

// إنشاء عنصر سكريبت جديد بالمسار الصحيح للغة المحددة
const languageScript = document.createElement('script');
languageScript.src = `https://mawi-officiel.github.io/web/cin/js/script_${lang}.js`;
languageScript.id = 'languageLoaderScriptPlaceholder'; // إعادة تعيين الـ ID لنفس العنصر الجديد

// إضافة مستمع لحدث 'load' على عنصر السكريبت الجديد للتأكد من تحميله
languageScript.onload = () => {
    // يتم تنفيذ هذا الكود بعد تحميل سكريبت اللغة بنجاح
    const langIcon = document.getElementById('langIcon'); // الحصول على عنصر أيقونة اللغة
    if (langIcon) {
        // تحديث مصدر الصورة والنص البديل والعنوان بناءً على اللغة
        if (lang === 'ar') {
            langIcon.src = 'https://flagcdn.com/w40/ma.png'; // علم المغرب للعربية
            langIcon.alt = 'MA';
            langIcon.title = 'التبديل إلى الإنجليزية';
            document.documentElement.dir = 'rtl'; // تعيين اتجاه المستند من اليمين إلى اليسار
        } else {
            langIcon.src = 'https://flagcdn.com/w40/us.png'; // علم الولايات المتحدة للإنجليزية
            langIcon.alt = 'EN';
            langIcon.title = 'التبديل إلى العربية';
            document.documentElement.dir = 'ltr'; // تعيين اتجاه المستند من اليسار إلى اليمين
        }
    }

    // إخفاء شاشة التحميل فقط بعد تحميل الصفحة بالكامل (بما في ذلك الصور والموارد الأخرى)
    // و بعد تحميل سكريبت اللغة وتحديث الأيقونات.
    // نستخدم Promise لضمان انتظار تحميل جميع موارد الصفحة.
    Promise.all([
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        })
    ]).then(() => {
        loadingScreen.style.display = 'none';
    });
};

// إضافة مستمع لحدث 'error' في حالة فشل تحميل السكريبت
languageScript.onerror = (error) => {
    console.error('حدث خطأ أثناء تحميل سكريبت اللغة:', error);
    // إخفاء شاشة التحميل للسماح بعرض أي محتوى موجود حتى لو كان هناك خطأ
    loadingScreen.style.display = 'none';
};

// إضافة السكريبت الجديد إلى رأس المستند لبدء التحميل
document.head.appendChild(languageScript);

/**
 * دالة لتبديل اللغة بين العربية والإنجليزية وإعادة تحميل الصفحة.
 * يتم تعيين هذه الدالة كخاصية عامة (على كائن window) لتكون قابلة للاستدعاء من HTML.
 */
window.toggleLanguage = function() {
    // الحصول على اللغة الحالية (من URL أو الكوكيز أو الافتراضي)
    const currentLang = getUrlParam('lang') || getCookie('language') || 'en';
    // تحديد اللغة الجديدة للتبديل إليها
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    // تحديث عنوان URL بإضافة معلمة اللغة الجديدة وإعادة تحميل الصفحة
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.href = url.toString();
};
