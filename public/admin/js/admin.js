// Admin Dashboard Logic

// API Endpoints
const API_BASE = '/admin/api';

// State
let currentSettings = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupNavigation();
    await loadSettings();
});

// Check Authentication
async function checkAuth() {
    try {
        const res = await fetch(`${API_BASE}/verify`);
        if (!res.ok) {
            window.location.href = 'login.html';
        }
        const data = await res.json();
        document.getElementById('adminUsername').textContent = data.username || 'Admin';
    } catch (e) {
        window.location.href = 'login.html';
    }
}

// Navigation Tabs
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update Nav
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update Content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    // Update Title
    const titles = {
        'overview': 'Overview',
        'payments': 'Payment Settings',
        'pricing': 'Pricing Management',
        'marketing': 'Marketing & Tracking',
        'security': 'Security Settings'
    };
    document.getElementById('pageTitle').textContent = titles[tabId];
}

// Load Settings
async function loadSettings() {
    showLoading(true);
    try {
        const res = await fetch(`${API_BASE}/settings`);
        if (res.ok) {
            currentSettings = await res.json();
            populateForms(currentSettings);
            updateStats(currentSettings);
        }
    } catch (e) {
        showToast('Error loading settings', 'error');
    } finally {
        showLoading(false);
    }
}

// Populate Forms with Data
function populateForms(data) {
    // Stripe
    if (data.stripe) {
        document.getElementById('stripeTestMode').checked = data.stripe.testMode;
        document.getElementById('stripePublicKey').value = data.stripe.publicKey || '';
        document.getElementById('stripeLinkUSD').value = data.stripe.links?.usd || '';
        document.getElementById('stripeLinkGBP').value = data.stripe.links?.gbp || '';
    }

    // Pricing
    if (data.pricing) {
        document.getElementById('currencySymbol').value = data.pricing.symbol || '$';
        document.getElementById('currencyCode').value = data.pricing.code || 'USD';
        document.getElementById('priceOriginal').value = data.pricing.original || '';
        document.getElementById('priceCurrent').value = data.pricing.current || '';
        calculateDiscount();
    }

    // Marketing
    if (data.marketing) {
        document.getElementById('googleAdsId').value = data.marketing.googleAds || '';
        document.getElementById('ga4Id').value = data.marketing.ga4 || '';
        document.getElementById('gtmId').value = data.marketing.gtm || '';
    }
}

// Update Overview Stats
function updateStats(data) {
    if (data.pricing) {
        document.getElementById('statPrice').textContent = `${data.pricing.symbol}${data.pricing.current}`;
    }
    if (data.stripe) {
        const modeEl = document.getElementById('statStripeMode');
        modeEl.textContent = data.stripe.testMode ? 'Test Mode' : 'Live Mode';
        modeEl.style.color = data.stripe.testMode ? '#f59e0b' : '#10b981';
    }
}

// Calculate Discount
document.getElementById('priceOriginal').addEventListener('input', calculateDiscount);
document.getElementById('priceCurrent').addEventListener('input', calculateDiscount);

function calculateDiscount() {
    const original = parseFloat(document.getElementById('priceOriginal').value) || 0;
    const current = parseFloat(document.getElementById('priceCurrent').value) || 0;
    const symbol = document.getElementById('currencySymbol').value;

    if (original > 0 && current > 0) {
        const discount = original - current;
        const percent = Math.round((discount / original) * 100);
        document.getElementById('priceDiscount').value = `${symbol}${discount.toFixed(2)} (${percent}% OFF)`;
    }
}

// Save Settings
async function saveSettings(e, type) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        let payload = {};

        if (type === 'stripe') {
            payload.stripe = {
                testMode: document.getElementById('stripeTestMode').checked,
                publicKey: document.getElementById('stripePublicKey').value,
                links: {
                    usd: document.getElementById('stripeLinkUSD').value,
                    gbp: document.getElementById('stripeLinkGBP').value
                }
            };
            const secret = document.getElementById('stripeSecretKey').value;
            if (secret) payload.stripe.secretKey = secret;
        }

        if (type === 'pricing') {
            payload.pricing = {
                symbol: document.getElementById('currencySymbol').value,
                code: document.getElementById('currencyCode').value,
                original: parseFloat(document.getElementById('priceOriginal').value),
                current: parseFloat(document.getElementById('priceCurrent').value)
            };
        }

        if (type === 'marketing') {
            payload.marketing = {
                googleAds: document.getElementById('googleAdsId').value,
                ga4: document.getElementById('ga4Id').value,
                gtm: document.getElementById('gtmId').value
            };
        }

        const res = await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast('Settings saved successfully');
            await loadSettings(); // Reload to confirm
        } else {
            throw new Error('Failed to save');
        }

    } catch (e) {
        showToast('Error saving settings', 'error');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Change Password
async function updatePassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (newPass !== confirm) {
        showToast('New passwords do not match', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current, newPass })
        });

        if (res.ok) {
            showToast('Password updated successfully');
            e.target.reset();
        } else {
            showToast('Failed to update password', 'error');
        }
    } catch (e) {
        showToast('Error updating password', 'error');
    }
}

// Utilities
function showLoading(show) {
    const el = document.getElementById('loadingState');
    if (show) el.classList.add('active');
    else el.classList.remove('active');
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');

    msgEl.textContent = msg;
    toast.className = 'toast show';

    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = '#ef4444';
    } else {
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#10b981';
    }

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function copyToClipboard(id) {
    const el = document.getElementById(id);
    el.select();
    document.execCommand('copy');
    showToast('Copied to clipboard');
}

function toggleVisibility(id) {
    const el = document.getElementById(id);
    if (el.type === 'password') el.type = 'text';
    else el.type = 'password';
}

async function logout() {
    await fetch(`${API_BASE}/logout`, { method: 'POST' });
    window.location.href = 'login.html';
}
