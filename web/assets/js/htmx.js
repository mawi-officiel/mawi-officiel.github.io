/**
 * Custom HTMX Library
 * Automatically loads and renders HTML templates based on <htmx> tags
 * Uses data-htmx-folder attribute to determine the template folder path
 */

if (typeof CustomHTMX === 'undefined') {
class CustomHTMX {
    constructor() {
        this.templateFolder = this.getTemplateFolder();
        this.cache = new Map(); // Cache for loaded templates
        this.pendingScripts = []; // Collect scripts from templates to insert programmatically
        this.init();
    }

    /**
     * Execute scripts in the loaded content
     */
    executeScripts() {
        // Find script tags that came from templates and haven't been executed yet
        const scripts = document.querySelectorAll('script[data-htmx-template]:not([data-htmx-executed])');
        
        scripts.forEach(script => {
            // Mark as executed to prevent re-execution
            script.setAttribute('data-htmx-executed', 'true');
            
            if (script.getAttribute('src')) {
                // External script - check if it's already present to prevent duplicates
                const srcAttr = script.getAttribute('src');
                let existingScript = null;
                try {
                    existingScript = document.querySelector(`script[src="${CSS.escape(srcAttr)}"]`);
                } catch (_) {
                    existingScript = Array.from(document.querySelectorAll('script[src]')).find(el => (el.getAttribute('src') || '') === srcAttr);
                }
                if (existingScript && existingScript !== script) {
                    // Script already exists, remove the duplicate
                    script.remove();
                    return;
                }
                
                // Recreate the external script tag as-is (no inlining, no extra attributes)
                const newScript = document.createElement('script');
                newScript.src = srcAttr;
                
                // Copy all other attributes (except HTMX markers and src)
                Array.from(script.attributes).forEach(attr => {
                    const name = attr.name;
                    if (name !== 'data-htmx-executed' && name !== 'data-htmx-template' && name !== 'src') {
                        newScript.setAttribute(name, attr.value);
                    }
                });
                
                // Replace the old script with the new external one to trigger natural loading
                script.parentNode.replaceChild(newScript, script);
            } else {
                // Inline script - execute the content without altering attributes
                try {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    
                    // Copy all attributes (except HTMX markers)
                    Array.from(script.attributes).forEach(attr => {
                        const name = attr.name;
                        if (name !== 'data-htmx-executed' && name !== 'data-htmx-template') {
                            newScript.setAttribute(name, attr.value);
                        }
                    });
                    
                    // Replace the old script with the new one
                    script.parentNode.replaceChild(newScript, script);
                } catch (error) {
                    console.error('Error executing inline script:', error);
                }
            }
        });
    }

    /**
     * Get the template folder from data-htmx-folder attribute
     */
    getTemplateFolder() {
        const htmlElement = document.documentElement;
        const folder = htmlElement.getAttribute('data-htmx-folder');
        return folder || 'templates'; // Default to 'templates' if not specified
    }

    /**
     * Initialize the HTMX system
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processHTMXElements());
        } else {
            this.processHTMXElements();
        }
    }

    /**
     * Process all <htmx> elements in the document
     */
    async processHTMXElements() {
        const htmxElements = document.querySelectorAll('htmx:not([data-htmx-processed])');
        
        for (const element of htmxElements) {
            const templateName = element.textContent.trim();
            // Skip elements that only contain loading text or are empty
            if (templateName && templateName !== 'Loading...' && !templateName.includes('Loading...')) {
                // Mark as processed before loading to prevent reprocessing
                element.setAttribute('data-htmx-processed', 'true');
                // Store the original template name as a data attribute
                element.setAttribute('data-original-template', templateName);
                await this.loadTemplate(element, templateName);
            }
        }
    }

    /**
     * Get URL parameters
     */
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return Object.fromEntries(urlParams.entries());
    }

    /**
     * Validate and sanitize template name for security
     * @param {string} templateName - The template name to validate
     * @returns {string|null} - Sanitized template name or null if invalid
     */
    validateTemplateName(templateName) {
        if (!templateName || typeof templateName !== 'string') {
            return null;
        }

        // Remove any whitespace
        templateName = templateName.trim();

        // Check for empty string
        if (!templateName) {
            return null;
        }

        // Prevent path traversal attacks
        if (templateName.includes('..') || templateName.includes('/') || templateName.includes('\\')) {
            console.warn(`Security: Invalid template name detected: ${templateName}`);
            return null;
        }

        // Allow only alphanumeric characters, hyphens, and underscores
        const validPattern = /^[a-zA-Z0-9_-]+$/;
        if (!validPattern.test(templateName)) {
            console.warn(`Security: Template name contains invalid characters: ${templateName}`);
            return null;
        }

        // Limit length to prevent abuse
        if (templateName.length > 50) {
            console.warn(`Security: Template name too long: ${templateName}`);
            return null;
        }

        return templateName;
    }

    /**
     * Check if a template file exists
     * @param {string} templatePath - The full path to the template
     * @returns {Promise<boolean>} - True if file exists, false otherwise
     */
    async checkTemplateExists(templatePath) {
        try {
            // Use GET request with a small range to minimize data transfer
            const response = await fetch(templatePath, { 
                method: 'GET',
                headers: {
                    'Range': 'bytes=0-0'
                }
            });
            // Accept both 200 (full content) and 206 (partial content) as success
            return response.ok || response.status === 206;
        } catch (error) {
            return false;
        }
    }

    /**
     * Clean invalid parameters from URL
     * @param {string} paramName - The parameter name to clean
     */
    cleanUrlParameter(paramName) {
        const url = new URL(window.location);
        url.searchParams.delete(paramName);
        
        // Update browser URL without reloading the page
        window.history.replaceState({}, document.title, url.toString());
    }

    /**
     * Extract <head> from a fetched template, merge into document.head,
     * and return the body HTML content to insert into the page
     * @param {string} templateHTML
     * @returns {string} body HTML content after applying head
     */
    extractAndApplyHead(templateHTML) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(templateHTML, 'text/html');
            // Merge head elements into the current document
            this.updateDocumentHead(doc.head);
            // Return the body content as a DocumentFragment to avoid innerHTML sanitization
            if (doc.body) {
                // Mark all body scripts so executeScripts can scope correctly
                doc.body.querySelectorAll('script').forEach(s => s.setAttribute('data-htmx-template', 'true'));
                // Collect body scripts and exclude them from the fragment to insert later programmatically
                this.pendingScripts = [];
                const frag = document.createDocumentFragment();
                Array.from(doc.body.childNodes).forEach(node => {
                    if (node.nodeName && node.nodeName.toLowerCase() === 'script') {
                        const attrs = {};
                        Array.from(node.attributes || []).forEach(attr => {
                            attrs[attr.name] = attr.value;
                        });
                        if (node.getAttribute && node.getAttribute('src')) {
                            this.pendingScripts.push({ type: 'external', src: node.getAttribute('src'), attrs });
                        } else {
                            this.pendingScripts.push({ type: 'inline', content: node.textContent || '', attrs });
                        }
                        // Skip adding script node to fragment
                        return;
                    }
                    frag.appendChild(node.cloneNode(true));
                });
                return frag;
            }
            // Fallback: strip head and create a contextual fragment
            const withoutHead = templateHTML.replace(/<head[\s\S]*?<\/head>/i, '').trim();
            const range = document.createRange();
            range.selectNode(document.body);
            return range.createContextualFragment(withoutHead);
        } catch (e) {
            console.warn('HTMX: Failed to parse template head:', e);
            const range = document.createRange();
            range.selectNode(document.body);
            return range.createContextualFragment(templateHTML);
        }
    }

    /**
     * Update/merge document.head with elements from template head
     * - title/meta(name/property)/link(rel=canonical, icon, stylesheet)
     * @param {HTMLHeadElement} headEl
     */
    updateDocumentHead(headEl) {
        if (!headEl) return;
        // Handle <title> or meta[name="title"]
        const titleEl = headEl.querySelector('title');
        if (titleEl) {
            const newTitleText = (titleEl.textContent || '').trim();
            const existingTitle = document.head.querySelector('title');
            if (existingTitle) {
                existingTitle.textContent = newTitleText;
                const trAttr = titleEl.getAttribute('data-tr');
                if (trAttr) existingTitle.setAttribute('data-tr', trAttr);
            } else {
                document.head.appendChild(titleEl.cloneNode(true));
            }
            if (newTitleText) document.title = newTitleText;
        } else {
            const metaTitle = headEl.querySelector('meta[name="title"]');
            if (metaTitle && metaTitle.getAttribute('content')) {
                document.title = metaTitle.getAttribute('content').trim();
            }
        }
        // Merge meta tags
        headEl.querySelectorAll('meta').forEach(meta => {
            const name = meta.getAttribute('name');
            const property = meta.getAttribute('property');
            const content = meta.getAttribute('content') || '';
            try {
                if (name) {
                    const existing = document.head.querySelector(`meta[name="${CSS.escape(name)}"]`);
                    if (existing) {
                        existing.setAttribute('content', content);
                    } else {
                        document.head.appendChild(meta.cloneNode(true));
                    }
                } else if (property) {
                    const existing = document.head.querySelector(`meta[property="${CSS.escape(property)}"]`);
                    if (existing) {
                        existing.setAttribute('content', content);
                    } else {
                        document.head.appendChild(meta.cloneNode(true));
                    }
                }
            } catch (err) {
                const selector = name ? `meta[name="${name}"]` : (property ? `meta[property="${property}"]` : null);
                if (selector) {
                    const existing = document.head.querySelector(selector);
                    if (existing) {
                        existing.setAttribute('content', content);
                    } else {
                        document.head.appendChild(meta.cloneNode(true));
                    }
                }
            }
        });
        // Canonical link: ensure single canonical
        const canonical = headEl.querySelector('link[rel="canonical"]');
        if (canonical) {
            document.head.querySelectorAll('link[rel="canonical"]').forEach(el => el.remove());
            document.head.appendChild(canonical.cloneNode(true));
        }
        // Icons: avoid duplicates by rel+href
        headEl.querySelectorAll('link[rel*="icon"]').forEach(link => {
            const rel = link.getAttribute('rel') || '';
            const href = link.getAttribute('href') || '';
            const existing = Array.from(document.head.querySelectorAll('link[rel*="icon"]').values())
                .find(el => (el.getAttribute('rel') || '') === rel && (el.getAttribute('href') || '') === href);
            if (!existing) {
                document.head.appendChild(link.cloneNode(true));
            }
        });
        // Stylesheets: add if not present
        headEl.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            try {
                const exists = document.head.querySelector(`link[rel="stylesheet"][href="${CSS.escape(href)}"]`);
                if (!exists) document.head.appendChild(link.cloneNode(true));
            } catch (err) {
                const exists = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]').values())
                    .find(el => (el.getAttribute('href') || '') === href);
                if (!exists) document.head.appendChild(link.cloneNode(true));
            }
        });
        // Scripts in head: add external and inline scripts if not already present
        headEl.querySelectorAll('script').forEach(script => {
            const srcAttr = script.getAttribute('src');
            if (srcAttr) {
                let exists = null;
                try {
                    exists = document.head.querySelector(`script[src="${CSS.escape(srcAttr)}"]`);
                } catch (_) {
                    exists = Array.from(document.head.querySelectorAll('script')).find(el => (el.getAttribute('src') || '') === srcAttr);
                }
                if (!exists) {
                    // Create new external script programmatically (remove async/defer)
                    const s = document.createElement('script');
                    s.src = srcAttr;
                    Array.from(script.attributes).forEach(attr => {
                        const name = attr.name;
                        if (name === 'async' || name === 'defer' || name === 'src') return;
                        s.setAttribute(name, attr.value);
                    });
                    s.removeAttribute('async');
                    s.removeAttribute('defer');
                    s.setAttribute('data-htmx-head', 'true');
                    s.setAttribute('data-htmx-template', 'true');
                    s.setAttribute('data-htmx-executed', 'true');
                    s.setAttribute('data-cfasync', 'false');
                    document.head.appendChild(s);
                }
            } else {
                // Inline script in head: create programmatically
                const s = document.createElement('script');
                s.textContent = script.textContent || '';
                Array.from(script.attributes).forEach(attr => {
                    const name = attr.name;
                    if (name === 'async' || name === 'defer') return;
                    s.setAttribute(name, attr.value);
                });
                s.removeAttribute('async');
                s.removeAttribute('defer');
                s.setAttribute('data-htmx-head', 'true');
                s.setAttribute('data-htmx-template', 'true');
                s.setAttribute('data-htmx-executed', 'true');
                s.setAttribute('data-cfasync', 'false');
                document.head.appendChild(s);
            }
        });
        // Apply Arabic translation for head if translation manager is active
        try {
            const getLang = window.tr && typeof window.tr.getCurrentLanguage === 'function' ? window.tr.getCurrentLanguage() : null;
            if (getLang === 'ar') {
                const titleTr = document.head.querySelector('title');
                if (titleTr) {
                    const arTitle = titleTr.getAttribute('data-tr');
                    if (arTitle) {
                        titleTr.textContent = arTitle;
                        document.title = arTitle;
                    }
                }
                const metaSelectors = [
                    'meta[name="title"]',
                    'meta[property="og:title"]',
                    'meta[property="twitter:title"]',
                    'meta[name="description"]',
                    'meta[property="og:description"]',
                    'meta[property="twitter:description"]'
                ];
                metaSelectors.forEach(sel => {
                    const metaEl = document.head.querySelector(sel);
                    if (metaEl) {
                        const arContent = metaEl.getAttribute('data-tr');
                        if (arContent) {
                            metaEl.setAttribute('content', arContent);
                        }
                    }
                });
                if (typeof window.tr.refresh === 'function') {
                    window.tr.refresh();
                }
            }
        } catch (e) {
            console.warn('HTMX: Failed to apply Arabic translation to head/meta:', e);
        }
    }

    /**
     * Get the template folder for a specific element
     * @param {HTMLElement} element - The htmx element
     */
    getElementTemplateFolder(element) {
        // Check if element has its own data-htmx-folder attribute
        const elementFolder = element.getAttribute('data-htmx-folder');
        if (elementFolder) {
            return elementFolder;
        }
        // Fall back to global template folder
        return this.templateFolder;
    }

    /**
     * Determine the template name based on URL parameters and element content
     * @param {HTMLElement} element - The htmx element
     * @param {string} defaultTemplate - Default template name from element content
     */
    async getTemplateName(element, defaultTemplate) {
        // Validate the default template name first
        const validDefaultTemplate = this.validateTemplateName(defaultTemplate);
        if (!validDefaultTemplate) {
            console.warn(`Security: Invalid default template name: ${defaultTemplate}`);
            return 'index'; // Fallback to safe default
        }

        // Check if element has an id attribute for URL parameter matching
        const elementId = element.getAttribute('id');
        if (elementId) {
            const urlParams = this.getUrlParams();
            const idParam = urlParams.id;
            
            // If ?id=* parameter exists, validate it
            if (idParam) {
                const validIdParam = this.validateTemplateName(idParam);
                if (validIdParam) {
                    // Check if the template file actually exists
                    const templateFolder = this.getElementTemplateFolder(element);
                    const templatePath = `${templateFolder}/${validIdParam}.html`;
                    const exists = await this.checkTemplateExists(templatePath);
                    
                    if (exists) {
                        return validIdParam;
                    } else {
                        console.warn(`Security: Template file does not exist: ${templatePath}`);
                        // Clean the invalid parameter from URL
                        this.cleanUrlParameter('id');
                        // Fall back to default template
                        return validDefaultTemplate;
                    }
                } else {
                    console.warn(`Security: Invalid id parameter: ${idParam}`);
                    // Clean the invalid parameter from URL
                    this.cleanUrlParameter('id');
                    // Fall back to default template
                    return validDefaultTemplate;
                }
            }
        }
        
        // Fall back to validated default template name
        return validDefaultTemplate;
    }

    /**
     * Load and render a template
     * @param {HTMLElement} element - The htmx element to replace
     * @param {string} templateName - Name of the template file
     */
    async loadTemplate(element, templateName) {
        // Get the appropriate template folder for this element
        const templateFolder = this.getElementTemplateFolder(element);
        
        // Get the final template name (considering URL parameters and security validation)
        const finalTemplateName = await this.getTemplateName(element, templateName);
        
        try {
            const templatePath = `${templateFolder}/${finalTemplateName}.html`;
            
            // Check cache first
            let templateContent = this.cache.get(templatePath);
            
            if (!templateContent) {
                // Show loading indicator only when fetching from server
                // Use a temporary div to avoid interfering with textContent
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'htmx-loading';
                loadingDiv.textContent = 'Loading...';
                element.innerHTML = '';
                element.appendChild(loadingDiv);
                
                // Fetch template from server
                const response = await fetch(templatePath);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                templateContent = await response.text();
                
                // Cache the template (store original including head)
                this.cache.set(templatePath, templateContent);
            }
            
            // Extract and apply head from template, get body content to insert
            const contentToInsert = this.extractAndApplyHead(templateContent);
            
            // Replace the htmx element with the parsed fragment to preserve script nodes
            if (contentToInsert instanceof DocumentFragment) {
                element.replaceWith(contentToInsert);
            } else {
                element.outerHTML = contentToInsert;
            }

            // Programmatically insert template body scripts to avoid comment sanitization
            if (Array.isArray(this.pendingScripts) && this.pendingScripts.length) {
                this.pendingScripts.forEach(desc => {
                    try {
                        if (desc.type === 'external' && desc.src) {
                            // Avoid duplicates
                            let exists = null;
                            try {
                                exists = document.querySelector(`script[src="${CSS.escape(desc.src)}"]`);
                            } catch (_) {
                                exists = Array.from(document.querySelectorAll('script[src]')).find(el => (el.getAttribute('src') || '') === desc.src);
                            }
                            if (exists) return;
                            const s = document.createElement('script');
                            s.src = desc.src;
                            Object.entries(desc.attrs || {}).forEach(([name, value]) => {
                                if (name === 'async' || name === 'defer' || name === 'src') return;
                                s.setAttribute(name, value);
                            });
                            s.removeAttribute('async');
                            s.removeAttribute('defer');
                            s.setAttribute('data-htmx-template', 'true');
                            s.setAttribute('data-htmx-executed', 'true');
                            s.setAttribute('data-cfasync', 'false');
                            document.body.appendChild(s);
                        } else if (desc.type === 'inline') {
                            const s = document.createElement('script');
                            s.textContent = desc.content || '';
                            Object.entries(desc.attrs || {}).forEach(([name, value]) => {
                                if (name === 'async' || name === 'defer') return;
                                s.setAttribute(name, value);
                            });
                            s.removeAttribute('async');
                            s.removeAttribute('defer');
                            s.setAttribute('data-htmx-template', 'true');
                            s.setAttribute('data-htmx-executed', 'true');
                            s.setAttribute('data-cfasync', 'false');
                            document.body.appendChild(s);
                        }
                    } catch (e) {
                        console.warn('HTMX: Failed to insert template script:', e);
                    }
                });
                this.pendingScripts = [];
            }
            
            // Execute any scripts in the loaded content
            setTimeout(() => {
                this.executeScripts();
                this.processNestedHTMX();
            }, 0);
            
        } catch (error) {
            console.error(`Error loading template "${finalTemplateName}":`, error);
            
            // Enhanced error handling - try to load index.html as fallback
            if (finalTemplateName !== 'index') {
                console.log(`Attempting to load fallback template: index.html`);
                try {
                    const fallbackPath = `${templateFolder}/index.html`;
                    const fallbackResponse = await fetch(fallbackPath);
                    
                    if (fallbackResponse.ok) {
                        const fallbackContent = await fallbackResponse.text();
                        const fallbackBody = this.extractAndApplyHead(fallbackContent);
                        // Replace using fragment when available
                        if (fallbackBody instanceof DocumentFragment) {
                            element.replaceWith(fallbackBody);
                        } else {
                            element.outerHTML = fallbackBody;
                        }
                        setTimeout(() => {
                            this.executeScripts();
                            this.processNestedHTMX();
                        }, 0);
                        return;
                    }
                } catch (fallbackError) {
                    console.error('Fallback template also failed:', fallbackError);
                }
            }
            
            // If all else fails, show error message
            element.innerHTML = `<div class="htmx-error">Error loading template: ${finalTemplateName}</div>`;
        }
    }

    /**
     * Process nested HTMX elements that might have been loaded
     */
    async processNestedHTMX() {
        // Find only htmx elements that haven't been processed yet
        // Exclude elements that contain only loading indicators
        const nestedElements = document.querySelectorAll('htmx:not([data-htmx-processed])');
        
        for (const element of nestedElements) {
            const templateName = element.textContent.trim();
            // Skip elements that only contain loading text or are empty
            if (templateName && templateName !== 'Loading...' && !templateName.includes('Loading...')) {
                element.setAttribute('data-htmx-processed', 'true');
                element.setAttribute('data-original-template', templateName);
                await this.loadTemplate(element, templateName);
            }
        }
        
        // Execute scripts after processing nested elements
        this.executeScripts();
    }

    /**
     * Reload a specific template (useful for dynamic updates)
     * @param {string} templateName - Name of the template to reload
     */
    async reloadTemplate(templateName) {
        const templatePath = `${this.templateFolder}/${templateName}.html`;
        
        // Clear from cache
        this.cache.delete(templatePath);
        
        // Find and reload all instances of this template
        const elements = document.querySelectorAll(`htmx`);
        for (const element of elements) {
            if (element.textContent.trim() === templateName) {
                await this.loadTemplate(element, templateName);
            }
        }
    }

    /**
     * Clear template cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            templates: Array.from(this.cache.keys())
        };
    }
}

// Initialize the Custom HTMX system
if (typeof htmx === 'undefined') {
    const htmx = new CustomHTMX();

    // Expose useful methods globally
    window.htmx = {
        reload: (templateName) => htmx.reloadTemplate(templateName),
        clearCache: () => htmx.clearCache(),
        getCacheStats: () => htmx.getCacheStats(),
        processElements: () => htmx.processHTMXElements()
    };
}
}

// Add some basic CSS for loading and error states
if (!document.querySelector('style[data-htmx-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-htmx-styles', 'true');
    style.textContent = `
        .htmx-loading {
            padding: 10px;
            text-align: center;
            color: #666;
            font-style: italic;
        }
        
        .htmx-error {
            padding: 10px;
            background-color: #fee;
            border: 1px solid #fcc;
            border-radius: 4px;
            color: #c33;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}