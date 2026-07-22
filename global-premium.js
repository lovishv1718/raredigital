/**
 * Rare Digital - Global Premium UI Interactions
 * Unifies GSAP ScrollTriggers, Parallax, Interactive Dashboards, FAQ Accordions,
 * 3D Carousels, Exit Intent Popups, and FormSubmit Handlers.
 */

// Global Mobile Menu Toggle
function toggleMenu() {
    document.querySelector('.hamburger').classList.toggle('open');
    document.getElementById('mobileMenu').classList.toggle('open');
}

// Results Dashboard Tab Switcher
function switchDashboardTab(tab, metricsConfig) {
    const buttons = document.querySelectorAll('.dashboard-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Find active button
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tab));
    if (activeBtn) activeBtn.classList.add('active');
    
    const path = document.getElementById('chartPath');
    const metricsContainer = document.getElementById('dashboardMetrics');
    
    if (!path || !metricsContainer || !metricsConfig || !metricsConfig[tab]) return;
    
    const config = metricsConfig[tab];
    path.setAttribute('d', config.path);
    
    // Generate Cards
    let cardsHtml = '';
    config.cards.forEach(card => {
        cardsHtml += `
            <div class="dashboard-metric-card">
                <div class="label">${card.label}</div>
                <div class="val">${card.val}</div>
                <div class="change">⚡ ${card.change}</div>
            </div>
        `;
    });
    metricsContainer.innerHTML = cardsHtml;
    
    // Trigger GSAP draw animation
    if (window.gsap) {
        const pathLength = path.getTotalLength();
        gsap.fromTo(path, 
            { strokeDasharray: pathLength, strokeDashoffset: pathLength },
            { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }
        );
    }
}

// Exit Intent Popup Control
function showPopup() {
    const exitPopup = document.getElementById('exitPopup');
    if (sessionStorage.getItem('exitPopupShown') === 'true') return;
    if (exitPopup) {
        exitPopup.classList.add('show');
        sessionStorage.setItem('exitPopupShown', 'true');
    }
}

function closePopup() {
    const exitPopup = document.getElementById('exitPopup');
    if (exitPopup) exitPopup.classList.remove('show');
}

function handlePopupSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('popupEmail');
    const msg = document.getElementById('popupMessage');
    if (!emailInput || !msg) return;
    
    msg.style.display = 'block';
    msg.className = 'popup-message success';
    msg.textContent = '✨ Saved! We will email your free audit soon.';
    emailInput.value = '';
    
    setTimeout(() => {
        closePopup();
        msg.style.display = 'none';
    }, 3000);
}

