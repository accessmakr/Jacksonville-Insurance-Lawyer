// ../js/registry.js
"use strict";

const SiteRegistry = {
    domain: "https://jacksonvilleinsurancelawyer.com",
    name: "Jacksonville Insurance Lawyer",
    
    // Core Silos mapped to the 150-page blueprint
    urls: [
        // CORE MONEY
        { url: "/", title: "Jacksonville Insurance Lawyer", cluster: "core", intent: "home" },
        { url: "/lawyer/car-insurance-lawyer/", title: "Car Insurance Lawyer", cluster: "core", intent: "lawyer" },
        { url: "/lawyer/bad-faith-insurance-lawyer/", title: "Bad Faith Insurance Lawyer", cluster: "core", intent: "lawyer" },
        { url: "/lawyer/truck-accident-lawyer/", title: "Truck Accident Lawyer", cluster: "core", intent: "lawyer" },
        // INSURANCE SUE CLUSTER
        { url: "/guide/how-to-sue-an-insurance-company/", title: "How to Sue an Insurance Company", cluster: "sue", intent: "guide" },
        { url: "/answer/can-you-sue-insurance-company/", title: "Can You Sue Insurance Company", cluster: "sue", intent: "answer" },
        { url: "/bad-faith/denied-claim-what-next/", title: "Denied Insurance Claim What Next", cluster: "sue", intent: "guide" },
        // DIY / SMALL CLAIMS / SETTLEMENT
        { url: "/guide/how-to-settle-a-car-accident-claim-without-a-lawyer/", title: "Settle Car Accident Claim Without Lawyer", cluster: "diy", intent: "guide" },
        { url: "/small-claims/florida-small-claims-guide/", title: "Florida Small Claims Guide", cluster: "small-claims", intent: "guide" },
        { url: "/settlement/settlement-check-timeline/", title: "Settlement Check Timeline", cluster: "settlement", intent: "guide" },
        // LOCATIONS
        { url: "/location/jacksonville/", title: "Jacksonville Insurance Lawyer", cluster: "location", intent: "location" },
        { url: "/location/duval-county/", title: "Duval County Insurance Lawyer", cluster: "location", intent: "location" }
    ],

    getSiloLinks: function(currentPath) {
        // Enforce anti-cannibalization silo rules: 1 lawyer, 1 answer, 1 guide, 1 location, 1 home
        const links = {
            home: this.urls.find(u => u.intent === 'home'),
            lawyer: this.urls.find(u => u.intent === 'lawyer' && u.url !== currentPath),
            answer: this.urls.find(u => u.intent === 'answer' && u.url !== currentPath),
            guide: this.urls.find(u => u.intent === 'guide' && u.url !== currentPath),
            location: this.urls.find(u => u.intent === 'location' && u.url !== currentPath)
        };
        return Object.values(links).filter(Boolean);
    }
};

window.SiteRegistry = SiteRegistry;
