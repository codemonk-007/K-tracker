(function() {
    // Only run on mobile
    if (window.innerWidth > 768) return;
    // Only on fresh app launch, not tab-to-tab navigation
    if (sessionStorage.getItem('splash-shown')) return;
    sessionStorage.setItem('splash-shown', '1');

    // Inject styles immediately (head is available)
    var style = document.createElement('style');
    style.textContent = `
        #ms-splash {
            position: fixed;
            inset: 0;
            background: #0c192c;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 22px;
            opacity: 1;
            transition: opacity 0.7s ease;
        }
        #ms-splash-logo-wrap {
            position: relative;
            width: 178px;
            height: 178px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #ms-splash-logo {
            width: 150px;
            height: 150px;
            border-radius: 28px;
            object-fit: cover;
            position: relative;
            z-index: 2;
            opacity: 0;
            transform: scale(0.6);
            transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #ms-splash-logo.show { opacity: 1; transform: scale(1); }
        #ms-splash-ring-outer {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: rgba(180, 148, 76, 0.9);
            border-right-color: rgba(180, 148, 76, 0.3);
            opacity: 0;
            transition: opacity 0.4s ease;
            animation: ms-spin-cw 1.8s linear infinite;
        }
        #ms-splash-ring-inner {
            position: absolute;
            inset: 8px;
            border-radius: 50%;
            border: 1px dashed rgba(180, 148, 76, 0.4);
            opacity: 0;
            transition: opacity 0.4s ease;
            animation: ms-spin-ccw 2.8s linear infinite;
        }
        #ms-splash-ring-outer.show,
        #ms-splash-ring-inner.show { opacity: 1; }
        @keyframes ms-spin-cw  { to { transform: rotate(360deg); } }
        @keyframes ms-spin-ccw { to { transform: rotate(-360deg); } }
        #ms-splash-title {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 20px;
            font-weight: 400;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #c9a84c;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        #ms-splash-title.show { opacity: 1; transform: translateY(0); }
        #ms-splash-status {
            font-family: -apple-system, sans-serif;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #3a5070;
            opacity: 0;
            transition: opacity 0.5s ease 0.2s;
        }
        #ms-splash-status.show { opacity: 1; }
    `;
    document.head.appendChild(style);

    // Build splash DOM once body is ready
    document.addEventListener('DOMContentLoaded', function() {
        var splash = document.createElement('div');
        splash.id = 'ms-splash';

        var logoWrap = document.createElement('div');
        logoWrap.id = 'ms-splash-logo-wrap';

        var ringOuter = document.createElement('div');
        ringOuter.id = 'ms-splash-ring-outer';

        var ringInner = document.createElement('div');
        ringInner.id = 'ms-splash-ring-inner';

        var logo = document.createElement('img');
        logo.id = 'ms-splash-logo';
        logo.src = 'icon-192.png';
        logo.alt = 'MS';

        logoWrap.appendChild(ringOuter);
        logoWrap.appendChild(ringInner);
        logoWrap.appendChild(logo);

        var title = document.createElement('div');
        title.id = 'ms-splash-title';
        title.textContent = 'Master Scope';

        var status = document.createElement('div');
        status.id = 'ms-splash-status';
        status.textContent = 'Syncing your progress...';

        splash.appendChild(logoWrap);
        splash.appendChild(title);
        splash.appendChild(status);
        document.body.prepend(splash);

        var splashStart = Date.now();
        var MIN_DISPLAY = 1800;

        // Trigger animations
        requestAnimationFrame(function() {
            setTimeout(function() {
                logo.classList.add('show');
                ringOuter.classList.add('show');
                ringInner.classList.add('show');
            }, 200);
            setTimeout(function() {
                title.classList.add('show');
                status.classList.add('show');
            }, 700);
        });

        function dismiss() {
            status.textContent = 'Ready ✓';
            var elapsed = Date.now() - splashStart;
            var wait = Math.max(0, MIN_DISPLAY - elapsed);
            setTimeout(function() {
                splash.style.opacity = '0';
                splash.style.pointerEvents = 'none';
                setTimeout(function() {
                    if (splash.parentNode) splash.parentNode.removeChild(splash);
                }, 700);
            }, wait);
        }

        // Poll for GistSync then preload
        function waitAndPreload() {
            if (typeof GistSync === 'undefined') {
                setTimeout(waitAndPreload, 50);
                return;
            }
            GistSync.init().then(dismiss).catch(dismiss);
        }
        waitAndPreload();
    });
})();
