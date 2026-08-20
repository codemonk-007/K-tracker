(function() {
    // Only run on mobile
    var isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    // Only show on fresh app launch, not on in-session page jumps
    if (sessionStorage.getItem('splash-shown')) return;
    sessionStorage.setItem('splash-shown', '1');

    // Inject styles
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
            transition: opacity 0.7s ease;
        }
        #ms-splash-logo-wrap {
            position: relative;
            width: 160px;
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #ms-splash-logo {
            width: 150px;
            height: 150px;
            border-radius: 28px;
            opacity: 0;
            transform: scale(0.6);
            transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
            object-fit: cover;
            position: relative;
            z-index: 2;
        }
        #ms-splash-logo.show {
            opacity: 1;
            transform: scale(1);
        }
        /* Outer ring - spins clockwise */
        #ms-splash-ring-outer {
            position: absolute;
            inset: -14px;
            border-radius: 50%;
            border: 1.5px solid transparent;
            border-top-color: rgba(180, 148, 76, 0.8);
            border-right-color: rgba(180, 148, 76, 0.4);
            border-bottom-color: rgba(180, 148, 76, 0.1);
            opacity: 0;
            transition: opacity 0.4s ease;
            animation: ms-spin-cw 2s linear infinite;
        }
        /* Inner ring - spins counter-clockwise */
        #ms-splash-ring-inner {
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 1px dashed rgba(180, 148, 76, 0.35);
            opacity: 0;
            transition: opacity 0.4s ease;
            animation: ms-spin-ccw 3s linear infinite;
        }
        #ms-splash-ring-outer.show,
        #ms-splash-ring-inner.show { opacity: 1; }
        @keyframes ms-spin-cw  { to { transform: rotate(360deg); } }
        @keyframes ms-spin-ccw { to { transform: rotate(-360deg); } }

        #ms-splash-title {
            font-family: 'Georgia', serif;
            font-size: 20px;
            font-weight: 400;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #c9a84c;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        #ms-splash-title.show {
            opacity: 1;
            transform: translateY(0);
        }
        #ms-splash-status {
            font-family: -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #4a6080;
            opacity: 0;
            transition: opacity 0.5s ease 0.2s;
        }
        #ms-splash-status.show { opacity: 1; }
    `;
    document.head.appendChild(style);

    // Build DOM
    var splash = document.createElement('div');
    splash.id = 'ms-splash';

    var logoWrap = document.createElement('div');
    logoWrap.id = 'ms-splash-logo-wrap';

    var logo = document.createElement('img');
    logo.id = 'ms-splash-logo';
    logo.src = 'icon-192.png';
    logo.alt = 'Master Scope';

    var ringOuter = document.createElement('div');
    ringOuter.id = 'ms-splash-ring-outer';

    var ringInner = document.createElement('div');
    ringInner.id = 'ms-splash-ring-inner';

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

    // Trigger entry animations
    setTimeout(function() {
        logo.classList.add('show');
        ringOuter.classList.add('show');
        ringInner.classList.add('show');
    }, 300);
    setTimeout(function() {
        title.classList.add('show');
        status.classList.add('show');
    }, 800);

    // Wait for GistSync to be available, then preload all data, then dismiss
    var splashStart = Date.now();
    var MIN_DISPLAY = 2000; // minimum ms to show splash even if data loads fast

    function waitAndPreload() {
        if (typeof GistSync === 'undefined') {
            setTimeout(waitAndPreload, 50);
            return;
        }
        GistSync.init().then(function() {
            status.textContent = 'Ready';
            var elapsed = Date.now() - splashStart;
            var remaining = Math.max(0, MIN_DISPLAY - elapsed);
            setTimeout(function() {
                splash.style.opacity = '0';
                splash.style.pointerEvents = 'none';
                setTimeout(function() {
                    if (splash.parentNode) splash.parentNode.removeChild(splash);
                }, 700);
            }, remaining);
        }).catch(function() {
            // If sync fails, dismiss after minimum time anyway
            var elapsed = Date.now() - splashStart;
            var remaining = Math.max(0, MIN_DISPLAY - elapsed);
            setTimeout(function() {
                splash.style.opacity = '0';
                splash.style.pointerEvents = 'none';
                setTimeout(function() {
                    if (splash.parentNode) splash.parentNode.removeChild(splash);
                }, 700);
            }, remaining);
        });
    }

    waitAndPreload();
})();
