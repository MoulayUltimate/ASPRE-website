/**
 * Geo-Location Currency Conversion System
 * Automatically detects user location and converts prices to local currency
 */

(function () {
    'use strict';

    // Currency Configuration
    const CURRENCY_CONFIG = {
        'USD': {
            symbol: '$',
            code: 'USD',
            rate: 1,
            position: 'before', // symbol before or after amount
            prices: {
                main: 119,
                retail: 1995,
                discount: 1876,
                trainingLibrary: 427,
                designFiles: 259,
                installationSupport: 149,
                lifetimeUpdates: 3337,
                totalDiscount: 3218,
                fullPackageRetail: 3457
            },
            checkoutUrl: 'https://buy.stripe.com/9B6aEX92segVgRL76V4ow00'
        },
        'GBP': {
            symbol: '£',
            code: 'GBP',
            rate: 0.75, // Conversion rate from USD to GBP (approx 89/119)
            position: 'before',
            prices: {
                main: 89,
                retail: 1492,
                discount: 1403,
                trainingLibrary: 319,
                designFiles: 194,
                installationSupport: 111,
                lifetimeUpdates: 2496,
                totalDiscount: 2407,
                fullPackageRetail: 2585
            },
            checkoutUrl: 'https://buy.stripe.com/9B64gBbbv7Png4vgLtaAw02'
        },
        'EUR': {
            symbol: '€',
            code: 'EUR',
            rate: 0.92, // Conversion rate from USD to EUR
            position: 'before',
            prices: {
                main: 109,
                retail: 1835,
                discount: 1726,
                trainingLibrary: 392,
                designFiles: 238,
                installationSupport: 137,
                lifetimeUpdates: 3070,
                totalDiscount: 2961,
                fullPackageRetail: 3180
            },
            checkoutUrl: 'https://buy.stripe.com/9B6aEX92segVgRL76V4ow00'
        },
        'CAD': {
            symbol: 'C$',
            code: 'CAD',
            rate: 1.35, // Conversion rate from USD to CAD
            position: 'before',
            prices: {
                main: 159,
                retail: 2693,
                discount: 2534,
                trainingLibrary: 576,
                designFiles: 349,
                installationSupport: 201,
                lifetimeUpdates: 4505,
                totalDiscount: 4344,
                fullPackageRetail: 4667
            },
            checkoutUrl: 'https://buy.stripe.com/9B6aEX92segVgRL76V4ow00'
        },
        'AUD': {
            symbol: 'A$',
            code: 'AUD',
            rate: 1.52, // Conversion rate from USD to AUD
            position: 'before',
            prices: {
                main: 179,
                retail: 3032,
                discount: 2853,
                trainingLibrary: 649,
                designFiles: 393,
                installationSupport: 226,
                lifetimeUpdates: 5072,
                totalDiscount: 4893,
                fullPackageRetail: 5255
            },
            checkoutUrl: 'https://buy.stripe.com/9B6aEX92segVgRL76V4ow00'
        }
    };

    // Country to Currency Mapping
    const COUNTRY_TO_CURRENCY = {
        // British Pound countries
        'GB': 'GBP', // United Kingdom
        'IM': 'GBP', // Isle of Man
        'JE': 'GBP', // Jersey
        'GG': 'GBP', // Guernsey

        // Euro countries
        'AT': 'EUR', // Austria
        'BE': 'EUR', // Belgium
        'CY': 'EUR', // Cyprus
        'EE': 'EUR', // Estonia
        'FI': 'EUR', // Finland
        'FR': 'EUR', // France
        'DE': 'EUR', // Germany
        'GR': 'EUR', // Greece
        'IE': 'EUR', // Ireland
        'IT': 'EUR', // Italy
        'LV': 'EUR', // Latvia
        'LT': 'EUR', // Lithuania
        'LU': 'EUR', // Luxembourg
        'MT': 'EUR', // Malta
        'NL': 'EUR', // Netherlands
        'PT': 'EUR', // Portugal
        'SK': 'EUR', // Slovakia
        'SI': 'EUR', // Slovenia
        'ES': 'EUR', // Spain

        // Canadian Dollar
        'CA': 'CAD', // Canada

        // Australian Dollar
        'AU': 'AUD', // Australia
        'NZ': 'AUD', // New Zealand (using AUD for simplicity)

        // Default to USD for all other countries
    };

    let currentCurrency = 'USD';
    let detectionComplete = false;

    /**
     * Format price with currency symbol
     */
    function formatPrice(amount, currency = currentCurrency) {
        const config = CURRENCY_CONFIG[currency];
        const formatted = config.symbol + Math.round(amount).toLocaleString();
        return formatted;
    }

    /**
     * Detect user's country using IP geolocation
     */
    async function detectCountry() {
        try {
            // Try multiple geolocation services for redundancy
            const services = [
                'https://ipapi.co/json/',
                'https://api.country.is/',
                'https://geolocation-db.com/json/'
            ];

            for (const service of services) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

                    const response = await fetch(service, {
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();

                        // Extract country code based on service response format
                        let countryCode = null;

                        if (data.country_code) {
                            countryCode = data.country_code; // ipapi.co
                        } else if (data.country) {
                            countryCode = data.country; // api.country.is
                        } else if (data.country_code) {
                            countryCode = data.country_code; // geolocation-db.com
                        }

                        if (countryCode) {
                            console.log('Detected country:', countryCode);
                            return countryCode;
                        }
                    }
                } catch (err) {
                    console.warn('Geolocation service failed:', service, err.message);
                    continue; // Try next service
                }
            }

            // If all services fail, return null (will default to USD)
            console.warn('All geolocation services failed, defaulting to USD');
            return null;

        } catch (error) {
            console.error('Country detection error:', error);
            return null;
        }
    }

    /**
     * Get currency for country code
     */
    function getCurrencyForCountry(countryCode) {
        return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
    }

    /**
     * Update all prices on the page
     */
    function updateAllPrices() {
        const currency = CURRENCY_CONFIG[currentCurrency];

        console.log('Updating prices to:', currentCurrency);

        // Update main price displays ($119)
        document.querySelectorAll('.price-main').forEach(el => {
            el.textContent = formatPrice(currency.prices.main);
        });

        // Update retail price ($1,995)
        document.querySelectorAll('.price-retail').forEach(el => {
            el.textContent = formatPrice(currency.prices.retail);
        });

        // Update discount amount ($1,876)
        document.querySelectorAll('.price-discount').forEach(el => {
            el.textContent = formatPrice(currency.prices.discount);
        });

        // Update button text
        document.querySelectorAll('.btn-price-text').forEach(el => {
            const baseText = el.getAttribute('data-base-text') || 'Get Aspire 12 Now – Only';
            el.textContent = `${baseText} ${formatPrice(currency.prices.main)}`;
        });

        // Update individual breakdown items
        updateElement('.price-training-library', currency.prices.trainingLibrary);
        updateElement('.price-design-files', currency.prices.designFiles);
        updateElement('.price-installation-support', currency.prices.installationSupport);
        updateElement('.price-lifetime-updates', currency.prices.lifetimeUpdates);
        updateElement('.price-total-discount', currency.prices.totalDiscount);

        // Update currency code displays
        document.querySelectorAll('.currency-code').forEach(el => {
            el.textContent = currentCurrency;
        });

        // Update flash sale banner
        const flashSaleBanner = document.querySelector('.flash-sale-discount');
        if (flashSaleBanner) {
            flashSaleBanner.textContent = formatPrice(currency.prices.discount);
        }

        // Update Checkout URL
        if (typeof CHECKOUT_CONFIG !== 'undefined' && currency.checkoutUrl) {
            CHECKOUT_CONFIG.stripeUrl = currency.checkoutUrl;
            console.log('Updated checkout URL to:', currency.checkoutUrl);
        }

        // Store currency preference
        try {
            localStorage.setItem('preferredCurrency', currentCurrency);
        } catch (e) {
            console.warn('Could not save currency preference:', e);
        }
    }

    /**
     * Helper function to update element text with formatted price
     */
    function updateElement(selector, amount) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.textContent = formatPrice(amount);
        });
    }

    /**
     * Add currency indicator to page
     */
    function addCurrencyIndicator() {
        // Check if indicator already exists
        if (document.getElementById('currency-indicator')) {
            return;
        }

        const indicator = document.createElement('div');
        indicator.id = 'currency-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: transparent;
            padding: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            transition: all 0.3s;
        `;

        indicator.innerHTML = `
            <select id="currency-selector" style="
                border: none;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
                cursor: pointer;
                font-weight: 600;
                color: #0066cc;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">
                <option value="USD">🇺🇸 USD</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="CAD">🇨🇦 CAD</option>
                <option value="AUD">🇦🇺 AUD</option>
            </select>
        `;

        document.body.appendChild(indicator);

        // Set current currency in selector
        const selector = document.getElementById('currency-selector');
        selector.value = currentCurrency;

        // Handle currency change
        selector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            updateAllPrices();

            // Track currency change
            if (typeof gtag !== 'undefined') {
                gtag('event', 'currency_change', {
                    'currency': currentCurrency
                });
            }
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 10000);

        // Show on hover
        indicator.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });

        indicator.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0.7';
        });
    }

    /**
     * Initialize price elements with data attributes
     */
    function initializePriceElements() {
        // This function should be called BEFORE updating prices
        // It adds the necessary classes and data attributes to existing price elements

        // We'll match the exact HTML structure from index.html
        const priceSelectors = [
            { selector: 'span:contains("$119")', class: 'price-main' },
            { selector: 'span:contains("$1,995")', class: 'price-retail' },
            { selector: 'span:contains("$1,876")', class: 'price-discount' },
        ];

        // Find and mark button text elements
        const buttons = document.querySelectorAll('a.btn-primary, a.btn');
        buttons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('$119') || text.includes('Only $')) {
                btn.classList.add('btn-price-text');
                // Store the base text without price
                const baseText = text.replace(/\$[\d,]+/g, '').replace(/Only\s*$/, 'Only').trim();
                btn.setAttribute('data-base-text', baseText.replace('Only', '').trim());
            }
        });
    }

    /**
     * Main initialization function
     */
    async function init() {
        console.log('Initializing geo-currency system...');

        // Check for saved preference first
        try {
            const savedCurrency = localStorage.getItem('preferredCurrency');
            if (savedCurrency && CURRENCY_CONFIG[savedCurrency]) {
                currentCurrency = savedCurrency;
                console.log('Using saved currency preference:', savedCurrency);
            }
        } catch (e) {
            console.warn('Could not read currency preference:', e);
        }

        // Detect country if no saved preference
        if (currentCurrency === 'USD') {
            const countryCode = await detectCountry();
            if (countryCode) {
                const detectedCurrency = getCurrencyForCountry(countryCode);
                console.log('Detected currency from country:', detectedCurrency);
                currentCurrency = detectedCurrency;
            }
        }

        // Initialize price elements
        initializePriceElements();

        // Update all prices
        if (currentCurrency !== 'USD') {
            updateAllPrices();
        }

        // Add currency selector widget
        addCurrencyIndicator();

        detectionComplete = true;

        // Track currency detection
        if (typeof gtag !== 'undefined') {
            gtag('event', 'currency_detected', {
                'currency': currentCurrency
            });
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external access if needed
    window.GeoCurrency = {
        getCurrentCurrency: () => currentCurrency,
        setCurrency: (currency) => {
            if (CURRENCY_CONFIG[currency]) {
                currentCurrency = currency;
                updateAllPrices();
            }
        },
        formatPrice: formatPrice,
        isReady: () => detectionComplete
    };

})();
