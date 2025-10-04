(function(){
  if (typeof window !== 'undefined' && window.ContactFormHandler) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.__contactFormHandlerInstance) {
        window.__contactFormHandlerInstance = new window.ContactFormHandler();
      }
    });
    return;
  }

/**
 * Webhooks.js - Discord Webhook Integration with Spam Protection
 * Handles form submissions and sends messages to Discord webhook
 */

class ContactFormHandler {
    constructor() {
        this.webhookUrl = 'https://discord.com/api/webhooks/1419852104918499368/6KQMaa0dCTQM_EiLX0Go0mIzPN2Xr24DIC5IpZmd-Z7xCHgrntt9SzaTLWgGAokyUlFK';
        this.submissionCooldown = 30000; // تقليل وقت الانتظار إلى 30 ثانية
        this.lastSubmissionTime = 0;
        this.captchaAnswer = null;
        this.isSubmitting = false; // منع الإرسال المتعدد
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateCaptcha();
        // Set initial contact method requirements based on default selection
        const phoneMethod = document.getElementById('phoneMethod');
        const selectedMethod = phoneMethod?.checked ? 'phone' : 'email';
        this.toggleContactMethod(selectedMethod);
}

    setupEventListeners() {
        // Contact method toggle
        const phoneMethod = document.getElementById('phoneMethod');
        const emailMethod = document.getElementById('emailMethod');
        
        if (phoneMethod && emailMethod) {
            phoneMethod.addEventListener('change', () => this.toggleContactMethod('phone'));
            emailMethod.addEventListener('change', () => this.toggleContactMethod('email'));
        }

        // Form submission
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    toggleContactMethod(method) {
        const phoneFields = document.getElementById('phoneFields');
        const emailFields = document.getElementById('emailFields');
        const phoneInput = document.getElementById('phoneNumber');
        const emailInput = document.getElementById('email');
        
        if (method === 'phone') {
            phoneFields?.classList.remove('hidden');
            emailFields?.classList.add('hidden');
            
            // Make phone fields required and focusable
            phoneInput?.setAttribute('required', '');
            if (phoneInput) phoneInput.disabled = false;
            // Remove requirement from email and disable it
            emailInput?.removeAttribute('required');
            if (emailInput) emailInput.disabled = true;
        } else {
            phoneFields?.classList.add('hidden');
            emailFields?.classList.remove('hidden');
            
            // Make email fields required and focusable
            emailInput?.setAttribute('required', '');
            if (emailInput) emailInput.disabled = false;
            // Remove requirement from phone and disable it
            phoneInput?.removeAttribute('required');
            if (phoneInput) phoneInput.disabled = true;
        }
        
        // Subject field is always required since it's always visible
        document.getElementById('subject')?.setAttribute('required', '');
    }

    generateCaptcha() {
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

        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        this.captchaAnswer = randomOperation.answer;
        
        const captchaQuestion = document.getElementById('captchaQuestion');
        if (captchaQuestion) {
            captchaQuestion.textContent = randomOperation.question;
        }
    }

    validateCaptcha(userAnswer) {
        return parseInt(userAnswer) === this.captchaAnswer;
    }

    checkSpamProtection(formData) {
        const now = Date.now();
        
        // Check submission cooldown
        if (now - this.lastSubmissionTime < this.submissionCooldown) {
            const remainingTime = Math.ceil((this.submissionCooldown - (now - this.lastSubmissionTime)) / 1000);
            return {
                isValid: false,
            };
        }

        // Check for suspicious patterns
        const message = formData.get('message')?.toLowerCase() || '';
        const name = formData.get('fullName')?.toLowerCase() || '';
        
        // Common spam keywords
        const spamKeywords = [
            'viagra', 'casino', 'lottery', 'winner', 'congratulations',
            'click here', 'free money', 'make money fast', 'work from home',
            'weight loss', 'diet pills', 'crypto', 'bitcoin investment'
        ];

        const hasSpamKeywords = spamKeywords.some(keyword => 
            message.includes(keyword) || name.includes(keyword)
        );

        if (hasSpamKeywords) {
            return {
                isValid: false,
                message: '<p data-tr="الرسالة تحتوي على محتوى مشبوه.">The message contains suspicious content.</p>'
            };
        }

        // Check for excessive links
        const linkCount = (message.match(/https?:\/\//g) || []).length;
        if (linkCount > 2) {
            return {
                isValid: false,
                message: '<p data-tr="عدد الروابط في الرسالة كثير جداً.">The number of links in the message is too many.</p>'
            };
        }

        // Check message length
        if (message.length < 10) {
            return {
                isValid: false,
                message: '<p data-tr="الرسالة قصيرة جداً.">The message is too short.</p>'
            };
        }

        if (message.length > 2000) {
            return {
                isValid: false,
                message: '<p data-tr="الرسالة طويلة جداً.">The message is too long.</p>'
            };
        }

        return { isValid: true };
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        // منع الإرسال المتعدد
        if (this.isSubmitting) {
            return;
        }
        
        this.isSubmitting = true;
        
        const submitBtn = document.getElementById('submitBtn');
        const statusMessage = document.getElementById('statusMessage');
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-rounded">hourglass_empty</span><span data-tr="جاري الإرسال...">Sending...</span>';
        
        try {
            const formData = new FormData(e.target);
            
            // Validate captcha
            const captchaAnswer = formData.get('captchaAnswer');
            if (!this.validateCaptcha(captchaAnswer)) {
                throw new Error('<p data-tr="فشل في التحقق الأمني. يرجى التحقق من إجابتك.">Security verification failed. Please check your answer.</p>');
            }

            // Check spam protection
            const spamCheck = this.checkSpamProtection(formData);
            if (!spamCheck.isValid) {
                throw new Error(spamCheck.message);
            }

            // Prepare Discord message
            const discordMessage = this.prepareDiscordMessage(formData);
            
            // Send to Discord with timeout
            await Promise.race([
                this.sendToDiscord(discordMessage),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('End time.')), 10000)
                )
            ]);
            
            // Success
            this.showStatus('<p data-tr="تم إرسال الرسالة بنجاح! سأرد عليك قريباً.">Message sent successfully! I will reply to you soon.</p>', 'success');
            e.target.reset();
            this.generateCaptcha(); // Generate new captcha
            this.lastSubmissionTime = Date.now();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showStatus(error.message || '<p data-tr="فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.">Failed to send message. Please try again.</p>', 'error');
        } finally {
            // Re-enable submit button
            this.isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="material-symbols-rounded">send</span><span data-tr="إرسال الرسالة">Send Message</span>';
        }
    }

