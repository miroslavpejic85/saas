async function load() {
    try {
        const data = await window.App.apiGet('/api/me');
        window.App.setText('status', window.App.pretty(data));
    } catch {
        window.App.setText('status', 'Not logged in.');
    }
}

load();
