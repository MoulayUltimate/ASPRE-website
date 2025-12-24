/* ============================================
   ASPRE CHECKOUT - Google Sheets Integration
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CHECKOUT_CONFIG = {
    stripeUrl: 'https://buy.stripe.com/bJecN7frL2v38C3an5aAw01',
    // IMPORTANT: Replace this with your Google Apps Script URL
    googleSheetsUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
    productName: 'Vectric Aspire 12',
    googleAds: {
        addToBasket: 'AW-17819561147/UzIMCLPV09YbELvZg7FC',
        beginCheckout: 'AW-17761712074/osgjCPL7xtMbEMrvuJVC'
    }
};

// ============================================
// MODAL FUNCTIONS
// ============================================
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Fire Google Ads conversions
    if (typeof gtag === 'function') {
        // Add to Basket
        gtag('event', 'conversion', {
            'send_to': CHECKOUT_CONFIG.googleAds.addToBasket
        });

        // Begin Checkout
        gtag('event', 'conversion', {
            'send_to': CHECKOUT_CONFIG.googleAds.beginCheckout,
            'value': 119.0,
            'currency': 'USD'
        });
    }

    // Clear form
    const emailInput = document.getElementById('checkoutEmail');
    const privacyCheck = document.getElementById('privacyCheck');
    if (emailInput) emailInput.value = '';
    if (privacyCheck) privacyCheck.checked = false;
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================
async function handleCheckoutSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('checkoutEmail')?.value;
    const privacyChecked = document.getElementById('privacyCheck')?.checked;
    const submitBtn = document.getElementById('proceedCheckoutBtn');

    // Validation
    if (!email || !privacyChecked) {
        alert('Please fill in all required fields and accept the terms.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Disable button and show loading
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg style="width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block;" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing...
        `;
        submitBtn.style.opacity = '0.7';
    }

    try {
        // Send data to Google Sheets
        const data = {
            email: email,
            product: CHECKOUT_CONFIG.productName,
            timestamp: new Date().toISOString(),
            source: window.location.href
        };

        // Using no-cors mode for Google Apps Script
        await fetch(CHECKOUT_CONFIG.googleSheetsUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('✅ Email sent to Google Sheets:', email);

        // Small delay to ensure data is sent
        await new Promise(resolve => setTimeout(resolve, 500));

        // Track purchase conversion
        if (typeof gtag_report_conversion === 'function') {
            gtag_report_conversion(CHECKOUT_CONFIG.stripeUrl);
        }

        // Redirect to Stripe with prefilled email
        const stripeCheckoutUrl = `${CHECKOUT_CONFIG.stripeUrl}?prefilled_email=${encodeURIComponent(email)}`;
        console.log('🔄 Redirecting to Stripe:', stripeCheckoutUrl);
        window.location.href = stripeCheckoutUrl;

    } catch (error) {
        console.error('❌ Error sending to Google Sheets:', error);

        // Still redirect to Stripe even if Google Sheets fails
        const stripeCheckoutUrl = `${CHECKOUT_CONFIG.stripeUrl}?prefilled_email=${encodeURIComponent(email)}`;
        window.location.href = stripeCheckoutUrl;
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Checkout system initialized');

    // Add CSS for button animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .checkout-modal-backdrop.active {
            display: flex !important;
        }
        #proceedCheckoutBtn:hover:not(:disabled) {
            background: #2563eb !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        #proceedCheckoutBtn:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);

    // Attach click handlers to all buy buttons
    const buyButtons = document.querySelectorAll('a[href*="stripe.com"], .buy-btn, .btn-primary');
    console.log(`📍 Found ${buyButtons.length} buy buttons`);

    buyButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🛒 Buy button clicked - opening checkout modal');
            openCheckoutModal();
        });
    });

    // Close modal when clicking backdrop
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeCheckoutModal();
            }
        });
    }

    // Keyboard shortcut: ESC to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeCheckoutModal();
        }
    });
});

// ============================================
// VALIDATION MESSAGE
// ============================================
if (CHECKOUT_CONFIG.googleSheetsUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('⚠️ WARNING: Google Sheets URL not configured! Please update CHECKOUT_CONFIG.googleSheetsUrl');
}
