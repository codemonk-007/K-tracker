(function() {
    // Only run on mobile PWA (standalone mode)
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    var isMobile = window.innerWidth <= 768;
    if (!isStandalone || !isMobile) return;

    // Only show on fresh app launch, not on in-session page jumps
    if (sessionStorage.getItem('splash-shown')) return;
    sessionStorage.setItem('splash-shown', '1');

    // Inject styles
    var style = document.createElement('style');
    style.textContent = `
        #ms-splash {
            position: fixed;
            inset: 0;
            background: #0f172a;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            transition: opacity 0.7s ease;
        }
        #ms-splash-logo {
            width: 88px;
            height: 88px;
            background: linear-gradient(135deg, #1e293b, #334155);
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 42px;
            font-weight: 700;
            color: #f1f5f9;
            font-family: 'Inter', -apple-system, sans-serif;
            box-shadow: 0 0 0 0 rgba(99,102,241,0.4);
            opacity: 0;
            transform: scale(0.6);
            transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #ms-splash-logo.show {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 40px rgba(99,102,241,0.25);
        }
        #ms-splash-title {
            font-family: 'Inter', -apple-system, sans-serif;
            font-size: 15px;
            font-weight: 300;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #94a3b8;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
        }
        #ms-splash-title.show {
            opacity: 1;
            transform: translateY(0);
        }
        #ms-splash-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #6366f1;
            opacity: 0;
            transition: opacity 0.4s ease;
            margin-top: 8px;
            animation: pulse-dot 1.2s ease-in-out infinite;
        }
        #ms-splash-dot.show { opacity: 1; }
        @keyframes pulse-dot {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.6); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Build DOM
    var splash = document.createElement('div');
    splash.id = 'ms-splash';

    var logo = document.createElement('div');
    logo.id = 'ms-splash-logo';
    logo.textContent = 'M';

    var title = document.createElement('div');
    title.id = 'ms-splash-title';
    title.textContent = 'Master Scope';

    var dot = document.createElement('div');
    dot.id = 'ms-splash-dot';

    splash.appendChild(logo);
    splash.appendChild(title);
    splash.appendChild(dot);
    document.body.prepend(splash);

    // Animation timeline — total 3 seconds
    // 300ms  → logo scales in
    // 800ms  → title + dot fades up
    // 2300ms → start fade out
    // 3000ms → remove from DOM

    setTimeout(function() { logo.classList.add('show'); }, 300);
    setTimeout(function() {
        title.classList.add('show');
        dot.classList.add('show');
    }, 800);
    setTimeout(function() {
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
    }, 2300);
    setTimeout(function() {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, 3000);
})();
