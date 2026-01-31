const out = document.getElementById('out');

document.getElementById('send').onclick = async () => {
    out.textContent = '';
    try {
        const email = document.getElementById('email').value.trim();
        await window.App.apiPost('/api/auth/send-otp', { email });
        out.textContent = 'OTP sent. Check your email.';
    } catch (e) {
        out.textContent = e.message;
    }
};

document.getElementById('verify').onclick = async () => {
    out.textContent = '';
    try {
        const email = document.getElementById('email').value.trim();
        const token = document.getElementById('code').value.trim();
        const data = await window.App.apiPost('/api/auth/verify-otp', { email, token });
        out.textContent = `Logged in as: ${data.user.email}\nRedirecting to home...`;
        setTimeout(() => {
            window.location.href = '/';
        }, 600);
    } catch (e) {
        out.textContent = e.message;
    }
};

document.getElementById('logout').onclick = async () => {
    try {
        await window.App.apiPost('/api/auth/logout', {});
        out.textContent = 'Logged out.';
    } catch (e) {
        out.textContent = e.message;
    }
};
