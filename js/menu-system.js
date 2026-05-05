/**
 * menu-system.js - FULL UPGRADE
 * Dynamically builds a multi-level dropdown menu using site-wide registry data.
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navDock = document.getElementById('master-nav-dock');
    if (!navDock) return;

    // 1. Configuration & Human-Friendly Mapping
    const CATEGORY_LABELS = {
        'root': 'Home',
        'guide': 'Legal Guides',
        'lawyer': 'Attorneys',
        'location': 'Locations',
        'compare': 'Comparisons',
        'bad-faith': 'Bad Faith',
        'settlement': 'Settlements',
        'small-claims': 'Small Claims',
        'calculator': 'Calculators',
        'resources': 'Resources',
        'reviews': 'Reviews',
        'statute': 'Statutes'
    };

    // The order folders appear in the main navigation
    const NAV_ORDER = ['root', 'lawyer', 'guide', 'bad-faith', 'location', 'settlement', 'small-claims', 'calculator'];

    // 2. Data Processing
    // window.pageRegistry is populated by /js/registry.js
    const registry = window.pageRegistry || [];

    /**
     * Groups registry items by their folder category
     */
    const getGroupedPages = () => {
        const groups = {};
        registry.forEach(page => {
            // Determine folder: 'guide/page.html' -> 'guide'
            const folder = page.path.includes('/') ? page.path.split('/')[0] : 'root';
            if (!groups[folder]) groups[folder] = [];
            
            // Clean up the label: 'how-to-sue' -> 'How To Sue'
            const pageLabel = page.path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
            const capitalizedLabel = pageLabel.charAt(0).toUpperCase() + pageLabel.slice(1);
            
            groups[folder].push({
                url: page.url,
                label: capitalizedLabel === 'Index' ? CATEGORY_LABELS[folder] : capitalizedLabel
            });
        });
        return groups;
    };

    const groupedData = getGroupedPages();

    // 3. HTML Generators
    const generateDesktopMenu = () => {
        return NAV_ORDER.map(folder => {
            const pages = groupedData[folder] || [];
            if (folder === 'root') {
                return `<a href="/" class="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">Home</a>`;
            }

            // Create a dropdown if the folder has sub-pages
            return `
                <div class="relative group">
                    <button class="flex items-center text-sm font-semibold text-gray-700 group-hover:text-emerald-700 transition">
                        ${CATEGORY_LABELS[folder] || folder}
                        <svg class="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="absolute left-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                        ${pages.map(p => `<a href="${p.url}" class="block px-4 py-2 text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700">${p.label}</a>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    };

    const generateMobileMenu = () => {
        return NAV_ORDER.map(folder => {
            const pages = groupedData[folder] || [];
            if (folder === 'root') {
                return `<a href="/" class="block py-3 text-base font-bold text-gray-800 border-b border-gray-50">Home</a>`;
            }

            return `
                <div class="mobile-accordion border-b border-gray-50">
                    <button class="w-full flex justify-between items-center py-3 text-base font-bold text-gray-800 focus:outline-none" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        ${CATEGORY_LABELS[folder] || folder}
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div class="hidden bg-gray-50 rounded-lg mb-2 py-1">
                        ${pages.map(p => `<a href="${p.url}" class="block px-4 py-2 text-sm text-gray-600 hover:text-emerald-700">${p.label}</a>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    };

    // 4. Final Injection
    navDock.innerHTML = `
        <nav class="hidden xl:flex items-center space-x-6" aria-label="Main Navigation">
            ${generateDesktopMenu()}
            <a href="tel:+19045009653" class="px-5 py-2 bg-emerald-700 text-white text-sm font-bold rounded shadow hover:bg-emerald-800 transition">Free Case Review</a>
        </nav>

        <button id="mobile-menu-btn" class="xl:hidden p-2 text-gray-700 hover:text-emerald-700">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <div id="mobile-menu-dropdown" class="hidden absolute top-full left-0 w-full bg-white shadow-2xl z-50 border-t border-gray-100 p-6 flex flex-col max-h-[80vh] overflow-y-auto">
            ${generateMobileMenu()}
            <div class="mt-6 pt-6 border-t">
                <a href="tel:+19045009653" class="block text-center w-full py-4 bg-violet-700 text-white font-bold rounded-lg shadow-lg">Call (904) 500-9653</a>
            </div>
        </div>
    `;

    // Mobile Toggle Logic
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const dropdown = document.getElementById('mobile-menu-dropdown');
    toggleBtn.addEventListener('click', () => dropdown.classList.toggle('hidden'));
});
