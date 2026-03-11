# دليل استخدام مكتبة MawiWebhook

مكتبة `MawiWebhook` هي مكتبة JavaScript قوية وخفيفة الوزن لإرسال البيانات إلى Discord Webhooks بسهولة، مع دعم للحماية من الرسائل المزعجة (Spam) وبناء رسائل Embed غنية.

## التثبيت

تأكد من تضمين ملف المكتبة في صفحتك قبل استخدامه:

```html
<script src="assets/js/webhooks.js"></script>
```

## التهيئة (Initialization)

يمكنك تهيئة المكتبة بإنشاء كائن جديد من `MawiWebhook`:

```javascript
const webhook = new MawiWebhook({
    url: 'YOUR_DISCORD_WEBHOOK_URL', // رابط الويب هوك الخاص بك
    username: 'My Website Bot',      // اسم المرسل الافتراضي
    avatarUrl: 'https://example.com/avatar.png', // صورة المرسل الافتراضية
    cooldown: 30000,                 // فترة الانتظار بين الرسائل (بالمللي ثانية)
    retryOnLimit: true               // إعادة المحاولة تلقائياً عند تجاوز الحد المسموح
});
```

## المميزات والوظائف

### 1. إرسال رسالة بسيطة

```javascript
webhook.send('مرحباً بك في موقعنا!');
```

### 2. إرسال رسالة Embed متقدمة

توفر المكتبة باني (Builder) لإنشاء رسائل Embed بسهولة:

```javascript
const embed = webhook.createEmbed()
    .setTitle("رسالة جديدة")
    .setDescription("هذا وصف للرسالة")
    .setColor(0x3B82F6) // لون الشريط الجانبي (Hex)
    .addField("الحقل الأول", "قيمة الحقل", true) // true تعني بجانب بعض (inline)
    .addField("الحقل الثاني", "قيمة أخرى", true)
    .setTimestamp() // إضافة الوقت الحالي
    .setFooter("تذييل الرسالة", "https://example.com/icon.png");

// إرسال الـ Embed
webhook.sendEmbed(embed.toJSON())
    .then(() => console.log('تم الإرسال بنجاح!'))
    .catch(err => console.error('حدث خطأ:', err));
```

### 3. الحماية من الرسائل المزعجة (Spam Protection)

تحتوي المكتبة على وظيفة مدمجة للتحقق من المحتوى قبل الإرسال:

```javascript
const userMessage = "احصل على المال مجاناً...";
const check = webhook.checkSpam(userMessage);

if (!check.isValid) {
    console.error("تم رفض الرسالة:", check.message);
    // check.code يحتوي على نوع الخطأ: 'COOLDOWN', 'LENGTH', 'SPAM_KEYWORD', 'EXCESSIVE_LINKS'
} else {
    // الرسالة سليمة، يمكنك إرسالها
    webhook.send(userMessage);
}
```

## مثال كامل (نموذج اتصال)

```javascript
document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const message = formData.get('message');

    // 1. التحقق من السبام
    const spamCheck = webhook.checkSpam(message);
    if (!spamCheck.isValid) {
        alert(spamCheck.message);
        return;
    }

    // 2. تجهيز الـ Embed
    const embed = webhook.createEmbed()
        .setTitle("رسالة من نموذج الاتصال")
        .addField("الاسم", formData.get('name'), true)
        .addField("البريد", formData.get('email'), true)
        .setDescription(message)
        .setTimestamp();

    // 3. الإرسال
    try {
        await webhook.sendEmbed(embed.toJSON());
        alert("تم الإرسال بنجاح!");
        e.target.reset();
    } catch (error) {
        alert("فشل الإرسال، حاول مرة أخرى.");
    }
});
```

## ملاحظات هامة

*   **الأمان:** في التطبيقات الحساسة، يفضل عدم وضع رابط الويب هوك (Webhook URL) مباشرة في كود الـ JavaScript الظاهر للعميل (Client-side) لتجنب استخدامه من قبل الآخرين للإزعاج. يفضل استخدام وسيط (Proxy) أو دالة خادم (Serverless Function) إذا أمكن.
*   **الحدود (Rate Limits):** تتعامل المكتبة تلقائياً مع حدود Discord (429 Too Many Requests) وتعيد المحاولة بعد انتهاء فترة الحظر المؤقت.

---
تم التطوير بواسطة MawiMan
