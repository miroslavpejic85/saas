const out = document.getElementById('out');

async function init() {
    try {
        const me = await window.App.apiGet('/api/me');
        if (me.paid) {
            window.location.href = '/protected.html';
            return;
        }
        out.textContent = `Logged in as ${me.user.email}. Ready to pay.`;
    } catch {
        out.textContent = 'Login required to pay.';
    }
}

document.getElementById('pay').onclick = async () => {
    out.textContent = '';
    try {
        const data = await window.App.apiPost('/api/stripe/create-checkout-session', {});
        window.location.href = data.url;
    } catch (e) {
        out.textContent = e.message + '\n(You must login first.)';
    }
};

init();
