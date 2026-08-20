const GistSync = (function() {
    const GIST_ID_KEY = 'gist_id';
    const GITHUB_TOKEN_KEY = 'github_token';
    const FILENAME = 'k-tracker-sync.json';

    function showToast(msg, color) {
        if (!document.getElementById('sync-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'sync-toast-styles';
            style.textContent = `
                #sync-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    z-index: 9999;
                    transition: opacity 0.3s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    opacity: 0;
                    pointer-events: none;
                }
                @media (max-width: 600px) {
                    #sync-toast {
                        bottom: auto;
                        top: 20px;
                        right: 50%;
                        transform: translateX(50%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        let toast = document.getElementById('sync-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sync-toast';
            document.body.appendChild(toast);
        }
        toast.style.background = color;
        toast.textContent = msg;
        toast.style.opacity = '1';
        if (window.toastTimeout) clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
    }

    let remoteData = null;

    function getCredentials() {
        return {
            id: localStorage.getItem(GIST_ID_KEY),
            token: localStorage.getItem(GITHUB_TOKEN_KEY)
        };
    }

    async function fetchGist() {
        const creds = getCredentials();
        if (!creds.id || !creds.token) return null;
        try {
            const response = await fetch(`https://api.github.com/gists/${creds.id}?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Authorization': `token ${creds.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const data = await response.json();
            if (data && data.files && data.files[FILENAME]) {
                const content = data.files[FILENAME].content;
                remoteData = content ? JSON.parse(content) : {};
            } else if (data && data.files) {
                remoteData = {};
            } else {
                return null;
            }

            // Store ALL namespaces into localStorage so pages can read without re-fetching
            Object.keys(remoteData).forEach(function(key) {
                try {
                    localStorage.setItem(key, JSON.stringify(remoteData[key]));
                } catch(e) {}
            });

            // Signal that a fresh preload has been done this session
            sessionStorage.setItem('gist-preloaded', '1');

            return remoteData;
        } catch (e) {
            console.error('Error fetching gist', e);
        }
        return null;
    }

    let saveTimeout = null;
    async function saveToGist(dataObj) {
        showToast("Syncing...", "#3b82f6");
        const creds = getCredentials();
        if (!creds.id || !creds.token) return;
        try {
            await fetch(`https://api.github.com/gists/${creds.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${creds.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [FILENAME]: {
                            content: JSON.stringify(dataObj, null, 2)
                        }
                    }
                })
            });
            showToast('Saved to Cloud ☁️', '#22c55e');
        } catch (e) {
            console.error('Error saving gist', e);
        }
    }

    return {
        init: async function() {
            return await fetchGist();
        },
        save: function(namespace, localState) {
            if (!remoteData) remoteData = {};
            remoteData[namespace] = localState;
            // Also update localStorage immediately
            try { localStorage.setItem(namespace, JSON.stringify(localState)); } catch(e) {}
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveToGist(remoteData);
            }, 1000);
        },
        setCredentials: function(id, token) {
            localStorage.setItem(GIST_ID_KEY, id);
            localStorage.setItem(GITHUB_TOKEN_KEY, token);
            showToast('Cloud Connected! Reloading...', '#22c55e');
            setTimeout(function() { location.reload(); }, 1000);
        }
    };
})();
