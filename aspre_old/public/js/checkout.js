// ============================================
// CHECKOUT PAGE - Payment Processing
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initCheckout();
    loadStripe();
    loadPayPal();
});

// ============================================
// CONFIGURATION
// ============================================
const CHECKOUT_CONFIG = {
    stripePublishableKey: 'pk_live_YOUR_STRIPE_KEY', // Add from environment
    paypalClientId: 'YOUR_PAYPAL_CLIENT_ID', // Add from environment
    apiBaseUrl: '/api'
};

// ============================================
// INITIALIZE CHECKOUT
// ============================================
function initCheckout() {
    // Update pricing display
    updatePricingDisplay();

    // Handle payment method selection
    initPaymentMethodSelection();

    // Handle form submission
    initCheckoutForm();

    // Apply coupon codes
    initCouponCode();
}

// ============================================
// UPDATE PRICING DISPLAY
// ============================================
function updatePricingDisplay() {
    const pricing = window.ASPRE.CONFIG.pricing;
    const savings = window.ASPRE.calculateSavings();

    document.getElementById('original-price').textContent = `${pricing.symbol}${pricing.original}`;
    document.getElementById('current-price').textContent = `${pricing.symbol}${pricing.current}`;
    document.getElementById('total-price').textContent = `${pricing.symbol}${pricing.current}`;
    document.getElementById('savings-amount').textContent = savings.formatted;
}

// ============================================
// PAYMENT METHOD SELECTION
// ============================================
function initPaymentMethodSelection() {
    const paymentOptions = document.querySelectorAll('.payment-option');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Remove active class from all
            paymentOptions.forEach(opt => opt.classList.remove('active'));

            // Add active class to selected
            this.classList.add('active');

            // Get selected method
            const method = this.dataset.method;

            // Show/hide payment forms
            showPaymentForm(method);
        });
    });
}

function showPaymentForm(method) {
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.style.display = 'none';
    });

    // Show selected payment form
    const selectedForm = document.getElementById(`${method}-form`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

// ============================================
// STRIPE INTEGRATION
// ============================================
let stripe;
let stripeElements;

async function loadStripe() {
    try {
        stripe = Stripe(CHECKOUT_CONFIG.stripePublishableKey);
        stripeElements = stripe.elements();

        // Create card element
        const cardElement = stripeElements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        });

        // Mount card element
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer) {
            cardElement.mount('#card-element');

            // Handle validation errors
            cardElement.on('change', function (event) {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }

    } catch (error) {
        console.error('Stripe loading error:', error);
    }
}

async function processStripePayment(customerData) {
    try {
        // Show loading
        showCheckoutLoading(true);

        // Create payment intent on server
        const response = await fetch(`${CHECKOUT_CONFIG.apiBaseUrl}/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: window.ASPRE.CONFIG.pricing.current * 100, // Convert to cents
                currency: window.ASPRE.CONFIG.pricing.currency.toLowerCase(),
                customer: customerData
            })
        });

        const { clientSecret } = await response.json();

        // Confirm card payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: stripeElements.getElement('card'),
                billing_details: {
                    name: customerData.name,
                    email: customerData.email
                }
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        // Payment successful
        if (paymentIntent.status === 'succeeded') {
            await completeOrder({
                ...customerData,
                paymentMethod: 'stripe',
                paymentId: paymentIntent.id,
                amount: window.ASPRE.CONFIG.pricing.current
            });
        }

    } catch (error) {
        showCheckoutLoading(false);
        window.ASPRE.showNotification(error.message, 'error');
    }
}

// ============================================
// PAYPAL INTEGRATION
// ============================================
function loadPayPal() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${CHECKOUT_CONFIG.paypalClientId}&currency=${window.ASPRE.CONFIG.pricing.currency}`;
    script.async = true;
    script.onload = initPayPalButtons;
    document.head.appendChild(script);
}

function initPayPalButtons() {
    if (typeof paypal === 'undefined') return;

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: window.ASPRE.CONFIG.pricing.current.toString()
                    },
                    description: 'Vectric Aspire 12 - Full Lifetime License'
                }]
            });
        },
        onApprove: async function (data, actions) {
            const order = await actions.order.capture();

            const customerData = {
                name: order.payer.name.given_name + ' ' + order.payer.name.surname,
                email: order.payer.email_address,
                paymentMethod: 'paypal',
                paymentId: order.id,
                amount: window.ASPRE.CONFIG.pricing.current
            };

            await completeOrder(customerData);
        },
        onError: function (err) {
            window.ASPRE.showNotification('PayPal payment failed. Please try again.', 'error');
            console.error('PayPal Error:', err);
        }
    }).render('#paypal-button-container');
}

