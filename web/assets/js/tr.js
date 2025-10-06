/**
 * Translation Library
 * Handles language switching between Arabic and English
 * Uses data-tr attributes to store Arabic translations
 */

if (typeof TranslationManager === 'undefined') {
class TranslationManager {
    constructor() {
        this.currentLanguage = null; // Will be determined by initialization logic
        this.originalTexts = new WeakMap(); // Store original English texts using WeakMap
        this.originalPlaceholders = new WeakMap(); // Store original placeholders for inputs/textareas
        this.init();
    }

    /**
     * Get language preference from cookie
     */
    getLanguageFromCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'language') {
                return value;
            }
        }
        return null;
    }

    /**
     * Get language from URL parameter (?tr=ar or ?tr=en)
     */
    getLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const trParam = urlParams.get('tr');
        
        if (trParam === 'ar' || trParam === 'en') {
            return trParam;
        }
        
        return null;
    }

    /**
     * Remove language parameter from URL without reloading the page
     */
    cleanLanguageFromURL() {
        const url = new URL(window.location);
        url.searchParams.delete('tr');
        window.history.replaceState({}, document.title, url.toString());
    }

    /**
     * Get user's country code using geolocation API
     */
    async getUserCountry() {
        // Prefer position obtained after explicit user consent (set by script.js)
        if (window.__geoPosition && window.__geoPosition.coords) {
            try {
                const { latitude, longitude } = window.__geoPosition.coords;
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await response.json();
                return data.countryCode || data.country_code || null;
            } catch (e) {
                console.log('Reverse geocode from stored position failed:', e.message);
            }
        }
        try {
            // Determine if we can use Geolocation API (requires secure context or localhost)
            const hostname = window.location.hostname;
            const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
            const canUseGeo = typeof navigator.geolocation !== 'undefined' && (window.isSecureContext || isLocalhost);
            if (!canUseGeo) {
                throw new Error('Geolocation unavailable in insecure context or not supported');
            }
            
            // First try to get location using geolocation API
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    enableHighAccuracy: false
                });
            });

            // Use a free geolocation service to get country from coordinates
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
            const data = await response.json();
            
            return data.countryCode;
        } catch (error) {
            console.log('Geolocation failed:', error.message);
            
            // Fallback: Try to get country from IP using reliable free services (with multiple fallbacks)
            try {
                // 1) ipwho.is (HTTPS, CORS-friendly)
                const resp1 = await fetch('https://ipwho.is/', { cache: 'no-store' });
                if (resp1.ok) {
                    const data1 = await resp1.json();
                    if (data1 && data1.country_code) {
                        return data1.country_code;
                    }
                }

                // 2) ip-api.com (HTTPS). Limit fields to reduce payload
                const resp2 = await fetch('https://ip-api.com/json?fields=status,countryCode');
                if (resp2.ok) {
                    const data2 = await resp2.json();
                    if (data2 && data2.status === 'success' && data2.countryCode) {
                        return data2.countryCode;
                    }
                }

                // 3) Final fallback: return null to trigger browser language detection
                return null;
            } catch (ipError) {
                console.log('IP geolocation failed:', ipError.message);
                return null;
            }
        }
    }

    /**
     * Check if country code belongs to an Arabic-speaking country
     */
    isArabicCountry(countryCode) {
        const arabicCountries = [
            'AE', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 
            'MA', 'MR', 'OM', 'PS', 'QA', 'SA', 'SD', 'SO', 'SY', 'TN', 'YE'
        ];
        return arabicCountries.includes(countryCode?.toUpperCase());
    }

    /**
     * Get language based on user's browser language
     */
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Check if browser language is Arabic or any Arabic dialect
        if (browserLang.startsWith('ar')) {
            return 'ar';
        }
        
        return 'en'; // Default to English for all other languages
    }

    /**
     * Determine default language based on location and browser preferences
     */
    async getDefaultLanguage() {
        try {
            const countryCode = await this.getUserCountry();
            
            if (countryCode && this.isArabicCountry(countryCode)) {
                return 'ar';
            } else if (countryCode) {
                return 'en';
            } else {
                // Fallback to browser language if geolocation fails
                return this.getBrowserLanguage();
            }
        } catch (error) {
            console.log('Default language detection failed:', error.message);
            // Final fallback to browser language
            return this.getBrowserLanguage();
        }
    }

    /**
     * Save language preference to cookie
     */
    saveLanguageToCookie(language) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Expire in 1 year
        document.cookie = `language=${language}; expires=${expiryDate.toUTCString()}; path=/`;
    }

    /**
     * Initialize the translation system
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTranslation());
        } else {
            this.setupTranslation();
        }
    }

    /**
     * Setup translation system and button event
     */
    async setupTranslation() {
        // Store original English texts
        this.storeOriginalTexts();
        
        // Setup translation button
        this.setupTranslationButton();

        // Determine language with priority: URL > Cookie > Location/Browser
        await this.initializeLanguage();
    }

    /**
     * Initialize language based on priority: URL parameter > Cookie > Location/Browser preference
     */
    async initializeLanguage() {
        let selectedLanguage = null;

        // 1. Check URL parameter first (highest priority)
        const urlLanguage = this.getLanguageFromURL();
        if (urlLanguage) {
            selectedLanguage = urlLanguage;
            // Clean URL parameter after using it
            this.cleanLanguageFromURL();
            console.log(`Language set from URL parameter: ${selectedLanguage}`);
        }
        
        // 2. Check cookie if no URL parameter
        if (!selectedLanguage) {
            selectedLanguage = this.getLanguageFromCookie();
            if (selectedLanguage) {
                console.log(`Language set from cookie: ${selectedLanguage}`);
            }
        }
        
        // 3. Use location/browser detection as fallback
        if (!selectedLanguage) {
            selectedLanguage = await this.getDefaultLanguage();
            console.log(`Language set from location/browser detection: ${selectedLanguage}`);
        }

        // Set the determined language
        this.currentLanguage = selectedLanguage || 'ar'; // Final fallback to Arabic

        // Apply the language
        if (this.currentLanguage === 'ar') {
            this.translateToArabic();
        } else {
            this.translateToEnglish();
        }
    }

    /**
     * Setup translation button event listeners
     */
    setupTranslationButton() {
        const translateBtn = document.getElementById('btn_tr');
        if (translateBtn && !translateBtn.hasAttribute('data-tr-listener')) {
            translateBtn.addEventListener('click', () => this.toggleLanguage());
            translateBtn.setAttribute('data-tr-listener', 'true');
        }
    }

    /**
     * Store original English texts for elements with data-tr attributes
     */
    storeOriginalTexts() {
        const elementsWithTranslation = document.querySelectorAll('[data-tr]');
        
        elementsWithTranslation.forEach(element => {
            if (element.hasAttribute('placeholder')) {
                if (!this.originalPlaceholders.has(element)) {
                    this.originalPlaceholders.set(element, element.getAttribute('placeholder') || '');
                }
            } else {
                if (!this.originalTexts.has(element)) {
                    const originalText = (element.textContent || '').trim();
                    this.originalTexts.set(element, originalText);
                }
            }
        });
        // Also store original placeholders for elements using data-tr-placeholder
        const elementsWithPlaceholderTranslation = document.querySelectorAll('[data-tr-placeholder]');
        elementsWithPlaceholderTranslation.forEach(element => {
            if (!this.originalPlaceholders.has(element)) {
                this.originalPlaceholders.set(element, element.getAttribute('placeholder') || '');
            }
        });
    }

    /**
     * Toggle between Arabic and English
     */
    toggleLanguage() {
        if (this.currentLanguage === 'en') {
            this.translateToArabic();
        } else {
            this.translateToEnglish();
        }
        // Force full page reload to apply all RTL/LTR layout changes and refreshed content
        try {
            window.location.reload();
        } catch (e) {
            // Fallback in rare cases
            window.location.href = window.location.href;
        }
    }

    /**
     * Translate all elements to Arabic
     */
    translateToArabic() {
        const elementsWithTranslation = document.querySelectorAll('[data-tr]');
        
        elementsWithTranslation.forEach(element => {
            const arabicText = element.getAttribute('data-tr');
            if (arabicText) {
                if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', arabicText);
                } else {
                    element.textContent = arabicText;
                }
            }
        });
        // Apply Arabic placeholders for elements using data-tr-placeholder
        const elementsWithPlaceholderTranslation = document.querySelectorAll('[data-tr-placeholder]');
        elementsWithPlaceholderTranslation.forEach(element => {
            const arabicPlaceholder = element.getAttribute('data-tr-placeholder');
            if (arabicPlaceholder) {
                element.setAttribute('placeholder', arabicPlaceholder);
            }
        });

        // Update page attributes
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        
        // Update button text
        const translateBtn = document.getElementById('btn_tr');
        if (translateBtn) {
            translateBtn.innerHTML = '<span class="material-symbols-rounded">translate</span><span>English</span>';
        }

        this.currentLanguage = 'ar';
        
        // Save to cookie
        this.saveLanguageToCookie('ar');
        
        // Trigger custom event
        this.dispatchLanguageChangeEvent('ar');
    }

    /**
     * Translate all elements to English
     */
    translateToEnglish() {
        const elementsWithTranslation = document.querySelectorAll('[data-tr]');
        
        elementsWithTranslation.forEach(element => {
            if (element.hasAttribute('placeholder')) {
                const originalPlaceholder = this.originalPlaceholders.get(element);
                if (typeof originalPlaceholder !== 'undefined') {
                    element.setAttribute('placeholder', originalPlaceholder);
                }
            } else {
                const originalText = this.originalTexts.get(element);
                if (typeof originalText !== 'undefined') {
                    element.textContent = originalText;
                }
            }
        });
        // Restore original placeholders for elements using data-tr-placeholder
        const elementsWithPlaceholderTranslation = document.querySelectorAll('[data-tr-placeholder]');
        elementsWithPlaceholderTranslation.forEach(element => {
            const originalPlaceholder = this.originalPlaceholders.get(element);
            if (typeof originalPlaceholder !== 'undefined') {
                element.setAttribute('placeholder', originalPlaceholder);
            }
        });

        // Update page attributes
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        
        // Update button text
        const translateBtn = document.getElementById('btn_tr');
        if (translateBtn) {
            translateBtn.innerHTML = '<span class="material-symbols-rounded">translate</span><span>Arabic</span>';
        }

        this.currentLanguage = 'en';
        
        // Save to cookie
        this.saveLanguageToCookie('en');
        
        // Trigger custom event
        this.dispatchLanguageChangeEvent('en');
    }

    /**
     * Dispatch language change event
     */
    dispatchLanguageChangeEvent(language) {
        const event = new CustomEvent('languageChanged', {
            detail: { language: language }
        });
        document.dispatchEvent(event);
    }

    /**
     * Add new translation dynamically
     */
    addTranslation(element, arabicText) {
        if (element && arabicText) {
            element.setAttribute('data-tr', arabicText);
            
            if (element.hasAttribute('placeholder')) {
                // Store original placeholder if not already stored
                if (!this.originalPlaceholders.has(element)) {
                    this.originalPlaceholders.set(element, element.getAttribute('placeholder') || '');
                }
                // Apply current language to placeholder
                if (this.currentLanguage === 'ar') {
                    element.setAttribute('placeholder', arabicText);
                }
            } else {
                // Store original text if not already stored
                if (!this.originalTexts.has(element)) {
                    this.originalTexts.set(element, (element.textContent || '').trim());
                }
                // Apply current language to text
                if (this.currentLanguage === 'ar') {
                    element.textContent = arabicText;
                }
            }
        }
    }

    /**
     * Remove translation from element
     */
    removeTranslation(element) {
        if (element) {
            element.removeAttribute('data-tr');
            this.originalTexts.delete(element);
            this.originalPlaceholders.delete(element);
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Set language programmatically
     */
    setLanguage(language) {
        if (language === 'ar' && this.currentLanguage !== 'ar') {
            this.translateToArabic();
        } else if (language === 'en' && this.currentLanguage !== 'en') {
            this.translateToEnglish();
        }
    }

    /**
     * Apply input dir and reposition .material-symbols-rounded icons based on current direction
     */
    applyInputDirAndIcons() {
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || getComputedStyle(document.documentElement).direction === 'rtl';
        document.querySelectorAll('.relative').forEach(container => {
            const icon = container.querySelector('.material-symbols-rounded');
            const input = container.querySelector('input, textarea');
            if (!icon || !input) return;
            const cs = getComputedStyle(input);
            if (!input.dataset.padLeft) input.dataset.padLeft = cs.paddingLeft;
            if (!input.dataset.padRight) input.dataset.padRight = cs.paddingRight;
            if (isRTL) {
                input.setAttribute('dir', 'rtl');
                icon.style.left = 'auto';
                icon.style.right = '0.75rem';
                input.style.paddingLeft = input.dataset.padRight;
                input.style.paddingRight = input.dataset.padLeft;
            } else {
                input.setAttribute('dir', 'ltr');
                icon.style.right = 'auto';
                icon.style.left = '0.75rem';
                input.style.paddingLeft = input.dataset.padLeft;
                input.style.paddingRight = input.dataset.padRight;
            }
        });
    }

    /**
     * Refresh translations (useful after dynamic content is loaded)
     */
    refreshTranslations() {
        this.storeOriginalTexts();
        if (this.currentLanguage === 'ar') {
            // Apply Arabic translations without triggering events to avoid infinite loop
            const elementsWithTranslation = document.querySelectorAll('[data-tr]');
            
            elementsWithTranslation.forEach(element => {
                const arabicText = element.getAttribute('data-tr');
                if (arabicText) {
                    if (element.hasAttribute('placeholder')) {
                        element.setAttribute('placeholder', arabicText);
                    } else {
                        element.textContent = arabicText;
                    }
                }
            });
            // Also apply Arabic placeholders from data-tr-placeholder
            const elementsWithPlaceholderTranslation = document.querySelectorAll('[data-tr-placeholder]');
            elementsWithPlaceholderTranslation.forEach(element => {
                const arabicPlaceholder = element.getAttribute('data-tr-placeholder');
                if (arabicPlaceholder) {
                    element.setAttribute('placeholder', arabicPlaceholder);
                }
            });

            // Update page attributes
            document.documentElement.setAttribute('lang', 'ar');
            document.documentElement.setAttribute('dir', 'rtl');
            
            // Update button text
            const translateBtn = document.getElementById('btn_tr');
            if (translateBtn) {
                translateBtn.innerHTML = '<span class="material-symbols-rounded">translate</span><span>English</span>';
            }
        }
        // Reflow inputs and icons after any translation refresh
        this.applyInputDirAndIcons();
    }
}

// Initialize the Translation Manager
if (typeof translationManager === 'undefined') {
    const translationManager = new TranslationManager();

    // Expose useful methods globally
    window.tr = {
        toggle: () => translationManager.toggleLanguage(),
        setLanguage: (lang) => translationManager.setLanguage(lang),
        getCurrentLanguage: () => translationManager.getCurrentLanguage(),
        addTranslation: (element, arabicText) => translationManager.addTranslation(element, arabicText),
        removeTranslation: (element) => translationManager.removeTranslation(element),
        refresh: () => translationManager.refreshTranslations()
    };

    // Listen for HTMX content changes to refresh translations
    document.addEventListener('languageChanged', (event) => {
        console.log(`Language changed to: ${event.detail.language}`);
        // Note: Don't call refreshTranslations here to avoid infinite loop
        // The translation is already applied in translateToArabic/translateToEnglish
    });

    // Refresh translations when new content is loaded (for HTMX integration)
    const observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;
        let shouldSetupButtons = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes have data-tr attributes
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.hasAttribute && node.hasAttribute('data-tr') || 
                            node.querySelector && node.querySelector('[data-tr]')) {
                            shouldRefresh = true;
                        }
                        
                        // Check if translation buttons were added
                        if (node.id === 'btn_tr' ||
                            (node.querySelector && (node.querySelector('#btn_tr')))) {
                            shouldSetupButtons = true;
                        }
                    }
                });
            }
        });
        
        if (shouldRefresh) {
            // Temporarily disconnect observer to prevent infinite loop
            observer.disconnect();
            setTimeout(() => {
                translationManager.refreshTranslations();
                // Reconnect observer after processing
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }, 100);
        }
        
        if (shouldSetupButtons) {
            setTimeout(() => translationManager.setupTranslationButton(), 100);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
}


console.log('Translation Library loaded successfully');