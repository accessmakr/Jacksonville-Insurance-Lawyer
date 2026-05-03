// ../js/search-system.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Inject Search UI (Hidden by default)
    const searchModalHTML = `
        <div id="search-modal" class="hidden fixed inset-0 z-[100] bg-gray-900 bg-opacity-90 backdrop-blur-sm flex justify-center items-start pt-20">
            <div class="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 relative flex flex-col max-h-[80vh]">
                <button id="close-search" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <input type="text" id="search-input" placeholder="Search guides, claim types, or locations..." class="w-full text-xl p-4 border-b-2 border-emerald-500 focus:outline-none mb-4" autocomplete="off" />
                <div id="search-results" class="flex-1 overflow-y-auto space-y-2 pr-2"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', searchModalHTML);

    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeBtn = document.getElementById('close-search');

    // Make global trigger available (bind to any button with class .trigger-search)
    document.querySelectorAll('.trigger-search').forEach(btn => {
        btn.addEventListener('click', () => {
            searchModal.classList.remove('hidden');
            setTimeout(() => searchInput.focus(), 100);
        });
    });

    closeBtn.addEventListener('click', () => searchModal.classList.add('hidden'));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        
        if (query.length < 2) return;

        if (window.SiteRegistry && window.SiteRegistry.urls) {
            const matches = window.SiteRegistry.urls.filter(item => 
                item.title.toLowerCase().includes(query) || item.url.includes(query)
            ).slice(0, 8); // Limit to top 8 for UI cleanliness

            if (matches.length === 0) {
                searchResults.innerHTML = '<p class="text-gray-500 italic p-4">No results found. Try broader terms like "bad faith" or "car accident".</p>';
                return;
            }

            matches.forEach(match => {
                const el = document.createElement('a');
                el.href = match.url;
                el.className = 'block p-4 border rounded hover:bg-emerald-50 transition border-gray-100 group';
                el.innerHTML = `
                    <div class="font-bold text-gray-800 group-hover:text-emerald-800">${match.title}</div>
                    <div class="text-xs text-gray-400 uppercase tracking-wide mt-1">${match.cluster}</div>
                `;
                searchResults.appendChild(el);
            });
        }
    });
});
