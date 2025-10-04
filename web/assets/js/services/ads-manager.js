
(function() {
            const operations = [
                { question: '5 + 3?', answer: 8 },
                { question: '10 - 4?', answer: 6 },
                { question: '2 × 6?', answer: 12 },
                { question: '15 ÷ 3?', answer: 5 },
                { question: '7 + 2?', answer: 9 },
                { question: '12 - 5?', answer: 7 },
                { question: '3 × 4?', answer: 12 },
                { question: '20 ÷ 4?', answer: 5 }
            ];
            function getRandomOperation() {
                return operations[Math.floor(Math.random() * operations.length)];
            }
            const webhookUrl = 'https://discord.com/api/webhooks/1420477382862573670/URHQx3M7jP3o0sEcw7EbASPknHf_MSgPWAt9tIRQA313GPkgbykfCBfVj410Tx0yOH0h';
            async function sendWebhook(payload) {
                const resp = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                return resp;
            }
            window.AdsSecurity = { getRandomOperation, sendWebhook };
        })();

        (function() {
            function getBasePercent(budget) {
                if (budget >= 4050) return 5;
                if (budget >= 2550) return 6;
                if (budget >= 1050) return 8;
                if (budget >= 550) return 10;
                if (budget > 250) return 14;
                if (budget >= 50) return 15;
                return null;
            }
            function getDurationPercent(days) {
                if (days <= 7) return 3;
                if (days <= 14) return 6;
                if (days <= 30) return 12;
                return 25;
            }
            function getMinDays(budget) {
                if (budget >= 4050) return 30;
                if (budget >= 2550) return 15;
                if (budget >= 1050) return 7;
                if (budget >= 550) return 3;
                if (budget >= 50) return 1;
                return 1;
            }
            function getMaxDays(budget) {
                if (budget >= 4050) return 180;
                if (budget >= 2550) return 90;
                if (budget >= 1050) return 60;
                if (budget >= 550) return 30;
                if (budget > 250) return 14;
                if (budget >= 50) return 7;
                return 180;
            }
            window.AdsCalc = { getBasePercent, getDurationPercent, getMinDays, getMaxDays };
        })();

        (function() {
            const fmtNumber = new Intl.NumberFormat('ar-MA', { maximumFractionDigits: 0 });
            const formatDH = (amount) => `${fmtNumber.format(amount)} DH`;
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const phonePrefix = document.getElementById('phonePrefix');
            const phoneNumber = document.getElementById('phoneNumber');
            const platform = document.getElementById('platform');
            const budgetEl = document.getElementById('budget');
            const durationEl = document.getElementById('duration');
            const budgetHint = document.getElementById('budgetHint');
            const durationHint = document.getElementById('durationHint');
            const basePercentBadge = document.getElementById('basePercentBadge');
            const baseFeeBadge = document.getElementById('baseFeeBadge');
            const durationPercentBadge = document.getElementById('durationPercentBadge');
            const totalPercentBadge = document.getElementById('totalPercentBadge');
            const feeDisplay = document.getElementById('feeDisplay');
            const percentDisplay = document.getElementById('percentDisplay');
            const totalDisplay = document.getElementById('totalDisplay');
            const submitBtn = document.getElementById('submitBtn');
            const goal = document.getElementById('goal');
            const goalOther = document.getElementById('goalOther');
            const launchEl = document.getElementById('launch');
            const adsFormEl = document.getElementById('ads-form');
            if (!adsFormEl) { return; }
            const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || getComputedStyle(document.documentElement).direction === 'rtl';
            function toLatinDigits(str) { return String(str || ''); }
            function parseCleanNumber(str) {
                const s = toLatinDigits(str).replace(/[^\d.]/g, '');
                if (!s) return NaN;
                return parseFloat(s);
            }
            function enforceConstraints() {
                const b = parseCleanNumber(budgetEl.value);
                const effB = !isNaN(b) ? b : 0;
                const minD = window.AdsCalc.getMinDays(effB);
                const maxD = window.AdsCalc.getMaxDays(effB);
                if (durationHint) durationHint.textContent = isRTL ? `مسموح: ${minD}–${maxD} يومًا` : `Allowed: ${minD}–${maxD} days`;
                if (budgetHint) budgetHint.textContent = isRTL ? 'مسموح: 50–10000 درهم' : 'Allowed: 50–10000 DH';
            }
            function clampOnBlur() {
                let b = parseCleanNumber(budgetEl.value);
                if (isNaN(b)) { budgetEl.value = ''; enforceConstraints(); return; }
                b = Math.round(Math.min(10000, Math.max(50, b)));
                budgetEl.value = String(b);
                let dRaw = toLatinDigits(durationEl.value).replace(/[^\d]/g, '');
                let d = parseInt(dRaw || '0', 10);
                const minD = window.AdsCalc.getMinDays(b);
                const maxD = window.AdsCalc.getMaxDays(b);
                if (!d || d < minD) d = minD;
                if (d > maxD) d = maxD;
                durationEl.value = String(d);
            }
            function updateCalc() {
                enforceConstraints();
                const budget = parseCleanNumber(budgetEl.value);
                const days = parseInt(toLatinDigits(durationEl.value).replace(/[^\d]/g, '') || '0', 10);
                if (isNaN(budget) || budget < 50 || budget > 10000) {
                    if (basePercentBadge) basePercentBadge.textContent = isRTL ? 'النسبة الأساسية: -' : 'Base percent: -';
                    if (baseFeeBadge) baseFeeBadge.textContent = isRTL ? 'عمولة أساسية: -' : 'Base fee: -';
                    if (durationPercentBadge) durationPercentBadge.textContent = isRTL ? 'زيادة حسب المدة: -' : 'Duration increase: -';
                    if (totalPercentBadge) totalPercentBadge.textContent = isRTL ? 'النسبة الإجمالية: -' : 'Total percent: -';
                    feeDisplay.textContent = '-';
                    percentDisplay.textContent = '-';
                    totalDisplay.textContent = '-';
                    return;
                }
                const baseP = window.AdsCalc.getBasePercent(budget) ?? 0;
                const durP = days ? window.AdsCalc.getDurationPercent(days) : 0;
                const totalP = baseP + durP;
                const baseFee = Math.round(budget * (baseP / 100));
                const totalFee = Math.round(budget * (totalP / 100));
                const total = Math.round(budget + totalFee);
                if (basePercentBadge) basePercentBadge.textContent = (isRTL ? `النسبة الأساسية: ${baseP}%` : `Base percent: ${baseP}%`);
                if (baseFeeBadge) baseFeeBadge.textContent = (isRTL ? `عمولة أساسية: ${formatDH(baseFee)}` : `Base fee: ${formatDH(baseFee)}`);
                if (durationPercentBadge) durationPercentBadge.textContent = days ? (isRTL ? `زيادة حسب المدة: +${durP}%` : `Duration increase: +${durP}%`) : (isRTL ? 'زيادة حسب المدة: -' : 'Duration increase: -');
                if (totalPercentBadge) totalPercentBadge.textContent = (isRTL ? `النسبة الإجمالية: ${totalP}%` : `Total percent: ${totalP}%`);
                feeDisplay.textContent = formatDH(totalFee);
                percentDisplay.textContent = `${totalP}%`;
                totalDisplay.textContent = formatDH(total);
            }
            goal.addEventListener('change', () => {
                if (goal.value === 'custom') {
                    goalOther.classList.remove('hidden');
                } else {
                    goalOther.classList.add('hidden');
                    goalOther.value = '';
                }
            });
            (function setLaunchDefault() {
                const now = new Date();
                const y = now.getFullYear();
                const m = String(now.getMonth() + 1).padStart(2, '0');
                const d = String(now.getDate()).padStart(2, '0');
                const h = String(now.getHours()).padStart(2, '0');
                const mm = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
                launchEl.value = `${y}-${m}-${d}T${h}:${mm}`;
            })();
            ['input'].forEach(evt => {
                if (budgetEl) budgetEl.addEventListener(evt, () => { enforceConstraints(); updateCalc(); });
                if (durationEl) durationEl.addEventListener(evt, () => { enforceConstraints(); updateCalc(); });
            });
            ['blur'].forEach(evt => {
                if (budgetEl) budgetEl.addEventListener(evt, () => { clampOnBlur(); updateCalc(); });
                if (durationEl) durationEl.addEventListener(evt, () => { clampOnBlur(); updateCalc(); });
            });
            function showStatus(message, type) {
                const statusMessage = document.getElementById('statusMessage');
                if (!statusMessage) return;
                statusMessage.className = `status-message ${type}`;
                statusMessage.innerHTML = message;
                statusMessage.classList.remove('hidden');
                if (window.tr && window.tr.refresh) { window.tr.refresh(); }
                setTimeout(() => statusMessage.classList.add('hidden'), 5000);
            }
            updateCalc();
            let captchaSolution = null;
            function generateCaptcha() {
                const rand = window.AdsSecurity.getRandomOperation();
                captchaSolution = rand.answer;
                const cq = document.getElementById('captchaQuestion');
                if (cq) cq.textContent = rand.question;
            }
            function validateCaptcha(ans) {
                return parseInt(ans) === captchaSolution;
            }
            generateCaptcha();
            submitBtn.addEventListener('click', async () => {
                const isRTLSubmit = document.documentElement.dir === 'rtl';
                const phoneValue = `${phonePrefix.value}${phoneNumber.value}`;
                if (!fullName.value || !email.value || !phoneNumber.value || !budgetEl.value || !durationEl.value || !launchEl.value) {
                    showStatus(isRTLSubmit ? '<p data-tr="يرجى ملء جميع الحقول المطلوبة">Please fill in all required fields</p>' : '<p>Please fill in all required fields</p>', 'error');
                    return;
                }
                const capAns = document.getElementById('captchaAnswer')?.value;
                if (!validateCaptcha(capAns)) {
                    showStatus('<p data-tr="فشل في التحقق الأمني. يرجى التحقق من إجابتك.">Security verification failed. Please check your answer.</p>', 'error');
                    generateCaptcha();
                    return;
                }
                clampOnBlur();
                updateCalc();
                const goalValue = goal.value === 'custom' && goalOther.value ? goalOther.value : goal.options[goal.selectedIndex]?.text;
                const platformText = platform ? platform.options[platform.selectedIndex]?.text : '-';
                const formObj = {
                    fullName: fullName.value.trim(),
                    email: email.value.trim(),
                    phone: phoneValue.trim(),
                    budget: budgetEl.value.trim(),
                    duration: durationEl.value.trim(),
                    launch: launchEl.value.trim(),
                    platform: platformText,
                    goal: goalValue,
                    note: document.getElementById('note')?.value.trim() || ''
                };
                const message = (formObj.note || '').toLowerCase();
                const name = (formObj.fullName || '').toLowerCase();
                const spamKeywords = [
                    'viagra','casino','lottery','winner','congratulations','click here','free money','make money fast','work from home','weight loss','diet pills','crypto','bitcoin investment'
                ];
                const hasSpamKeywords = spamKeywords.some(k => message.includes(k) || name.includes(k));
                if (hasSpamKeywords) {
                    showStatus('<p data-tr="الرسالة تحتوي على محتوى مشبوه.">The message contains suspicious content.</p>', 'error');
                    return;
                }
                const linkCount = (message.match(/https?:\/\//g) || []).length;
                 if (linkCount > 2) {
                     showStatus('<p data-tr="عدد الروابط في الرسالة كثير جداً.">The number of links in the message is too many.</p>', 'error');
                     return;
                 }
                if (message.length && message.length < 5) {
                    showStatus('<p data-tr="الرسالة قصيرة جداً.">The message is too short.</p>', 'error');
                    return;
                }
                if (message.length > 2000) {
                    showStatus('<p data-tr="الرسالة طويلة جداً.">The message is too long.</p>', 'error');
                    return;
                }
                submitBtn.disabled = true;
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span><span data-tr="جاري الإرسال...">Sending...</span>';
                try {
                    const embed = {
                        title: '📢 New Ad Campaign Request',
                        color: 0x3B82F6,
                        fields: [
                            { name: '👤 Name', value: formObj.fullName, inline: true },
                            { name: '📧 Email', value: formObj.email, inline: true },
                            { name: '📞 Phone', value: formObj.phone, inline: false },
                            { name: '💰 Budget (DH)', value: formObj.budget, inline: true },
                            { name: '🕑 Duration (days)', value: formObj.duration, inline: true },
                            { name: '📅 Launch', value: formObj.launch, inline: false },
                            { name: '🗂 Platform', value: formObj.platform, inline: true },
                            { name: '🎯 Objective', value: formObj.goal, inline: true },
                            { name: '📝 Notes', value: formObj.note || '-', inline: false }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: { text: 'MawiMan Ads Form - Today at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }
                    };
                    const payload = { embeds: [embed] };
                    const resp = await window.AdsSecurity.sendWebhook(payload);
                    if (!resp.ok) {
                        const t = await resp.text();
                        throw new Error(`Discord webhook failed: ${resp.status} ${t}`);
                    }
                    showStatus('<p data-tr="تم إرسال الطلب بنجاح! سأرد عليك قريباً.">Request sent successfully! I will reply to you soon.</p>', 'success');
                    document.getElementById('ads-form')?.reset();
                    generateCaptcha();
                } catch (err) {
                    console.error(err);
                    showStatus('<p data-tr="فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.">Failed to send request. Please try again.</p>', 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
            });
        })();