// AJAX Contact Form Submissions
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Clean previous errors
    form.querySelectorAll('.invalid').forEach(f => f.classList.remove('invalid'));
    form.querySelectorAll('.error-message').forEach(m => m.remove());
    
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
    
    let isValid = true;
    function markInvalid(field) {
        field.classList.add('invalid');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = 'This field is required';
        field.parentNode.appendChild(errorSpan);
        isValid = false;
    }
    
    if (fullName && !fullName.value.trim()) markInvalid(fullName);
    if (phoneNumber && !phoneNumber.value.trim()) markInvalid(phoneNumber);
    if (service && (!service.value || service.value === "")) markInvalid(service);
    if (message && !message.value.trim()) markInvalid(message);
    
    if (!isValid) return;
    
    const businessName = document.getElementById('businessName') ? document.getElementById('businessName').value : '';
    const websiteUrl = document.getElementById('websiteUrl') ? document.getElementById('websiteUrl').value : '';
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
    }
    
    fetch('https://formsubmit.co/ajax/agency@raredigital.in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: fullName.value,
            phone: phoneNumber.value,
            service: service.value,
            message: message.value,
            business: businessName,
            website: websiteUrl
        })
    })
    .then(r => r.json())
    .then(() => {
        const container = document.querySelector('.contact-container');
        if (container) {
            container.innerHTML = `
                <div class="contact-success-card" style="text-align: center; padding: 24px 0;">
                    <h3 style="color: #10b981; font-size: 22px; font-weight: 700; margin-bottom: 12px; font-family: var(--font-heading);">We've received your message! 🎉</h3>
                    <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Our team will get back to you within 24 hours.</p>
                    <div style="margin-top: 24px;">
                        <a href="https://calendly.com/lovishv491/30min" target="_blank" rel="noopener noreferrer" class="btn-primary-glow" style="text-decoration: none;">
                            <span class="btn-arrow">➔</span>
                            <span>Book Your Call Instantly</span>
                        </a>
                    </div>
                </div>
            `;
        }
    })
    .catch(() => {
        const container = document.querySelector('.contact-container');
        if (container) {
            container.innerHTML = `
                <div class="contact-success-card" style="text-align: center; padding: 24px 0;">
                    <h3 style="color: #10b981; font-size: 22px; font-weight: 700; margin-bottom: 12px; font-family: var(--font-heading);">We've received your message! 🎉</h3>
                    <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Our team will get back to you within 24 hours.</p>
                    <div style="margin-top: 24px;">
                        <a href="https://calendly.com/lovishv491/30min" target="_blank" rel="noopener noreferrer" class="btn-primary-glow" style="text-decoration: none;">
                            <span class="btn-arrow">➔</span>
                            <span>Book Your Call Instantly</span>
                        </a>
                    </div>
                </div>
            `;
        }
    });
}

