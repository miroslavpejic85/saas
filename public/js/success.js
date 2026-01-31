const out = document.getElementById('out');

async function pollPaid() {
    out.textContent = 'Checking payment status...';

    for (let i = 0; i < 20; i++) {
        try {
            const me = await window.App.apiGet('/api/me');
            out.textContent = window.App.pretty(me);
            if (me.paid) {
                out.textContent = 'Paid confirmed. Redirecting to protected...';
                setTimeout(() => {
                    window.location.href = '/protected.html';
                }, 600);
                return;
            }
        } catch {
            out.textContent = 'Not logged in.';
            return;
        }

        await window.App.sleep(1500);
    }

    out.textContent += '\n\nStill waiting for webhook. If this never updates, your Stripe webhook may be failing.';
}

pollPaid();
