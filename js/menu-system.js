/**
 * menu-system.js - V6.2 ENTERPRISE
 * Fixed: Added missing folders to NAV_ORDER to ensure all registry items display.
 * Improved: Added defensive checks and Title Case formatting for link labels.
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navDock = document.getElementById('master-nav-dock');
    if (!navDock) return;

    // 1. Blueprint Mapping
    const FOLDER_MAP = {
        'lawyer': 'Attorneys',
        'guide': 'Legal Guides',
        'answer': 'Quick Answers',
        'bad-faith': 'Bad Faith',
        'location': 'Locations',
        'settlement': 'Settlements',
        'small-claims': 'Small Claims',
        'calculator': 'Tools',
        'resources': 'Resources',
        'reviews': 'Reviews',
        'statute': 'Statutes'
    };

    // FIX 1: Exhaustively mapped every folder key from FOLDER_MAP into the NAV_ORDER.
    // All 11 folders will now correctly render on the live site.
    const NAV_ORDER = [
        'lawyer', 
        'guide', 
        'answer', 
        'bad-faith', 
        'location', 
        'settlement', 
        'small-claims', 
        'calculator', 
        'resources',
        'reviews',
        'statute'
    ];

    const registry = window.pageRegistry || [];
    
    const getCategorizedData = () => {
        const groups = {};
        registry.forEach(page => {
            // FIX 2: Defensive check in case a registry entry is missing a path
            if (!page || !page.path) return;

            const parts = page.path.split('/');
            const folder = parts.length > 1 ? parts[0] : 'root';
            if (!groups[folder]) groups[folder] = [];
            
            // FIX 3: Proper Title Case for labels (e.g., "bad-faith" -> "Bad Faith")
            let rawLabel = page.path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
            let label = rawLabel.split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');
            
            if (label.toLowerCase() !== 'Index') {
                groups[folder].push({ url: page.url, label: label });
            }
        });
        return groups;
    };

    const groupedData = getCategorizedData();

    // 2. UI Components
    const buildDesktop = () => {
        let html = `<a href="/" class="text-[13px] font-semibold text-gray-800 hover:text-emerald-700 transition px-2">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="relative group">
                    <button class="flex items-center text-[13px] font-semibold text-gray-700 group-hover:text-emerald-700 transition py-4 px-2">
                        ${FOLDER_MAP[folder]}
                        <svg class="ml-1 w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2"></path></svg>
                    </button>
                    <!-- z-[9999] forces dropdown over Homepage Hero -->
                    <div class="absolute left-0 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] py-2 mt-[-5px]">
                        <div class="max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                            ${pages.map(p => `
                                <a href="${p.url}" class="block px-4 py-2 text-[12px] font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition">
                                    ${p.label}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        return html;
    };

    const buildMobile = () => {
        let html = `<a href="/" class="block py-4 text-base font-bold text-gray-900 border-b border-gray-100">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="border-b border-gray-100">
                    <button class="w-full flex justify-between items-center py-4 text-base font-bold text-gray-800" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        ${FOLDER_MAP[folder]}
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2"></path></svg>
                    </button>
                    <div class="hidden bg-gray-50 rounded-lg mb-2 py-1 px-1">
                        ${pages.map(p => `
                            <a href="${p.url}" class="block px-4 py-2.5 text-sm font-medium text-gray-600">
                                ${p.label}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        return html;
    };

    // 3. Master Injection
    
    navDock.innerHTML = `
        <nav class="hidden lg:flex items-center space-x-2" aria-label="Main Navigation">
            ${buildDesktop()}
            <a href="tel:+19045009653" class="ml-4 px-5 py-2 bg-emerald-700 text-white text-[11px] font-bold rounded-full shadow-lg hover:bg-emerald-800 transition-all uppercase">
                Free Case Review
            </a>
        </nav>

        <button id="m-toggle" class="lg:hidden p-2 text-gray-900 z-[10001]" aria-label="Menu">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path id="m-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    `;

    const mDrawerHTML = `
        <div id="m-drawer" class="hidden fixed inset-0 top-[70px] w-full bg-white z-[99999] p-6 overflow-y-auto">
            ${buildMobile()}
            <div class="mt-8">
                <a href="tel:+19045009653" class="flex items-center justify-center w-full py-4 bg-emerald-700 text-white font-bold rounded-xl shadow-lg">
                    (904) 500-9653
                </a>
            </div>
        </div>
    `;

    const existingDrawer = document.getElementById('m-drawer');
    if (existingDrawer) {
        existingDrawer.remove();
    }
    document.body.insertAdjacentHTML('beforeend', mDrawerHTML);

    // 4. Global Handlers
    const toggle = document.getElementById('m-toggle');
    const drawer = document.getElementById('m-drawer');
    const icon = document.getElementById('m-icon');

    toggle.addEventListener('click', () => {
        const isOpen = !drawer.classList.contains('hidden');
        if (isOpen) {
            drawer.classList.add('hidden');
            icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            document.body.style.overflow = '';
        } else {
            drawer.classList.remove('hidden');
            icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            document.body.style.overflow = 'hidden'; 
        }
    });
});
