// EMBEDDED DATA - All Content and Configuration
// ==================================================

const SITE_DATA = {
    // Site Configuration
    config: {
        siteName: "CIN Framework",
        nameversion: "Soon",
        version: "0.0.0",
        releaseDate: "2025-00-00",
        githubUrl: "https://github.com/mawi-officiel/cin-framework",
        description: "The first version of CIN will be released soon."
    },

    // Navigation Categories
    categories: [
        {
            id: "getting-started",
            title: "Getting Started",
            icon: "fas fa-rocket",
            items: [
                { id: "coming-soon", title: "coming soon", icon: "fas fa-timer" },
                //{ id: "introduction", title: "Introduction", icon: "fas fa-book-open" },
                //{ id: "installation", title: "Installation", icon: "fas fa-download" },
                //{ id: "quick-start", title: "Quick Start", icon: "fas fa-play" },
                //{ id: "configuration", title: "Configuration", icon: "fas fa-cog" }
            ]
        }
        //{
        //    id: "core-concepts",
        //    title: "Core Concepts",
        //    icon: "fas fa-brain",
        //    items: [
        //        //{ id: "architecture", title: "Architecture", icon: "fas fa-sitemap" },
        //        //{ id: "components", title: "Components", icon: "fas fa-puzzle-piece" },
        //        //{ id: "routing", title: "Routing", icon: "fas fa-route" },
        //        //{ id: "state-management", title: "State Management", icon: "fas fa-database" }
        //    ]
        //},
        //{
        //    id: "tutorials",
        //    title: "Tutorials",
        //    icon: "fas fa-graduation-cap",
        //    items: [
        //        //{ id: "first-app", title: "Building Your First App", icon: "fas fa-mobile-alt" },
        //        //{ id: "advanced-patterns", title: "Advanced Patterns", icon: "fas fa-chess" },
        //        //{ id: "performance", title: "Performance Optimization", icon: "fas fa-tachometer-alt" },
        //        //{ id: "testing", title: "Testing Guide", icon: "fas fa-vial" }
        //    ]
        //},
        //{
        //    id: "help",
        //    title: "Help & Support",
        //    icon: "fas fa-life-ring",
        //    items: [
        //        //{ id: "faq", title: "FAQ", icon: "fas fa-question-circle" },
        //        //{ id: "troubleshooting", title: "Troubleshooting", icon: "fas fa-wrench" },
        //        //{ id: "community", title: "Community", icon: "fas fa-users" },
        //        //{ id: "contributing", title: "Contributing", icon: "fas fa-hands-helping" }
        //    ]
        //}
    ],

    // Content Pages
    content: {
        home: {
            title: "CIN Framework",
            subtitle: "CIN is like creating a superhero with the click of a button.",
            features: [
                {
                    title: "Self-Bootstrapping CLI Engine",
                    description: "With a single command — `./cin framework:install` — CIN generates a fully structured, production-ready application architecture in seconds. No scaffolding. No guesswork. Just execution.",
                    icon: "fas fa-terminal"
                },
                {
                    title: "CIN Box: Aggressive Security Layering",
                    description: "CIN isolates all vulnerabilities in a virtualized internal layer known as the CIN Box. This rogue-mode containment ensures system integrity even in the presence of exploitable code in your app.",
                    icon: "fas fa-shield-alt"
                },
                {
                    title: "CIN Fast™ Runtime Engine",
                    description: "CIN reorders execution logic to ensure optimized rendering, minimal server load, ultra-fast response times, and even includes offline browsing support. Your site behaves like a native app — but better.",
                    icon: "fas fa-tachometer-alt"
                },
                {
                    title: "CIN LIB: Integrated Developer Arsenal",
                    description: "Access a powerful collection of CIN-native libraries: from AI model generators to real-time behavioral analyzers, everything is pre-integrated and ready for instant use.",
                    icon: "fas fa-brain"
                },
                {
                    title: "CIN Config: Full Structural Override",
                    description: "Reconfigure CIN’s internal behavior without ever touching the core. With CIN Config, you gain surgical control over every layer — from routing to logic injection.",
                    icon: "fas fa-sliders-h"
                },
                {
                    title: "CIN SEO Booster",
                    description: "CIN is engineered to dominate search engine rankings — even without content. Its semantic structure and routing logic are SEO-optimized by default for instant discoverability.",
                    icon: "fas fa-search"
                },
                {
                    title: "CIN UI: Dynamic Interface Injection",
                    description: "Easily embed prebuilt or custom UI components anywhere in your app with full support for scoped JS/CSS, template isolation, and DOM-safe runtime binding.",
                    icon: "fas fa-palette"
                },
                {
                    title: "CIN UX: Seamless Reactive Experience",
                    description: "CIN employs a custom async refresh engine that updates content in the background without reloading the page — providing a buttery-smooth user experience with no compromise on speed.",
                    icon: "fas fa-sync-alt"
                }
            ],

            changelog: [
                {
                    version: "0.0.0",
                    date: "2025-00-00",
                    changes: [
                        "The developer is still thinking about publishing"
                    ]
                }
            ]
        },

        "coming-soon": {
            title: "Coming soon CIN Framework",
            content: `
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting Started Soon</h2>
                            <p class="text-gray-700 leading-relaxed">
                                CIN is currently under active development.  
                                No documentation or guides are available until a stable production-ready release is confirmed.
                            </p>
                        </div>
                    `
        },

        introduction: {
            title: "Introduction to CIN Framework",
            content: `
                        <div class="space-y-6">
                            <p class="text-lg text-gray-700 leading-relaxed">
                                CIN Framework is a cutting-edge development framework designed to streamline the creation of modern, scalable applications. Built with performance and developer experience in mind, it provides a comprehensive toolkit for building everything from simple prototypes to complex enterprise applications.
                            </p>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Features</h2>
                            <ul class="space-y-3 text-gray-700">
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 ml-3 mt-1"></i>
                                    <span>Modular architecture for maximum flexibility</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 ml-3 mt-1"></i>
                                    <span>Built-in state management and routing</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 ml-3 mt-1"></i>
                                    <span>Comprehensive testing utilities</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mr-3 ml-3 mt-1"></i>
                                    <span>TypeScript support out of the box</span>
                                </li>
                            </ul>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting Started</h2>
                            <p class="text-gray-700 leading-relaxed">
                                The best way to get started with CIN Framework is to follow our installation guide and then work through the quick start tutorial. This will give you a solid foundation to build upon.
                            </p>
                        </div>
                    `
        },

        installation: {
            title: "Installation Guide",
            content: `
                        <div class="space-y-6">
                            <p class="text-lg text-gray-700 leading-relaxed">
                                Getting started with CIN Framework is simple. You can install it via npm, yarn, or download the standalone version. This guide will walk you through all installation methods and initial setup.
                            </p>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">NPM Installation</h2>
                            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                                npm install @cin/framework
                            </div>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Yarn Installation</h2>
                            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                                yarn add @cin/framework
                            </div>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">System Requirements</h2>
                            <ul class="space-y-2 text-gray-700">
                                <li><strong>Node.js:</strong> 16.0.0 or higher</li>
                                <li><strong>npm:</strong> 7.0.0 or higher</li>
                                <li><strong>Operating System:</strong> Windows 10+, macOS 10.15+, Linux (most distributions)</li>
                            </ul>
                        </div>
                    `
        },

        "quick-start": {
            title: "Quick Start Guide",
            content: `
                        <div class="space-y-6">
                            <p class="text-lg text-gray-700 leading-relaxed">
                                This quick start guide will have you up and running with CIN Framework in just a few minutes. We'll create a simple application to demonstrate the core concepts.
                            </p>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 1: Create a New Project</h2>
                            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                                npx @cin/create-app my-first-app<br>
                                cd my-first-app<br>
                                npm start
                            </div>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Step 2: Understanding the Structure</h2>
                            <p class="text-gray-700 leading-relaxed">
                                Your new CIN Framework application will have the following structure:
                            </p>
                            
                            <div class="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                                my-first-app/<br>
                                ├── src/<br>
                                │   ├── components/<br>
                                │   ├── pages/<br>
                                │   ├── utils/<br>
                                │   └── app.js<br>
                                ├── public/<br>
                                └── package.json
                            </div>
                        </div>
                    `
        },

        configuration: {
            title: "Configuration",
            content: `
                        <div class="space-y-6">
                            <p class="text-lg text-gray-700 leading-relaxed">
                                CIN Framework provides flexible configuration options to customize your application's behavior. This guide covers all available configuration options and best practices.
                            </p>
                            
                            <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Basic Configuration</h2>
                            <p class="text-gray-700 leading-relaxed">
                                The main configuration file is <code class="bg-gray-200 px-2 py-1 rounded">cin.config.js</code> in your project root:
                            </p>
                            
                            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                module.exports = {<br>
                                &nbsp;&nbsp;mode: 'development',<br>
                                &nbsp;&nbsp;entry: './src/app.js',<br>
                                &nbsp;&nbsp;output: {<br>
                                &nbsp;&nbsp;&nbsp;&nbsp;path: './dist',<br>
                                &nbsp;&nbsp;&nbsp;&nbsp;filename: 'bundle.js'<br>
                                &nbsp;&nbsp;},<br>
                                &nbsp;&nbsp;plugins: ['@cin/router', '@cin/state']<br>
                                };
                            </div>
                        </div>
                    `
        }
    }
};

