const GistSync = (function() {
    const GIST_ID_KEY = 'gist_id';
    const GITHUB_TOKEN_KEY = 'github_token';
    const FILENAME = 'k-tracker-sync.json';
    function showToast(msg, color) {
        let toast = document.getElementById('sync-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sync-toast';
            toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; color: white; z-index: 9999; transition: opacity 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
            document.body.appendChild(toast);
        }
        toast.style.background = color;
        toast.textContent = msg;
        toast.style.opacity = '1';
        if (window.toastTimeout) clearTimeout(window.toastTimeout);
        if (msg !== 'Syncing...' && msg !== 'Fetching...') {
            window.toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
        }
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
                return remoteData;
            } else if (data && data.files) {
                 // The file might not exist yet in a new gist, create it
                 remoteData = {};
                return remoteData;
            }
        } catch (e) {
            console.error('Error fetching gist', e);
        }
        return null;
    }
    // Debounce save to prevent rate limiting
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
            console.log('Synced to Gist successfully');
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
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveToGist(remoteData);
            }, 1000); // 1 second debounce
        },
        setCredentials: function(id, token) {
            localStorage.setItem(GIST_ID_KEY, id);
            localStorage.setItem(GITHUB_TOKEN_KEY, token);
            alert('Credentials saved! The app will now sync with GitHub.');
            location.reload();
        }
    };
})();
