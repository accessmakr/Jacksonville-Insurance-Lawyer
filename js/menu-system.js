/**
 * menu-system.js - Enterprise Version 4.0
 * Fixed for Homepage visibility and blueprint-accurate folder mapping.
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navDock = document.getElementById('master-nav-dock');
    if (!navDock) return;

    // 1. Blueprint Folder Mapping (Extracted from production-read_2.txt)
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
        'statute': 'Statutes',
        'compare': 'Comparisons',
        'claims': 'Claims'
    };

    // Strict Navigation Order based on topical authority clusters
    const NAV_ORDER = ['lawyer', 'guide', 'bad-faith', 'location', 'settlement', 'small-claims', 'calculator', 'resources'];

    // 2. Data Processing from Registry
    const registry = window.pageRegistry || [];
    
    const getCategorizedData = () => {
        const groups = {};
        registry.forEach(page => {
            // Determine folder: e.g., "guide/how-to-sue.html" -> "guide"
            const parts = page.path.split('/');
            const folder = parts.length > 1 ? parts[0] : 'root';
            
            if (!groups[folder]) groups[folder] = [];
            
            // Generate clean labels from filenames
            let label = page.path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            
            if (label.toLowerCase() !== 'index') {
                groups[folder].push({ url: page.url, label: label });
            }
        });
        return groups;
    };

    const groupedData = getCategorizedData();

    // 3. UI Rendering Engine
    const buildDesktop = () => {
        // Start strictly with Home
        let html = `<a href="/" class="text-sm font-bold text-gray-900 hover:text-emerald-700 transition px-2">Home</a>`;

        // Generate Dropdowns for folders
        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="relative group">
                    <button class="flex items-center text-sm font-bold text-gray-700 group-hover:text-emerald-700 transition py-4 px-2">
                        ${FOLDER_MAP[folder]}
                        <svg class="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <div class="absolute left-0 w-72 bg-white border border-gray-100 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-3 mt-[-5px]">
                        <div class="max-h-[65vh] overflow-y-auto px-2 custom-scrollbar">
                            ${pages.map(p => `
                                <a href="${p.url}" class="block px-4 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition">
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
        let html = `<a href="/" class="block py-4 text-lg font-black text-gray-900 border-b border-gray-100">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="border-b border-gray-100">
                    <button class="w-full flex justify-between items-center py-4 text-lg font-black text-gray-800 focus:outline-none" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        ${FOLDER_MAP[folder]}
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="3"></path></svg>
                    </button>
                    <div class="hidden bg-gray-50 rounded-xl mb-4 py-1 px-1">
                        ${pages.map(p => `
                            <a href="${p.url}" class="block px-4 py-3 text-base font-bold text-gray-600 active:text-emerald-700">
                                ${p.label}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        return html;
    };

    // 4. Final Injection into Master Nav Dock
    navDock.innerHTML = `
        <!-- Desktop Layout -->
        <nav class="hidden lg:flex items-center space-x-6" aria-label="Main Navigation">
            ${buildDesktop()}
            <a href="tel:+19045009653" class="ml-4 px-6 py-2.5 bg-emerald-700 text-white text-xs font-black rounded-full shadow-lg hover:bg-emerald-800 transition-all uppercase tracking-wider">
                Free Case Review
            </a>
        </nav>

        <!-- Mobile Layout Toggle -->
        <button id="mobile-toggle" class="lg:hidden p-2 text-gray-900 focus:outline-none" aria-label="Toggle Menu">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path id="nav-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>

        <!-- Mobile Drawer -->
        <div id="mobile-drawer" class="hidden fixed inset-0 top-[80px] w-full bg-white z-[999] p-6 overflow-y-auto">
            ${buildMobile()}
            <div class="mt-10">
                <a href="tel:+19045009653" class="flex items-center justify-center w-full py-5 bg-emerald-700 text-white font-black rounded-2xl shadow-xl">
                    CALL NOW: (904) 500-9653
                </a>
            </div>
        </div>
    `;

    // 5. Global Interaction Logic
    const toggle = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const icon = document.getElementById('nav-icon');

    toggle.addEventListener('click', () => {
        const isVisible = !drawer.classList.contains('hidden');
        if (isVisible) {
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
