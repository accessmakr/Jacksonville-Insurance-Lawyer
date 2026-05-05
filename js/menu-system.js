/**
 * menu-system.js - Enterprise Upgrade v3.0
 * Strictly mapped to jacksonvilleinsurancelawyer.com blueprint
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navDock = document.getElementById('master-nav-dock');
    if (!navDock) return;

    // 1. Blueprint Folder Mapping (Strictly as per source structure)
    const FOLDER_MAP = {
        'lawyer': 'Attorneys',
        'guide': 'Legal Guides',
        'answer': 'Quick Answers',
        'bad-faith': 'Bad Faith',
        'location': 'Locations',
        'settlement': 'Settlements',
        'small-claims': 'Small Claims',
        'calculator': 'Tools',
        'compare': 'Comparisons',
        'claims': 'Claims Process',
        'resources': 'Resources',
        'reviews': 'Reviews',
        'statute': 'Florida Statutes'
    };

    // Strict Navigation Order
    const NAV_ORDER = ['lawyer', 'guide', 'bad-faith', 'location', 'settlement', 'small-claims', 'calculator', 'resources'];

    // 2. Extract and Categorize from Registry
    const registry = window.pageRegistry || [];
    
    const categorizePages = () => {
        const groups = {};
        registry.forEach(page => {
            // Logic: Identify folder from path (e.g., "guide/how-to-sue.html" -> "guide")
            const parts = page.path.split('/');
            const folder = parts.length > 1 ? parts[0] : 'root';
            
            if (!groups[folder]) groups[folder] = [];
            
            // Clean naming: "how-to-sue-an-insurance-company" -> "How To Sue An Insurance Company"
            let label = page.path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            
            // Avoid adding index files to the list twice if they serve as category headers
            if (label.toLowerCase() !== 'index') {
                groups[folder].push({ url: page.url, label: label });
            }
        });
        return groups;
    };

    const groupedData = categorizePages();

    // 3. UI Component Generators
    const createDesktopDropdowns = () => {
        let html = `<a href="/" class="text-sm font-bold text-gray-900 hover:text-emerald-700 transition">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="relative group">
                    <button class="flex items-center text-sm font-bold text-gray-700 group-hover:text-emerald-700 transition py-4">
                        ${FOLDER_MAP[folder]}
                        <svg class="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <div class="absolute left-0 w-72 bg-white border border-gray-100 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-3 mt-[-5px]">
                        <div class="max-h-[70vh] overflow-y-auto custom-scrollbar px-2">
                            ${pages.map(p => `
                                <a href="${p.url}" class="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition">
                                    ${p.label}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `<a href="/sitemap.xml" class="text-sm font-bold text-gray-500 hover:text-violet-700 transition">Sitemap</a>`;
        return html;
    };

    const createMobileAccordion = () => {
        let html = `<a href="/" class="block py-4 text-lg font-extrabold text-gray-900 border-b border-gray-100">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="border-b border-gray-100">
                    <button class="w-full flex justify-between items-center py-4 text-lg font-extrabold text-gray-800" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        ${FOLDER_MAP[folder]}
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2"></path></svg>
                    </button>
                    <div class="hidden bg-gray-50 rounded-xl mb-4 py-2 px-2">
                        ${pages.map(p => `
                            <a href="${p.url}" class="block px-4 py-3 text-base font-semibold text-gray-600 active:text-emerald-700">
                                ${p.label}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += `<a href="/sitemap.xml" class="block py-4 text-base font-bold text-gray-400">Sitemap</a>`;
        return html;
    };

    // 4. Master Injection
    navDock.innerHTML = `
        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            ${createDesktopDropdowns()}
            <a href="tel:+19045009653" class="ml-4 px-6 py-2.5 bg-emerald-700 text-white text-sm font-black rounded-full shadow-lg hover:bg-emerald-800 hover:scale-105 transition-all">
                FREE CASE REVIEW
            </a>
        </nav>

        <!-- Mobile Toggle -->
        <button id="mobile-menu-btn" class="lg:hidden p-2 text-gray-900" aria-label="Open Menu">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>

        <!-- Mobile Drawer -->
        <div id="mobile-menu-drawer" class="hidden fixed inset-0 top-[72px] w-full bg-white z-[100] p-6 overflow-y-auto flex flex-col">
            ${createMobileAccordion()}
            <div class="mt-8 space-y-4">
                <a href="tel:+19045009653" class="block text-center w-full py-4 bg-emerald-700 text-white font-black rounded-xl shadow-xl">
                    Call David Alan Wolf: (904) 500-9653
                </a>
                <p class="text-center text-xs text-gray-400 font-medium">Expert Insurance Litigation • Jacksonville, FL</p>
            </div>
        </div>
    `;

    // 5. Interaction Logic
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-menu-drawer');
    const icon = document.getElementById('hamburger-icon');

    toggleBtn.addEventListener('click', () => {
        const isOpen = !drawer.classList.contains('hidden');
        if (isOpen) {
            drawer.classList.add('hidden');
            icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            document.body.style.overflow = '';
        } else {
            drawer.classList.remove('hidden');
            icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            document.body.style.overflow = 'hidden'; // Prevent scroll when menu open
        }
    });
});
