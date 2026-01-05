// Admin Login Logic

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorEl = document.getElementById('errorMessage');

    // Reset UI
    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

    try {
        const res = await fetch('/admin/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = 'index.html';
        } else {
            throw new Error(data.error || 'Login failed');
        }

    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
        btn.disabled = false;
        btn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
    }
}