// ============================================
// CHECKOUT FORM SUBMISSION
// ============================================
function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate form
            if (!window.ASPRE.validateForm(this)) {
                return;
            }

            // Get customer data
            const customerData = {
                name: document.getElementById('customer-name').value,
                email: document.getElementById('customer-email').value,
                country: document.getElementById('customer-country').value
            };

            // Get selected payment method
            const selectedMethod = document.querySelector('.payment-option.active')?.dataset.method;

            if (selectedMethod === 'stripe' || selectedMethod === 'card') {
                await processStripePayment(customerData);
            }
            // PayPal is handled by its own buttons
        });
    }
}

// ============================================
// COMPLETE ORDER
// ============================================
async function completeOrder(orderData) {
    try {
        showCheckoutLoading(true);

        // Create order in database
        const response = await fetch(`${CHECKOUT_CONFIG.apiBaseUrl}/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            // Save order info to localStorage
            window.ASPRE.saveToLocalStorage('lastOrder', result.order);

            // Redirect to thank you page
            window.location.href = `/thank-you.html?order=${result.order.id}`;
        } else {
            throw new Error(result.message || 'Order creation failed');
        }

    } catch (error) {
        showCheckoutLoading(false);
        window.ASPRE.showNotification('Order processing failed: ' + error.message, 'error');
    }
}

// ============================================
// COUPON CODE
// ============================================
function initCouponCode() {
    const couponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-code');

    if (couponBtn && couponInput) {
        couponBtn.addEventListener('click', async function () {
            const code = couponInput.value.trim().toUpperCase();

            if (!code) {
                window.ASPRE.showNotification('Please enter a coupon code', 'error');
                return;
            }

            try {
                const response = await fetch(`${CHECKOUT_CONFIG.apiBaseUrl}/validate-coupon`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

                const result = await response.json();

                if (result.valid) {
                    applyCoupon(result.discount);
                    window.ASPRE.showNotification('Coupon applied successfully!', 'success');
                } else {
                    window.ASPRE.showNotification('Invalid coupon code', 'error');
                }
            } catch (error) {
                window.ASPRE.showNotification('Error validating coupon', 'error');
            }
        });
    }
}

function applyCoupon(discount) {
    const currentPrice = window.ASPRE.CONFIG.pricing.current;
    const discountAmount = (currentPrice * discount) / 100;
    const newPrice = currentPrice - discountAmount;

    document.getElementById('discount-row').style.display = 'flex';
    document.getElementById('discount-amount').textContent = `-${window.ASPRE.CONFIG.pricing.symbol}${discountAmount.toFixed(2)}`;
    document.getElementById('total-price').textContent = `${window.ASPRE.CONFIG.pricing.symbol}${newPrice.toFixed(2)}`;
}

// ============================================
// LOADING STATE
// ============================================
function showCheckoutLoading(show) {
    const submitBtn = document.querySelector('.checkout-submit-btn');
    const loadingOverlay = document.getElementById('checkout-loading');

    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.innerHTML = show ?
            '<i class="fas fa-spinner fa-spin"></i> Processing...' :
            '<i class="fas fa-lock"></i> Complete Purchase';
    }

    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// ============================================
// SECURITY BADGES
// ============================================
function displaySecurityBadges() {
    // Add security badges and trust indicators
    console.log('Security badges loaded');
}

// Initialize security badges
displaySecurityBadges();
