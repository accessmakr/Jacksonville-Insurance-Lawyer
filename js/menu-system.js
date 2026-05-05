/**
 * menu-system.js - V5.0 FINAL
 * Fixed for Homepage visibility + Blueprint Folder Mapping
 */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navDock = document.getElementById('master-nav-dock');
    if (!navDock) return;

    // 1. Blueprint Folder Mapping (Verbatim from production-read_2.txt)
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
        'claims': 'Claims Process'
    };

    // Strict Navigation Order based on blueprint clusters
    const NAV_ORDER = ['lawyer', 'guide', 'bad-faith', 'location', 'settlement', 'small-claims', 'calculator', 'resources'];

    // 2. Data Processing Logic
    const registry = window.pageRegistry || [];
    
    const getCategorizedData = () => {
        const groups = {};
        registry.forEach(page => {
            // Logic: Identify folder from path (e.g., "guide/how-to-sue.html" -> "guide")
            const parts = page.path.split('/');
            const folder = parts.length > 1 ? parts[0] : 'root';
            
            if (!groups[folder]) groups[folder] = [];
            
            // Generate clean labels: "how-to-sue" -> "How To Sue"
            let label = page.path.split('/').pop().replace('.html', '').replace(/-/g, ' ');
            label = label.charAt(0).toUpperCase() + label.slice(1);
            
            // Skip index files within dropdowns to avoid redundancy
            if (label.toLowerCase() !== 'index') {
                groups[folder].push({ url: page.url, label: label });
            }
        });
        return groups;
    };

    const groupedData = getCategorizedData();

    // 3. McKinsey UI Components
    const buildDesktop = () => {
        // Always Start with Home
        let html = `<a href="/" class="text-sm font-bold text-gray-900 hover:text-emerald-700 transition px-3">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="relative group">
                    <button class="flex items-center text-sm font-bold text-gray-700 group-hover:text-emerald-700 transition py-4 px-3">
                        ${FOLDER_MAP[folder]}
                        <svg class="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <!-- Dropdown Panel -->
                    <div class="absolute left-0 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[999] py-4 mt-[-5px]">
                        <div class="max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
                            ${pages.map(p => `
                                <a href="${p.url}" class="block px-4 py-3 text-[13px] font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition">
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
        let html = `<a href="/" class="block py-4 text-xl font-black text-gray-900 border-b border-gray-100">Home</a>`;

        NAV_ORDER.forEach(folder => {
            const pages = groupedData[folder] || [];
            if (pages.length === 0) return;

            html += `
                <div class="border-b border-gray-100">
                    <button class="w-full flex justify-between items-center py-5 text-xl font-black text-gray-800" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        ${FOLDER_MAP[folder]}
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="3"></path></svg>
                    </button>
                    <div class="hidden bg-gray-50 rounded-2xl mb-4 py-2 px-2">
                        ${pages.map(p => `
                            <a href="${p.url}" class="block px-4 py-3.5 text-base font-bold text-gray-600 active:text-emerald-700">
                                ${p.label}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        return html;
    };

    // 4. Injection Logic
    navDock.innerHTML = `
        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center" aria-label="Main Navigation">
            ${buildDesktop()}
            <a href="tel:+19045009653" class="ml-6 px-7 py-3 bg-emerald-700 text-white text-[11px] font-black rounded-full shadow-xl hover:bg-emerald-800 hover:scale-105 transition-all uppercase tracking-widest">
                Free Case Review
            </a>
        </nav>

        <!-- Mobile Nav Toggle -->
        <button id="mobile-toggle-btn" class="lg:hidden p-2 text-gray-900 focus:outline-none" aria-label="Menu">
            <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path id="toggle-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>

        <!-- Mobile Drawer -->
        <div id="mobile-nav-drawer" class="hidden fixed inset-0 top-[80px] w-full bg-white z-[999] p-8 overflow-y-auto">
            ${buildMobile()}
            <div class="mt-12">
                <a href="tel:+19045009653" class="flex flex-col items-center justify-center w-full py-6 bg-emerald-700 text-white rounded-3xl shadow-2xl">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Call Lawyer Now</span>
                    <span class="text-xl font-black">(904) 500-9653</span>
                </a>
            </div>
        </div>
    `;

    // 5. Interaction Handler
    const btn = document.getElementById('mobile-toggle-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const path = document.getElementById('toggle-path');

    btn.addEventListener('click', () => {
        const isVisible = !drawer.classList.contains('hidden');
        if (isVisible) {
            drawer.classList.add('hidden');
            path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            document.body.style.overflow = '';
        } else {
            drawer.classList.remove('hidden');
            path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            document.body.style.overflow = 'hidden';
        }
    });
});