// ==================================================
// ENHANCED NAVIGATION SYSTEM WITH URL HASH SUPPORT
// ==================================================

class CINDocsApp {
    constructor() {
        this.currentPage = 'home';
        this.sidebarExpanded = new Set();
        this.mobileMenuOpen = false;
        this.isInitialized = false;

        this.handleHashChange = this.handleHashChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);

        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            this.renderTopNav();
            this.renderSidebar();
            this.renderFooter();
            this.setupMobileMenu();

            this.handleHashChange();

            window.addEventListener('hashchange', this.handleHashChange);
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('keydown', this.handleKeydown);

            this.isInitialized = true;
            console.log('CIN Framework Documentation initialized successfully');
        } catch (error) {
            console.error('Error initializing CIN Framework Documentation:', error);
        }
    }

    handleHashChange() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentPage = hash;
        this.updateUI();
    }

    updateUI() {
        this.renderSidebar();
        this.renderMainContent();
        this.updateActiveStates();

        document.getElementById('mainContent').scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveStates() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.page === this.currentPage) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });

        const categoryToggles = document.querySelectorAll('.category-toggle');
        categoryToggles.forEach(toggle => {
            const categoryId = toggle.dataset.category;
            const chevron = toggle.querySelector('.chevron-icon');
            const isExpanded = this.sidebarExpanded.has(categoryId);

            if (isExpanded) {
                toggle.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
                if (chevron) chevron.classList.add('rotated');
            } else {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                if (chevron) chevron.classList.remove('rotated');
            }
        });
    }

    renderTopNav() {
        const nav = document.getElementById('topNav');
        nav.innerHTML = `
                    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between h-16">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 flex items-center">
                                    <a href="#home" class="flex items-center hover:opacity-80 transition-opacity">
                                        <i class="fas fa-code text-primary text-2xl mr-3 ml-3"></i>
                                        <h1 class="text-xl font-bold text-gray-900">${SITE_DATA.config.siteName} ${SITE_DATA.config.nameversion}</h1>
                                        <span class="ml-2 mr-2 px-2 py-1 text-xs bg-primary text-white rounded-full">${SITE_DATA.config.version}</span>
                                    </a>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <a href="${SITE_DATA.config.githubUrl}" target="_blank" rel="noopener noreferrer" 
                                   class="text-gray-600 hover:text-primary transition-colors focus-visible" 
                                   aria-label="View on GitHub">
                                    <i class="fab fa-github text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
    }

    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        let sidebarHTML = `
                    <div class="h-full overflow-y-auto">
                        <div class="p-4">
                            <div class="mb-6" >
                                <a href="#home" class="nav-item block p-3 text-gray-700 hover:text-primary rounded-lg transition-colors font-medium" style="margin-left: 50px;margin-right: 50px;">
                                    <i class="fas fa-home mr-3 ml-3"></i>
                                    Home
                                </a>
                            </div>
                `;

        SITE_DATA.categories.forEach(category => {
            const isExpanded = this.sidebarExpanded.has(category.id);
            const categoryId = `category-${category.id}`;
            const itemsId = `items-${category.id}`;

            sidebarHTML += `
                        <div class="mb-4">
                            <button class="category-toggle w-full flex items-center justify-between p-3 text-left hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-800 focus-visible" 
                                    data-category="${category.id}"
                                    aria-expanded="${isExpanded}"
                                    aria-controls="${itemsId}"
                                    id="${categoryId}">
                                <div class="flex items-center">
                                    <i class="${category.icon} text-primary mr-3 ml-3"></i>
                                    <span>${category.title}</span>
                                </div>
                                <i class="fas fa-chevron-down text-gray-400 chevron-icon ${isExpanded ? 'rotated' : ''}"></i>
                            </button>
                            <div class="category-items ml-6 mt-2 ${isExpanded ? 'expanded' : 'collapsed'}" 
                                 id="${itemsId}" 
                                 role="region" 
                                 aria-labelledby="${categoryId}">
                    `;

            category.items.forEach(item => {
                const isActive = this.currentPage === item.id;
                sidebarHTML += `
                            <a href="#${item.id}" class="nav-item block p-2 text-gray-600 hover:text-primary rounded transition-colors ${isActive ? 'active' : ''}" 
                               data-page="${item.id}"
                               ${isActive ? 'aria-current="page"' : ''}>
                                <i class="${item.icon} mr-2 ml-2"></i>
                                ${item.title}
                            </a>
                        `;
            });

            sidebarHTML += '</div></div>';
        });

        sidebarHTML += '</div></div>';
        sidebar.innerHTML = sidebarHTML;

        setTimeout(() => this.updateActiveStates(), 0);
    }

    renderMainContent() {
        const mainContent = document.getElementById('mainContent');

        if (this.currentPage === 'home') {
            this.renderHomePage(mainContent);
        } else {
            this.renderContentPage(mainContent);
        }
    }

    renderHomePage(container) {
        const homeData = SITE_DATA.content.home;
        container.innerHTML = `
                    <div class="content-fade">
                        <!-- Hero Section -->
                        <section class="moroccan-gradient text-white py-20">
                            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h1 class="text-4xl md:text-5xl font-bold mb-6">${homeData.title}</h1>
                                <p class="text-lg md:text-xl mb-8 max-w-3xl mx-auto">${homeData.subtitle}</p>
                                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a href="#quick-start" class="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus-visible" style="font-weight: 800;font-size: 30px;">
                                        CIN
                                    </a>
                                    <a href="#introduction" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors focus-visible" style="font-size: 30px;">
                                        FRAMEWORK
                                    </a>
                                </div>
                            </div>
                        </section>
                        
                        <!-- Features Section -->
                        <section class="py-16 md:py-20">
                            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 class="text-3xl font-bold text-center mb-12 md:mb-16 text-gray-900">Why Choose CIN Framework?</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                    ${homeData.features.map(feature => `
                                        <div class="moroccan-card p-6 md:p-8 rounded-xl feature-card flex flex-col items-center">
                                            <div class="text-primary text-3xl md:text-4xl mb-4">
                                                <i class="${feature.icon}"></i>
                                            </div>
                                            <img src="https://github.com/mawi-officiel/cin-framework/raw/main/cin.png" alt="CIN Logo" class="w-20 h-20 object-contain mb-2">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </section>

                        <!-- Version Info Section -->
                        <section class="bg-gray-100 py-12 md:py-16">
                            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                    <div>
                                        <h2 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900">Current Version</h2>
                                        <div class="moroccan-card p-6 md:p-8 rounded-xl">
                                            <div class="flex flex-col sm:flex-row sm:items-center mb-4">
                                                <span class="text-3xl md:text-4xl font-bold text-primary">${SITE_DATA.config.version}</span>
                                                <span class="mt-2 sm:mt-0 sm:ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm pulse-animation w-fit">Latest</span>
                                            </div>
                                            <p class="text-gray-600 mb-4 text-sm md:text-base">Released on ${SITE_DATA.config.releaseDate}</p>
                                            <p class="text-gray-700 text-sm md:text-base">${SITE_DATA.config.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900">Recent Changes</h2>
                                        <div class="space-y-4 md:space-y-6">
                                            ${homeData.changelog.slice(0, 2).map(release => `
                                                <div class="moroccan-card p-4 md:p-6 rounded-xl">
                                                    <div class="flex flex-col sm:flex-row sm:items-center mb-3">
                                                        <h3 class="text-lg font-semibold text-gray-900">v${release.version}</h3>
                                                        <span class="mt-1 sm:mt-0 sm:ml-3 text-sm text-gray-500">${release.date}</span>
                                                    </div>
                                                    <ul class="space-y-1">
                                                        ${release.changes.slice(0, 2).map(change => `
                                                            <li class="text-gray-600 text-sm flex items-start">
                                                                <i class="fas fa-check text-green-500 mr-2 mt-1 text-xs flex-shrink-0"></i>
                                                                <span>${change}</span>
                                                            </li>
                                                        `).join('')}
                                                    </ul>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                `;
    }

    renderContentPage(container) {
        const content = SITE_DATA.content[this.currentPage];
        if (!content) {
            container.innerHTML = `
                        <div class="content-fade p-4 md:p-8">
                            <div class="max-w-4xl mx-auto">
                                <div class="moroccan-card p-6 md:p-8 rounded-xl text-center">
                                    <i class="fas fa-construction text-4xl md:text-6xl text-primary mb-6"></i>
                                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Page Under Development</h1>
                                    <p class="text-gray-600 mb-6">This page is currently being developed. Please check back soon!</p>
                                    <a href="#home" class="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors focus-visible">
                                        <i class="fas fa-home mr-2"></i>
                                        Return Home
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
            return;
        }

        container.innerHTML = `
                    <div class="content-fade p-4 md:p-8">
                        <div class="max-w-4xl mx-auto">
                            <header class="mb-8">
                                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${content.title}</h1>
                                <div class="h-1 w-20 bg-primary rounded"></div>
                            </header>
                            <div class="moroccan-card p-6 md:p-8 rounded-xl">
                                <div class="prose max-w-none">
                                    ${content.content}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }

    renderFooter() {
        const footer = document.getElementById('footer');
        footer.innerHTML = `
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                            <div class="col-span-1 md:col-span-2">
                                <div class="flex items-center mb-4">
                                    <i class="fas fa-code text-primary text-xl md:text-2xl mr-3 ml-3"></i>
                                    <h3 class="text-lg md:text-xl font-bold">${SITE_DATA.config.siteName}</h3>
                                </div>
                                <div class="flex space-x-4">
                                    <a href="${SITE_DATA.config.githubUrl}" target="_blank" rel="noopener noreferrer" 
                                       class="text-gray-400 hover:text-white transition-colors focus-visible" 
                                       aria-label="GitHub">
                                        <i class="fab fa-github text-lg md:text-xl"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="text-lg font-semibold mb-4">Documentation</h4>
                                <ul class="space-y-2">
                                    <li><a href="#coming-soon" class="text-gray-400 hover:text-white transition-colors text-sm md:text-base focus-visible">Getting Started</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 class="text-lg font-semibold mb-4">Community</h4>
                                <ul class="space-y-2">
                                    <li><a href="${SITE_DATA.config.githubUrl}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors text-sm md:text-base focus-visible">GitHub</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
                            <p class="text-gray-400 text-sm md:text-base">© 2025 ${SITE_DATA.config.siteName}. All rights reserved.</p>
                        </div>
                    </div>
                `;
    }

    setupEventListeners() {
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleClick(e) {
        const categoryToggle = e.target.closest('.category-toggle');
        if (categoryToggle) {
            e.preventDefault();
            const categoryId = categoryToggle.dataset.category;
            this.toggleCategory(categoryId);
            return;
        }

        const navItem = e.target.closest('.nav-item, a[href^="#"]');
        if (navItem) {
            if (navItem.getAttribute('href')) {
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            } else {
                e.preventDefault();
                const categoryId = navItem.closest('.category-toggle')?.dataset.category;
                if (categoryId) {
                    this.toggleCategory(categoryId);
                }
            }
            return;
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.mobileMenuOpen) {
            this.closeMobileMenu();
            return;
        }

        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('category-toggle')) {
            e.preventDefault();
            const categoryId = e.target.dataset.category;
            this.toggleCategory(categoryId);
            return;
        }
    }

    handleResize() {
        if (window.innerWidth >= 1024 && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!mobileBtn || !sidebar || !overlay) return;

        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        overlay.addEventListener('click', () => {
            if (this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileBtn = document.getElementById('mobileMenuBtn');

        this.mobileMenuOpen = true;
        sidebar.classList.remove('closed');
        sidebar.classList.add('open');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileBtn.setAttribute('aria-label', 'Close navigation menu');

        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileBtn = document.getElementById('mobileMenuBtn');

        this.mobileMenuOpen = false;
        sidebar.classList.remove('open');
        sidebar.classList.add('closed');
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.setAttribute('aria-label', 'Open navigation menu');

        document.body.style.overflow = '';
    }

    toggleCategory(categoryId) {
        if (this.sidebarExpanded.has(categoryId)) {
            this.sidebarExpanded.delete(categoryId);
        } else {
            this.sidebarExpanded.add(categoryId);
        }
        this.updateCategoryUI(categoryId);
    }

    updateCategoryUI(categoryId) {
        const toggle = document.querySelector(`[data-category="${categoryId}"]`);
        const items = document.getElementById(`items-${categoryId}`);
        const chevron = toggle?.querySelector('.chevron-icon');
        if (!toggle || !items) return;
        const isExpanded = this.sidebarExpanded.has(categoryId);
        if (isExpanded) {
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            if (chevron) chevron.classList.add('rotated');
            items.classList.remove('collapsed');
            items.classList.add('expanded');
        } else {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            if (chevron) chevron.classList.remove('rotated');
            items.classList.remove('expanded');
            items.classList.add('collapsed');
        }
    }

    navigateTo(pageId) {
        window.location.hash = pageId;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.cinDocsApp = new CINDocsApp();
    } catch (error) {
        console.error('Failed to initialize CIN Framework Documentation:', error);
    }
});
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.cinDocsApp) {
        window.cinDocsApp.updateActiveStates();
    }
});
