// ============================================
// ASPRE - Main JavaScript
// Frontend Functionality
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Pricing (editable via admin panel)
    pricing: {
        original: 1995,
        current: 119,
        currency: 'USD',
        symbol: '$'
    },

    // Stats (editable via admin panel)
    stats: {
        licensesDelivered: 8347,
        satisfactionRate: 98,
        foundedYear: 2019
    },

    // Contact
    support: {
        email: 'support@aspire-software.com',
        phone: '+1 (555) 123-4567'
    },

    // API Endpoints (Cloudflare Functions)
    api: {
        createOrder: '/api/create-order',
        validatePayment: '/api/validate-payment',
        sendEmail: '/api/send-email',
        submitSupport: '/api/submit-support'
    }
};

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initFAQ();
    initScrollAnimations();
    initSmoothScroll();
    initFormValidation();
    updateStats();
});

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.nav-container')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            // Update aria-expanded
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .card');
    animateElements.forEach(el => observer.observe(el));
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// FORM VALIDATION
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(field);
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(field, message) {
    clearError(field);

    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = 'var(--text-sm)';
    errorDiv.style.marginTop = 'var(--space-1)';

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// ============================================
// UPDATE STATS (COUNTER ANIMATION)
// ============================================
function updateStats() {
    const statNumbers = document.querySelectorAll('.grid-3 h3');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/[^0-9]/g, ''));

    let current = 0;
    const increment = number / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }

        let displayValue = Math.floor(current).toLocaleString();
        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';

        element.textContent = displayValue;
    }, stepTime);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// ============================================
// PRICE CALCULATOR
// ============================================
function calculateSavings() {
    const original = CONFIG.pricing.original;
    const current = CONFIG.pricing.current;
    const savings = original - current;
    const percentage = Math.round((savings / original) * 100);

    return {
        savings,
        percentage,
        formatted: `${CONFIG.pricing.symbol}${savings.toLocaleString()}`
    };
}

// ============================================
// STICKY HEADER ON SCROLL
// ============================================
let lastScroll = 0;
window.addEventListener('scroll', function () {
    const header = document.querySelector('.site-header');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c🚀 ASPRE - Vectric Aspire 12 E-Commerce Platform', 'font-size: 16px; font-weight: bold; color: #0066cc;');
console.log('%cBuilt for professional CNC software sales', 'font-size: 12px; color: #666;');
console.log('%cVersion 1.0.0', 'font-size: 10px; color: #999;');

// ============================================// Video Modal Functions
function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close video modal when clicking outside
document.getElementById('videoModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'videoModal') {
        closeVideoModal();
    }
});

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    const subject = `Support Request from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

    window.location.href = `mailto:contact@3daspire.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    closeContactModal();
}

// Close contact modal when clicking outside
document.getElementById('contactModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'contactModal') {
        closeContactModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// Make functions globally available
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

// ============================================
// EXPORT FOR USE IN OTHER SCRIPTS
// ============================================
window.ASPRE = {
    CONFIG,
    showNotification,
    saveToLocalStorage,
    getFromLocalStorage,
    calculateSavings,
    validateForm,
    isValidEmail,
    openVideoModal,
    closeVideoModal
};