    prepareDiscordMessage(formData) {
        const contactMethod = formData.get('contactMethod');
        const fullName = formData.get('fullName');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        let contactInfo = '';
        if (contactMethod === 'phone') {
            const countryCode = formData.get('countryCode');
            const phoneNumber = formData.get('phoneNumber');
            contactInfo = `📱 Phone: ${countryCode} ${phoneNumber}`;
        } else {
            const email = formData.get('email');
            contactInfo = `📧 Email: ${email}`;
        }

        const embed = {
            title: "📬 New Contact Form Message",
            color: 0x3B82F6, // Blue color
            fields: [
                {
                    name: "👤 Name",
                    value: fullName,
                    inline: true
                },
                {
                    name: "📞 Contact Method",
                    value: contactMethod === 'phone' ? 'Phone' : 'Email',
                    inline: true
                },
                {
                    name: "📋 Subject",
                    value: subject,
                    inline: false
                },
                {
                    name: "📱 Contact Info",
                    value: contactInfo,
                    inline: false
                },
                {
                    name: "💬 Message",
                    value: message.length > 1000 ? message.substring(0, 1000) + '...' : message,
                    inline: false
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "MawiMan Contact Form - Today at " + new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true 
                })
            }
        };

        return {
            embeds: [embed]
        };
    }

    async sendToDiscord(payload) {
        const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Discord webhook failed: ${response.status} ${errorText}`);
        }

        return response;
    }

    showStatus(message, type) {
        const statusMessage = document.getElementById('statusMessage');
        if (!statusMessage) return;

        statusMessage.className = `status-message ${type}`;
        statusMessage.innerHTML = message; // Changed from textContent to innerHTML to support HTML
        statusMessage.classList.remove('hidden');

        // Refresh translations for new content
        if (window.tr && window.tr.refresh) {
            window.tr.refresh();
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    }
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.__contactFormHandlerInstance) {
      window.__contactFormHandlerInstance = new ContactFormHandler();
    }
  });
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
} else if (typeof window !== 'undefined') {
    window.ContactFormHandler = ContactFormHandler;
}
})();