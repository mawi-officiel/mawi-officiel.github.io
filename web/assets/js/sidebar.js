/**
 * MAWI MAN Sidebar Component
 * @package MAWI MAN
 * @author Mawi Man
 * @license Proprietary - All rights reserved to Ayoub Alarjani
 */


/**
 * Generates the sidebar HTML structure
 * @returns {string} The complete sidebar HTML
 */
function generateSidebarHTML() {
    return `
        <aside class="mawi-sidebar mawi-fade-in" id="sidebar">
            <nav class="mawi-sidebar-nav">
                <!-- Search Section -->
                <div class="mawi-sidebar-search">
                    <input type="text" class="mawi-input mawi-input-search" id="mawi-sidebar-search" placeholder="Search..." data-translate-placeholder="البحث..." />
                    <div class="mawi-search-no-results mawi-slide-up" id="mawi-search-no-results" style="display: none;">
                        <span class="material-symbols-rounded">search_off</span>
                        <p data-translate="لا توجد نتائج">No results found</p>
                    </div>
                </div>
                
                <div class="mawi-sidebar-section">
                    <ul class="mawi-nav-list">
                        <li><a href="index.html" class="mawi-sidebar-item" data-translate="رئيسي" data-search-terms="main رئيسي">MAIN</a></li>
                    </ul>
                </div>
            </nav>
        </aside>
    `;
}

/**
 * Saves the sidebar sections state to localStorage
 * @param {string} sectionKey The section identifier
 * @param {boolean} isCollapsed Whether the section is collapsed
 */
function saveSidebarState(sectionKey, isCollapsed) {
    try {
        const sidebarState = JSON.parse(localStorage.getItem('mawi_sidebar_state') || '{}');
        sidebarState[sectionKey] = isCollapsed;
        localStorage.setItem('mawi_sidebar_state', JSON.stringify(sidebarState));
    } catch (e) {
        // Ignore localStorage errors
    }
}

/**
 * Gets the saved sidebar state from localStorage
 * @param {string} sectionKey The section identifier
 * @returns {boolean|null} The saved state or null if not found
 */
function getSidebarState(sectionKey) {
    try {
        const sidebarState = JSON.parse(localStorage.getItem('mawi_sidebar_state') || '{}');
        return sidebarState[sectionKey];
    } catch (e) {
        return null;
    }
}

/**
 * Toggles the visibility of sidebar sections
 * @param {HTMLElement} element The clicked section header
 */
function toggleSidebarSection(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.mawi-collapse-icon');
    const sectionKey = element.getAttribute('data-translate') || 'unknown';
    
    if (content && content.classList.contains('mawi-collapsible-content')) {
        content.classList.toggle('mawi-collapsed');
        
        if (icon) {
            icon.textContent = content.classList.contains('mawi-collapsed') ? '▶' : '▼';
        }
        
        // Save the state
        saveSidebarState(sectionKey, content.classList.contains('mawi-collapsed'));
    }
}

/**
 * Restores the saved sidebar sections state
 */
function restoreSidebarState() {
     const collapsibleSections = document.querySelectorAll('.mawi-collapsible');
     
     collapsibleSections.forEach(section => {
         const sectionKey = section.getAttribute('data-translate') || 'unknown';
         const savedState = getSidebarState(sectionKey);
         const content = section.nextElementSibling;
         const icon = section.querySelector('.mawi-collapse-icon');
         
         if (savedState !== null && content && content.classList.contains('mawi-collapsible-content')) {
             if (savedState) {
                 content.classList.add('mawi-collapsed');
                 if (icon) icon.textContent = '▶';
             } else {
                 content.classList.remove('mawi-collapsed');
                 if (icon) icon.textContent = '▼';
             }
         } else {
             // Default states for sections without saved state
             if (sectionKey === 'mawi') {
                 // mawi section: open by default
                 content.classList.remove('mawi-collapsed');
                 if (icon) icon.textContent = '▼';
             } else if (sectionKey === 'tools_mawi') {
                 // TOOLS mawi section: closed by default
                 content.classList.add('mawi-collapsed');
                 if (icon) icon.textContent = '▶';
             }
         }
     });
 }

/**
 * Initializes the sidebar component
 * @param {string} containerId The container element ID
 */
function initializeSidebar(containerId = "sidebar-container") {
    const container = document.getElementById(containerId);
    
    if (container) {
        container.innerHTML = generateSidebarHTML();
    } else {
        const sidebarHTML = generateSidebarHTML();
        document.body.insertAdjacentHTML("afterbegin", sidebarHTML);
    }
    

    
    // Restore saved state after a short delay to ensure DOM is ready
    setTimeout(restoreSidebarState, 100);
}

// Initialize sidebar when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    if (!document.getElementById("sidebar")) {
        initializeSidebar();
    }
    initializeSearch();
});

/**
 * Search and filter sidebar sections
 * @param {string} searchTerm - The search term to filter by
 */
function filterSidebar(searchTerm) {
    const sections = document.querySelectorAll('.mawi-sidebar-section[data-searchable]');
    const noResultsDiv = document.getElementById('mawi-search-no-results');
    let hasResults = false;
    
    searchTerm = searchTerm.toLowerCase().trim();
    
    sections.forEach(section => {
        const searchTerms = section.getAttribute('data-search-terms') || '';
        const sectionTitle = section.querySelector('.mawi-sidebar-title')?.textContent || '';
        const items = section.querySelectorAll('.mawi-sidebar-item');
        
        let sectionHasMatch = false;
        
        // Check section title and terms
        if (searchTerm === '' || 
            searchTerms.toLowerCase().includes(searchTerm) || 
            sectionTitle.toLowerCase().includes(searchTerm)) {
            sectionHasMatch = true;
        }
        
        // Check individual items
        items.forEach(item => {
            const itemTerms = item.getAttribute('data-search-terms') || '';
            const itemText = item.textContent || '';
            
            if (searchTerm === '' || 
                itemTerms.toLowerCase().includes(searchTerm) || 
                itemText.toLowerCase().includes(searchTerm)) {
                item.style.display = '';
                sectionHasMatch = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide section based on matches
        if (sectionHasMatch) {
            section.classList.remove('mawi-hidden');
            hasResults = true;
            
            // If searching, expand collapsed sections that have matches
            if (searchTerm !== '' && section.classList.contains('mawi-collapsible')) {
                const content = section.querySelector('.mawi-collapsible-content');
                if (content && content.classList.contains('mawi-collapsed')) {
                    content.classList.remove('mawi-collapsed');
                    const icon = section.querySelector('.mawi-collapse-icon');
                    if (icon) icon.textContent = '▼';
                }
            }
        } else {
            section.classList.add('mawi-hidden');
        }
    });
    
    // Show/hide no results message
    if (searchTerm !== '' && !hasResults) {
        noResultsDiv.style.display = 'block';
    } else {
        noResultsDiv.style.display = 'none';
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('mawi-sidebar-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterSidebar(e.target.value);
        });
        
        // Clear search on escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                e.target.value = '';
                filterSidebar('');
            }
        });
    }
}

// Export sidebar functionality
window.mawiSidebar = {
    generate: generateSidebarHTML,
    initialize: initializeSidebar,
    toggleSection: toggleSidebarSection,
    saveState: saveSidebarState,
    getState: getSidebarState,
    restoreState: restoreSidebarState,
    filterSidebar: filterSidebar
};