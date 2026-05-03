// ../js/schema.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const getLastMonday = () => {
        const d = new Date();
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    const currentUrl = window.location.href;
    const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
    
    // Base Organization & WebSite Schema
    const baseSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://jacksonvilleinsurancelawyer.com/#website",
                "url": "https://jacksonvilleinsurancelawyer.com",
                "name": "Jacksonville Insurance Lawyer",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://jacksonvilleinsurancelawyer.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "LegalService",
                "@id": "https://jacksonvilleinsurancelawyer.com/#organization",
                "name": "Jacksonville Insurance Lawyer Directory",
                "url": "https://jacksonvilleinsurancelawyer.com",
                "areaServed": "Florida",
                "description": "Connecting policyholders with top-rated insurance litigation attorneys in Jacksonville."
            }
        ]
    };

    // Article/FAQ Schema applied conditionally if not home
    if (!isHome) {
        const title = document.title || document.querySelector('h1')?.innerText;
        baseSchema["@graph"].push({
            "@type": "Article",
            "@id": currentUrl + "#article",
            "isPartOf": { "@id": "https://jacksonvilleinsurancelawyer.com/#website" },
            "headline": title,
            "datePublished": "2024-01-15", 
            "dateModified": getLastMonday(),
            "author": {
                "@type": "Organization",
                "name": "Jacksonville Insurance Lawyer Editorial Team"
            }
        });

        // FAQ Extractor
        const faqs = document.querySelectorAll('.faq-item');
        if (faqs.length > 0) {
            const faqSchema = {
                "@type": "FAQPage",
                "mainEntity": Array.from(faqs).map(faq => ({
                    "@type": "Question",
                    "name": faq.querySelector('.faq-question')?.innerText.trim(),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.querySelector('.faq-answer')?.innerText.trim()
                    }
                }))
            };
            baseSchema["@graph"].push(faqSchema);
        }
    }

    // Inject JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(baseSchema);
    document.head.appendChild(script);

    // Update visible freshness badge if it exists
    const freshnessBadge = document.querySelector('.freshness-badge');
    if (freshnessBadge) {
        freshnessBadge.innerText = `Updated ${getLastMonday()} based on current data`;
    }
});
