// ../js/internal-links.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('dynamic-internal-links');
    if (!container || !window.SiteRegistry) return;

    const currentPath = window.location.pathname;
    const siloLinks = window.SiteRegistry.getSiloLinks(currentPath);

    if (siloLinks.length === 0) return;

    let linksHTML = `
        <div class="bg-emerald-50 border-l-4 border-emerald-600 p-6 my-8 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Related Legal Resources</h3>
            <ul class="space-y-3">
    `;

    siloLinks.forEach(link => {
        linksHTML += `
            <li class="flex items-start">
                <svg class="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                <a href="${link.url}" class="text-emerald-800 hover:text-emerald-600 font-medium underline decoration-emerald-300 underline-offset-2 transition">${link.title}</a>
            </li>
        `;
    });

    linksHTML += `</ul></div>`;
    container.innerHTML = linksHTML;
});
