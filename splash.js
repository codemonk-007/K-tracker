(function() {
    if (window.innerWidth > 768) return;
    if (sessionStorage.getItem('splash-shown')) return;
    sessionStorage.setItem('splash-shown', '1');

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
            opacity: 1;
            transition: opacity 0.7s ease;
        }
        #ms-splash-center {
            position: relative;
            width: 2px;
            height: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -60px;
        }
        #ms-splash-logo {
            position: absolute;
            top: 50%; left: 50%;
            margin-top: -100px;
            margin-left: -100px;
            width: 200px;
            height: 200px;
            object-fit: contain;
            filter: grayscale(100%) contrast(300%) brightness(80%);
            mix-blend-mode: screen;
            z-index: 10;
            opacity: 0;
            transform: scale(0.6);
            transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #ms-splash-logo.show { opacity: 1; transform: scale(1); }
        
        .ms-ring-layer {
            position: absolute;
            top: 50%; left: 50%;
            border-radius: 50%;
            border: 1px dashed rgba(255, 255, 255, 0.2);
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: 5;
        }
        .ms-ring-layer.show { opacity: 1; }
        
        .ms-icon-node {
            position: absolute;
            top: 50%; left: 50%;
            width: 24px; height: 24px;
            margin-left: -12px; margin-top: -12px;
            /* rotate outward by angle, then push out by radius */
            transform: rotate(var(--angle)) translateY(var(--radius));
        }
        .ms-icon-counter {
            width: 100%; height: 100%;
            /* statically counter the initial outward rotation so it starts upright */
            transform: rotate(calc(-1 * var(--angle)));
        }
        .ms-icon-svg {
            width: 100%; height: 100%;
            color: rgba(255, 255, 255, 0.9);
            /* dynamically counter the ring's rotation */
            animation: var(--anim-ccw) linear infinite;
        }
        
        @keyframes ms-spin-cw  { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes ms-spin-ccw { to { transform: translate(-50%, -50%) rotate(-360deg); } }
        
        @keyframes ms-counter-cw  { to { transform: rotate(360deg); } }
        @keyframes ms-counter-ccw { to { transform: rotate(-360deg); } }
        
        #ms-splash-title {
            position: absolute;
            bottom: 45px;
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 22px;
            font-weight: 400;
            letter-spacing: 6px;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.95);
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        #ms-splash-title.show { opacity: 1; transform: translateY(0); }
        
        #ms-splash-status {
            position: absolute;
            bottom: 110px;
            font-family: -apple-system, sans-serif;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.5);
            opacity: 0;
            transition: opacity 0.5s ease 0.2s;
        }
        #ms-splash-status.show { opacity: 1; }
    `;
    document.head.appendChild(style);

    const ringsConfig = [
        { 
            radius: 105, duration: '12s', dir: 'cw', offset: 0, 
            icons: [
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>',
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
            ]
        },
        { 
            radius: 145, duration: '16s', dir: 'ccw', offset: 45, 
            icons: [
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>',
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>'
            ]
        },
        { 
            radius: 185, duration: '20s', dir: 'cw', offset: 90, 
            icons: [
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14v7"></path></svg>'
            ]
        }
    ];

    document.addEventListener('DOMContentLoaded', function() {
        var splash = document.createElement('div');
        splash.id = 'ms-splash';

        var centerWrap = document.createElement('div');
        centerWrap.id = 'ms-splash-center';

        var allRings = [];
        
        ringsConfig.forEach(function(rc) {
            var ring = document.createElement('div');
            ring.className = 'ms-ring-layer';
            // Size is diameter
            var size = rc.radius * 2;
            ring.style.width = size + 'px';
            ring.style.height = size + 'px';
            
            var spinAnim = rc.dir === 'cw' ? 'ms-spin-cw' : 'ms-spin-ccw';
            var counterAnim = rc.dir === 'cw' ? 'ms-counter-ccw' : 'ms-counter-cw';
            
            ring.style.transform = 'translate(-50%, -50%)';
            ring.style.animation = spinAnim + ' ' + rc.duration + ' linear infinite';
            
            rc.icons.forEach(function(svgStr, i) {
                var angle = rc.offset + (i * 120); // 3 icons = 120deg apart
                
                var node = document.createElement('div');
                node.className = 'ms-icon-node';
                node.style.setProperty('--angle', angle + 'deg');
                node.style.setProperty('--radius', '-' + rc.radius + 'px');
                
                var counter = document.createElement('div');
                counter.className = 'ms-icon-counter';
                
                var svgWrap = document.createElement('div');
                svgWrap.className = 'ms-icon-svg';
                svgWrap.style.setProperty('--anim-ccw', counterAnim + ' ' + rc.duration);
                svgWrap.innerHTML = svgStr;
                
                counter.appendChild(svgWrap);
                node.appendChild(counter);
                ring.appendChild(node);
            });
            
            centerWrap.appendChild(ring);
            allRings.push(ring);
        });

        var logo = document.createElement('img');
        logo.id = 'ms-splash-logo';
        logo.src = 'ms-monogram.png';
        logo.alt = 'MS';
        centerWrap.appendChild(logo);

        var title = document.createElement('div');
        title.id = 'ms-splash-title';
        title.textContent = 'Master Scope';

        var status = document.createElement('div');
        status.id = 'ms-splash-status';
        status.textContent = 'Syncing your progress...';

        splash.appendChild(centerWrap);
        splash.appendChild(title);
        splash.appendChild(status);
        document.body.prepend(splash);

        var splashStart = Date.now();
        var MIN_DISPLAY = 3500; // Increased to 3.5 seconds minimum

        requestAnimationFrame(function() {
            setTimeout(function() {
                logo.classList.add('show');
                allRings.forEach(function(r) { r.classList.add('show'); });
            }, 200);
            setTimeout(function() {
                title.classList.add('show');
                status.classList.add('show');
            }, 700);
        });

        function dismiss() {
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