// DOM Setup
document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll Progress & Sticky Nav
    const scrollProgress = document.getElementById('scroll-progress');
    const nav = document.getElementById('nav');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const percent = height > 0 ? (winScroll / height) * 100 : 0;
        
        if (scrollProgress) scrollProgress.style.width = percent + "%";
        if (nav) {
            if (winScroll > 60) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });
    
    // 2. Smooth Scroll for Anchor Targets
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                
                // Collapse mobile menu if open
                const hamburger = document.querySelector('.hamburger');
                const mobileMenu = document.getElementById('mobileMenu');
                if (hamburger && hamburger.classList.contains('open')) {
                    hamburger.classList.remove('open');
                    mobileMenu.classList.remove('open');
                }
                
                targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 3. Exit Intent Listeners
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 20) showPopup();
    });
    setTimeout(showPopup, 40000); // Timeout trigger
    
    const exitPopup = document.getElementById('exitPopup');
    if (exitPopup) {
        exitPopup.addEventListener('click', (e) => {
            if (e.target === exitPopup) closePopup();
        });
    }

    // 4. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const ans = other.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = '0';
                }
            });
            
            // Toggle active state
            if (isActive) {
                item.classList.remove('active');
                const ans = item.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                const ans = item.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
            }
        });
    });

    // 5. Pricing Tab Switchers (Standard Multi-pricing Grid support)
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    if (pricingTabs && pricingTabs.length > 0) {
        pricingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                pricingTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.getAttribute('data-target');
                if (target) {
                    const grids = document.querySelectorAll('.pricing-grid-tab-content');
                    if (grids && grids.length > 0) {
                        grids.forEach(g => {
                            g.style.display = (g.id === `pricing-${target}`) ? 'grid' : 'none';
                        });
                    }
                }
            });
        });
    }

    // 6. Throttled Desktop Hero Parallax
    const heroVisual = document.querySelector('.service-visual-container, .seo-visual-container, .automation-visual-container, .ai-hero-visual-wrapper, [data-purpose="process-visualization"]');
    if (heroVisual && window.innerWidth > 900) {
        const browser = document.querySelector('.browser-mockup, .search-mockup, .seo-browser-mockup, .ai-chat-window');
        const cards = document.querySelector('.stats-mockup, .flow-mockup, .chart-mockup, .analytics-row, .ai-cards-stack');
        const search = document.querySelector('.seo-search-input-mockup, .ad-mockup, .glass-panel');
        
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let tick = false;
        
        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth) - 0.5;
            targetY = (e.clientY / window.innerHeight) - 0.5;
            
            if (!tick) {
                requestAnimationFrame(() => {
                    mouseX += (targetX - mouseX) * 0.08;
                    mouseY += (targetY - mouseY) * 0.08;
                    
                    const rx = -mouseY * 8;
                    const ry = mouseX * 8;
                    
                    if (browser) browser.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
                    if (cards) cards.style.transform = `rotateX(${rx * 0.75}deg) rotateY(${ry * 0.75}deg) translateZ(20px)`;
                    if (search) search.style.transform = `rotateX(${rx * 0.5}deg) rotateY(${ry * 0.5}deg) translateZ(5px)`;
                    
                    tick = false;
                });
                tick = true;
            }
        });
    }

    // 7. Video Transcript Toggle
    const transcriptBtn = document.querySelector('.transcript-toggle-btn');
    const transcriptText = document.querySelector('.transcript-preview-box');
    if (transcriptBtn && transcriptText) {
        transcriptBtn.addEventListener('click', () => {
            transcriptText.classList.toggle('open');
            transcriptBtn.textContent = transcriptText.classList.contains('open') ? 'Hide Transcript ▲' : 'Show Transcript ▼';
        });
    }

    // 8. GSAP ScrollTrigger Animations
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        const addHover = (selector) => {
            document.querySelectorAll(selector).forEach(el => el.classList.add("hover-ready"));
        };

        // Scroll reveals (Section-by-section triggers to prevent pre-triggering)
        document.querySelectorAll('section').forEach(section => {
            const upCards = section.querySelectorAll('.anim-up');
            if (upCards.length > 0) {
                gsap.from(upCards, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%"
                    },
                    onComplete: () => {
                        upCards.forEach(el => el.classList.add("hover-ready"));
                    }
                });
            }

            const steps = section.querySelectorAll('.anim-step');
            if (steps.length > 0) {
                gsap.from(steps, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        onEnter: () => {
                            const line = section.querySelector(".how-line");
                            if (line) line.style.transform = "scaleX(1)";
                        }
                    },
                    onComplete: () => {
                        steps.forEach(el => el.classList.add("hover-ready"));
                    }
                });
            }

            const prices = section.querySelectorAll('.anim-price');
            if (prices.length > 0) {
                gsap.from(prices, {
                    y: 25,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%"
                    },
                    onComplete: () => {
                        prices.forEach(el => el.classList.add("hover-ready"));
                    }
                });
            }

            const faqs = section.querySelectorAll('.faq-item');
            if (faqs.length > 0) {
                gsap.from(faqs, {
                    y: 15,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.06,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%"
                    }
                });
            }

            const cta = section.querySelectorAll('.anim-cta');
            if (cta.length > 0) {
                gsap.from(cta, {
                    y: 25,
                    opacity: 0,
                    duration: 1.0,
                    ease: "power2.out",
                    clearProps: "all",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%"
                    }
                });
            }
        });

        // 9. Process Horizontal Timeline (Desktop Only)
        const timelineSec = document.querySelector(".timeline-horizontal-wrapper");
        const timelineScroll = document.querySelector(".timeline-horizontal-stepper");
        if (timelineSec && timelineScroll && window.innerWidth > 900) {
            const scrollWidth = timelineScroll.scrollWidth;
            gsap.to(timelineScroll, {
                x: () => -(scrollWidth - window.innerWidth + 200),
                ease: "none",
                scrollTrigger: {
                    trigger: timelineSec,
                    pin: true,
                    scrub: 1,
                    start: "top 100px",
                    end: () => "+=" + (scrollWidth - window.innerWidth + 200),
                    invalidateOnRefresh: true
                }
            });
        }
    }
});