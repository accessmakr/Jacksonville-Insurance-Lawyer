// ../js/root-config.js
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // 1. DYNAMIC YEAR IN FOOTER & META
    const updateYear = () => {
        const currentYear = new Date().getFullYear();
        document.querySelectorAll('.dynamic-year').forEach(el => el.textContent = currentYear);
        // Replace '2026' in text content site-wide for freshness
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes('2026')) {
                node.nodeValue = node.nodeValue.replace(/2026/g, currentYear);
            }
        }
    };
    updateYear();

    // 2. SCROLL PROGRESS BAR (Emerald -> Violet)
    const initProgressBar = () => {
        const bar = document.createElement('div');
        bar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-violet-600 z-50 transition-all duration-150 ease-out';
        bar.style.width = '0%';
        document.body.prepend(bar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            bar.style.width = (winScroll / height) * 100 + '%';
        }, { passive: true });
    };
    initProgressBar();

    // 3. READING TIME CALCULATOR
    const calculateReadingTime = () => {
        const text = document.body.innerText;
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        document.querySelectorAll('.reading-time').forEach(el => el.textContent = `${time} min read`);
    };
    calculateReadingTime();

    // 4. ACTIVE TOC HIGHLIGHT
    const initTOC = () => {
        const headings = document.querySelectorAll('h2[id]');
        const tocLinks = document.querySelectorAll('a[href^="#"]');
        if (!headings.length || !tocLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => {
                        link.classList.remove('border-l-2', 'border-emerald-500', 'text-emerald-600');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('border-l-2', 'border-emerald-500', 'text-emerald-600');
                        }
                    });
                }
            });
        }, { rootMargin: '0px 0px -80% 0px' });

        headings.forEach(h => observer.observe(h));
    };
    initTOC();

    // 5. ROTATING TESTIMONIALS
    const rotateTestimonials = () => {
        const quotes = [
            { text: "They fought the insurance company and got my claim paid fast.", author: "Michael T., Jacksonville", issue: "Denied Home Claim" },
            { text: "I didn't think I needed a lawyer until the adjuster stopped calling.", author: "Sarah B., Duval County", issue: "Auto Injury Delay" },
            { text: "Professional, aggressive, and highly effective.", author: "David R., Orange Park", issue: "Bad Faith Lawsuit" }
        ];
        const container = document.getElementById('testimonial-rotator');
        if (!container) return;
        
        let index = 0;
        setInterval(() => {
            container.style.opacity = 0;
            setTimeout(() => {
                index = (index + 1) % quotes.length;
                container.innerHTML = `
                    <p class="italic text-gray-700">"${quotes[index].text}"</p>
                    <p class="font-bold text-emerald-800 mt-2">- ${quotes[index].author}</p>
                    <p class="text-sm text-gray-500">${quotes[index].issue}</p>`;
                container.style.opacity = 1;
            }, 300);
        }, 6000);
    };
    rotateTestimonials();

    // 6. FAQ ACCORDION LOGIC
    const initFAQs = () => {
        const faqs = document.querySelectorAll('.faq-item');
        faqs.forEach(faq => {
            const question = faq.querySelector('.faq-question');
            const answer = faq.querySelector('.faq-answer');
            const icon = faq.querySelector('.faq-icon');
            if(question && answer) {
                question.addEventListener('click', () => {
                    const isOpen = !answer.classList.contains('hidden');
                    // Close all
                    document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
                    document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');
                    // Open targeted
                    if (!isOpen) {
                        answer.classList.remove('hidden');
                        if(icon) icon.style.transform = 'rotate(180deg)';
                    }
                });
            }
        });
    };
    initFAQs();

    // 7. HELPFUL WIDGET & SHARE SYSTEM
    const initEngagement = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        // Share Links Generator
        const generateShareLinks = () => `
            <div class="flex gap-2 flex-wrap items-center mt-4">
                <span class="text-sm font-semibold text-gray-600">Share this guide:</span>
                <a href="https://wa.me/?text=${title}%20${url}" target="_blank" class="px-3 py-1 rounded-full border border-gray-300 hover:border-emerald-500 text-sm">WhatsApp</a>
                <a href="https://twitter.com/intent/tweet?text=${title}&url=${url}" target="_blank" class="px-3 py-1 rounded-full border border-gray-300 hover:border-emerald-500 text-sm">X (Twitter)</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="px-3 py-1 rounded-full border border-gray-300 hover:border-emerald-500 text-sm">Facebook</a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}" target="_blank" class="px-3 py-1 rounded-full border border-gray-300 hover:border-emerald-500 text-sm">LinkedIn</a>
                <button onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied!');" class="px-3 py-1 rounded-full border border-gray-300 hover:border-emerald-500 text-sm">Copy Link</button>
            </div>
        `;

        // Inject Hero Share (After Quick Answer)
        const quickAnswer = document.querySelector('#quick-answer, .quick-answer-block');
        if (quickAnswer) {
            quickAnswer.insertAdjacentHTML('afterend', generateShareLinks());
        }

        // Helpful Feedback Widget
        const articleEnd = document.querySelector('article') || document.querySelector('.main-content');
        if (articleEnd && !localStorage.getItem('feedbackSubmitted_' + window.location.pathname)) {
            const feedbackHtml = `
                <div id="feedback-widget" class="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <h3 class="text-lg font-bold mb-4">Was this article helpful?</h3>
                    <div class="flex justify-center gap-4">
                        <button id="btn-helpful-yes" class="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-emerald-50">👍 Yes</button>
                        <button id="btn-helpful-no" class="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-red-50">👎 No</button>
                    </div>
                    <div id="feedback-response" class="hidden mt-4"></div>
                </div>
            `;
            articleEnd.insertAdjacentHTML('beforeend', feedbackHtml);

            document.getElementById('btn-helpful-yes')?.addEventListener('click', (e) => {
                const res = document.getElementById('feedback-response');
                res.innerHTML = `<p class="text-emerald-700 font-semibold">Thank you for your feedback!</p>${generateShareLinks()}`;
                res.classList.remove('hidden');
                e.target.parentElement.classList.add('hidden');
                localStorage.setItem('feedbackSubmitted_' + window.location.pathname, 'true');
            });

            document.getElementById('btn-helpful-no')?.addEventListener('click', (e) => {
                const res = document.getElementById('feedback-response');
                res.innerHTML = `
                    <p class="text-gray-700 mb-2">We're sorry this didn't answer your question.</p>
                    <a href="tel:+19045009653" class="inline-block bg-violet-700 text-white px-6 py-2 rounded font-bold hover:bg-violet-800 transition">Contact a Lawyer Now: (904) 500-9653</a>`;
                res.classList.remove('hidden');
                e.target.parentElement.classList.add('hidden');
                localStorage.setItem('feedbackSubmitted_' + window.location.pathname, 'true');
            });
        }
    };
    initEngagement();
});
