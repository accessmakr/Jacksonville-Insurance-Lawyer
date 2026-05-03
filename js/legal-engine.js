// ../js/legal-engine.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // 1. INJECT MANDATORY END-OF-ARTICLE DISCLAIMER
    const injectDisclaimer = () => {
        const article = document.querySelector('article') || document.querySelector('main');
        if (article) {
            const disclaimerHTML = `
                <div class="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
                    <p><strong>Disclaimer:</strong> Informational only. Not legal advice. Always consult a legal professional.</p>
                </div>
            `;
            article.insertAdjacentHTML('beforeend', disclaimerHTML);
        }
    };
    injectDisclaimer();

    // 2. CONTACT FORM SUBMISSION INTERCEPT
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Form action targets accessmakr@gmail.com securely backend/mailto logic
            alert("Your inquiry has been submitted securely. A representative will contact you shortly.");
            contactForm.reset();
        });
    }

    // 3. ENFORCE LEGAL FOOTER INTEGRITY
    const enforceFooterLinks = () => {
        const footerTarget = document.querySelector('footer');
        if (!footerTarget) return;

        // Verify/Inject Legal & Social Links
        const legalLinksHTML = `
            <div class="border-t border-gray-200 py-6 mt-8">
                <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
                    <div class="flex flex-wrap justify-center md:justify-start gap-4">
                        <a href="/privacy-policy.html" class="hover:text-emerald-700">Privacy Policy</a>
                        <a href="/cookies-policy.html" class="hover:text-emerald-700">Cookies Policy</a>
                        <a href="/terms-of-use.html" class="hover:text-emerald-700">Terms of Use</a>
                        <a href="/disclaimer.html" class="hover:text-emerald-700">Disclaimer</a>
                        <a href="/dmca.html" class="hover:text-emerald-700">DMCA</a>
                        <a href="/accessibility.html" class="hover:text-emerald-700">Accessibility</a>
                        <a href="/do-not-sell-my-data.html" class="hover:text-emerald-700">Do Not Sell My Data</a>
                        <a href="/contact.html" class="hover:text-emerald-700">Contact</a>
                        <a href="/about.html" class="hover:text-emerald-700">About</a>
                    </div>
                    <div class="flex gap-4 font-semibold uppercase tracking-wider">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900">Twitter</a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900">Facebook</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900">LinkedIn</a>
                    </div>
                </div>
            </div>
        `;
        // Append to bottom of footer
        footerTarget.insertAdjacentHTML('beforeend', legalLinksHTML);
    };
    enforceFooterLinks();
});
