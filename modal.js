window.MSModal = (function() {
    function injectStyles() {
        if (document.getElementById('ms-modal-styles')) return;
        var style = document.createElement('style');
        style.id = 'ms-modal-styles';
        style.textContent = `
            .ms-modal-overlay {
                position: fixed; inset: 0; background: rgba(15, 23, 42, 0.85);
                backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
                z-index: 100000; display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.2s ease;
            }
            .ms-modal-overlay.show { opacity: 1; }
            .ms-modal-box {
                background: #1e293b; border: 1px solid #334155; border-radius: 16px;
                padding: 24px; width: 90%; max-width: 420px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                transform: scale(0.95) translateY(10px); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex; flex-direction: column; gap: 20px;
            }
            .ms-modal-overlay.show .ms-modal-box { transform: scale(1) translateY(0); }
            .ms-modal-title { font-family: -apple-system, sans-serif; font-size: 20px; font-weight: 600; color: #f8fafc; margin: 0; }
            .ms-modal-desc { font-family: -apple-system, sans-serif; font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.5; }
            .ms-modal-input-group { display: flex; flex-direction: column; gap: 8px; }
            .ms-modal-input-group label { font-family: -apple-system, sans-serif; font-size: 13px; color: #cbd5e1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .ms-modal-input-group input {
                background: #0f172a; border: 1px solid #334155; border-radius: 8px;
                padding: 12px 14px; color: white; font-size: 15px; font-family: monospace;
                outline: none; transition: border-color 0.2s, box-shadow 0.2s;
            }
            .ms-modal-input-group input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
            .ms-modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 4px; }
            .ms-btn {
                padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; font-family: -apple-system, sans-serif;
                cursor: pointer; border: none; transition: all 0.2s;
            }
            .ms-btn-cancel { background: transparent; color: #94a3b8; }
            .ms-btn-cancel:hover { background: #334155; color: #f8fafc; }
            .ms-btn-primary { background: #3b82f6; color: white; box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
            .ms-btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
            .ms-btn-danger { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
            .ms-btn-danger:hover { background: rgba(239, 68, 68, 0.25); border-color: rgba(239, 68, 68, 0.5); }
        `;
        document.head.appendChild(style);
    }

    function createModalBase(title, desc, contentHtml, buttonsHtml) {
        injectStyles();
        var overlay = document.createElement('div');
        overlay.className = 'ms-modal-overlay';
        
        var box = document.createElement('div');
        box.className = 'ms-modal-box';
        
        var html = `
            <h3 class="ms-modal-title">${title}</h3>
            ${desc ? `<p class="ms-modal-desc">${desc}</p>` : ''}
            ${contentHtml}
            <div class="ms-modal-actions">
                ${buttonsHtml}
            </div>
        `;
        box.innerHTML = html;
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        
        overlay.offsetHeight; // reflow
        overlay.classList.add('show');
        
        return { overlay, box };
    }

    function close(overlay) {
        overlay.classList.remove('show');
        setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 250);
    }

    return {
        promptSync: function(onSave) {
            var content = `
                <div class="ms-modal-input-group">
                    <label>GitHub Gist ID</label>
                    <input type="text" id="ms-gist-id" placeholder="e.g. 1a2b3c4d..." autocomplete="off" spellcheck="false">
                </div>
                <div class="ms-modal-input-group">
                    <label>Personal Access Token</label>
                    <input type="password" id="ms-gist-token" placeholder="ghp_..." autocomplete="off" spellcheck="false">
                </div>
            `;
            var buttons = `
                <button class="ms-btn ms-btn-cancel" id="ms-sync-cancel">Cancel</button>
                <button class="ms-btn ms-btn-primary" id="ms-sync-save">Connect Cloud</button>
            `;
            
            var modal = createModalBase('Setup Cloud Sync', 'Enter your credentials to enable secure cross-device syncing directly to your GitHub Gist.', content, buttons);
            
            var existingId = localStorage.getItem('gist_id');
            var existingToken = localStorage.getItem('github_token');
            if (existingId) document.getElementById('ms-gist-id').value = existingId;
            if (existingToken) document.getElementById('ms-gist-token').value = existingToken;

            document.getElementById('ms-sync-cancel').onclick = () => close(modal.overlay);
            document.getElementById('ms-sync-save').onclick = () => {
                var id = document.getElementById('ms-gist-id').value.trim();
                var token = document.getElementById('ms-gist-token').value.trim();
                if (id && token) {
                    close(modal.overlay);
                    onSave(id, token);
                }
            };
        },
        
        confirmReset: function(onConfirm) {
            var buttons = `
                <button class="ms-btn ms-btn-cancel" id="ms-reset-cancel">Cancel</button>
                <button class="ms-btn ms-btn-danger" id="ms-reset-confirm">Yes, Reset All</button>
            `;
            var modal = createModalBase('Reset Progress?', 'Are you sure you want to clear all checkboxes on this tracker? This action cannot be undone.', '', buttons);
            
            document.getElementById('ms-reset-cancel').onclick = () => close(modal.overlay);
            document.getElementById('ms-reset-confirm').onclick = () => {
                close(modal.overlay);
                onConfirm();
            };
        }
    };
})();
