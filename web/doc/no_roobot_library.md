# توثيق مكتبة NoRoobot (NoRoobot Library Documentation)

مكتبة **NoRoobot** هي مكتبة JavaScript خفيفة وقوية لإنشاء نظام تحقق من المستخدم (CAPTCHA) بأسلوب "السحب للتحقق" (Slide to Verify)، مشابه للأنظمة المستخدمة في المواقع الكبرى. تتميز المكتبة بأنها قائمة بذاتها (Self-contained) حيث تقوم بحقن تنسيقات CSS الخاصة بها تلقائياً.

## المميزات
- **تفاعلية:** واجهة سحب سلسة تدعم الماوس واللمس (Touch).
- **مستقلة:** لا تتطلب ملفات CSS خارجية، فهي تحقن الأنماط تلقائياً.
- **قابلة للتخصيص:** سهولة تغيير النصوص ودالة الاستجابة.
- **دعم اللغات:** تدعم المحاذاة التلقائية (RTL/LTR) بناءً على اتجاه الصفحة.

---

## التثبيت والاستخدام

### 1. تضمين ملف السكربت
قم بإضافة ملف المكتبة `no_roobot.js` في نهاية وسم `<body>` في صفحة HTML الخاصة بك:

```html
<script src="assets/js/no_roobot.js"></script>
```

### 2. إضافة حاوية HTML
قم بإنشاء عنصر `div` فارغ في المكان الذي تريد أن يظهر فيه مربع التحقق، وأعطه `id` مميز:

```html
<div id="mawiGuardContainer"></div>
```

### 3. تهيئة المكتبة (Initialization)
في كود JavaScript الخاص بك، قم بإنشاء مثيل (Instance) جديد من الكلاس `NoRoobot`:

```javascript
// تهيئة المكتبة
const myCaptcha = new NoRoobot('#mawiGuardContainer', {
    // الخيارات
    label: 'تحقق أنك إنسان', // النص الذي يظهر للمستخدم
    onVerify: function() {
        // الكود الذي يتم تنفيذه عند نجاح التحقق
        console.log('تم التحقق بنجاح! المستخدم إنسان.');
        document.getElementById('submitBtn').disabled = false; // مثال: تفعيل زر الإرسال
    }
});
```

---

## مرجع الخيارات (Options Reference)

عند إنشاء مثيل جديد، يمكنك تمرير كائن خيارات (Options Object) كمعامل ثاني:

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|:---|:---|:---|:---|
| `label` | `String` | 'Verify you are human' | النص الذي يظهر بجانب مربع الاختيار قبل التحقق. |
| `onVerify` | `Function` | `() => {}` | دالة رد نداء (Callback) يتم استدعاؤها فور اكتمال عملية السحب والتحقق بنجاح. |
| `theme` | `String` | 'light' | سمة الألوان (مجهزة للتطوير المستقبلي). |

---

## الدوال المتاحة (Methods)

### `reset()`
تقوم هذه الدالة بإعادة تعيين الكابتشا إلى حالتها الأولية (غير متحقق). مفيدة جداً عند إعادة تعيين النموذج (Reset Form) بعد إرسال البيانات بنجاح.

**مثال:**
```javascript
// بعد إرسال النموذج بنجاح
myForm.reset();
myCaptcha.reset(); // إعادة الكابتشا للوضع الافتراضي
```

---

## مثال عملي متكامل

إليك مثال لكيفية دمج المكتبة في نموذج اتصال:

```html
<form id="contactForm">
    <input type="text" name="name" placeholder="اسمك" required>
    
    <!-- مكان ظهور الكابتشا -->
    <div id="securityCheck" class="my-4"></div>
    
    <button type="submit" id="sendBtn" disabled>إرسال</button>
</form>

<script src="assets/js/no_roobot.js"></script>
<script>
    // 1. تعريف المتغير للتحكم في الكابتشا
    let isVerified = false;

    // 2. تشغيل المكتبة
    const captcha = new NoRoobot('#securityCheck', {
        label: 'أنا لست برنامج روبوت',
        onVerify: () => {
            isVerified = true;
            document.getElementById('sendBtn').disabled = false; // تفعيل الزر
        }
    });

    // 3. التعامل مع إرسال النموذج
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        if (!isVerified) {
            e.preventDefault();
            alert('يرجى إتمام التحقق الأمني أولاً!');
            return;
        }
        
        // متابعة عملية الإرسال...
        // بعد النجاح:
        // captcha.reset();
    });
</script>
```

## ملاحظات تقنية
- المكتبة تستخدم `Shadow DOM` أو تحقن `style` في الـ `head` لضمان عدم تعارض التنسيقات.
- تدعم المكتبة خاصية `user-select: none` لمنع تحديد النصوص أثناء السحب.
- يتم تفعيل التنسيق `RTL` (من اليمين لليسار) تلقائياً إذا كانت الصفحة تحتوي على `dir="rtl"`.
