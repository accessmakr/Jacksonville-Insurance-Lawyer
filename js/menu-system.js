// ../js/menu-system.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navDock = document.getElementById('master-nav-dock');
    if (!navDock) return;

    // Desktop & Mobile Menu HTML Structure
    const menuHTML = `
        <nav class="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            <a href="/guide/" class="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">Guides</a>
            <a href="/lawyer/" class="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">Attorneys</a>
            <a href="/bad-faith/" class="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">Bad Faith</a>
            <a href="/location/" class="text-sm font-semibold text-gray-700 hover:text-emerald-700 transition">Locations</a>
            <a href="tel:+19045009653" class="px-5 py-2 bg-emerald-700 text-white text-sm font-bold rounded shadow hover:bg-emerald-800 transition">Free Case Review</a>
        </nav>
        
        <!-- Mobile Toggle Button -->
        <button id="mobile-menu-btn" class="md:hidden flex items-center p-2 text-gray-700 hover:text-emerald-700 focus:outline-none" aria-label="Toggle menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>

        <!-- Mobile Dropdown -->
        <div id="mobile-menu-dropdown" class="hidden absolute top-full left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100 flex flex-col p-4 space-y-4">
            <a href="/guide/" class="block text-base font-semibold text-gray-800 hover:text-emerald-700">Legal Guides</a>
            <a href="/lawyer/" class="block text-base font-semibold text-gray-800 hover:text-emerald-700">Find an Attorney</a>
            <a href="/bad-faith/" class="block text-base font-semibold text-gray-800 hover:text-emerald-700">Bad Faith Claims</a>
            <a href="/location/" class="block text-base font-semibold text-gray-800 hover:text-emerald-700">Locations</a>
            <div class="pt-4 border-t border-gray-100">
                <a href="tel:+19045009653" class="block text-center w-full px-5 py-3 bg-violet-700 text-white text-base font-bold rounded shadow">Call (904) 500-9653</a>
            </div>
        </div>
    `;

    // Inject into dock
    navDock.innerHTML = menuHTML;
    
    // Ensure parent header maintains flex layout
    const header = navDock.closest('header');
    if(header) {
        header.classList.add('relative', 'bg-white', 'border-b', 'border-gray-200');
    }

    // Mobile menu toggle logic
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const dropdown = document.getElementById('mobile-menu-dropdown');
    
    toggleBtn.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
    });
});
