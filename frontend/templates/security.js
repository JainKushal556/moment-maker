// Security Layer for Templates
// This script ensures the template is only run inside an authorized iframe and prevents direct/cross-origin access.

(function () {
    // 1. Allow local development to bypass strict locks
    const isDev = import.meta.env.DEV;
    if (isDev) return;

    const ALLOWED_DOMAINS = [
        'momentcrafter-studio.web.app',
        'testcraft-fe2cc.web.app',
        'localhost',
        '127.0.0.1'
    ];

    const showAccessDenied = () => {
        document.documentElement.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#050508;color:white;font-family:system-ui, sans-serif;text-align:center;padding:20px;">
                <div>
                    <svg style="margin: 0 auto 20px; width: 64px; height: 64px; color: #f472b6;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h1 style="color:#f472b6;margin-bottom:10px;font-size:24px;font-weight:bold;">Access Denied</h1>
                    <p style="color:#a1a1aa;font-size:14px;max-width:300px;margin:0 auto;line-height:1.5;">This template is protected and can only be viewed through the official Moment Crafter platform.</p>
                </div>
            </div>
        `;
        throw new Error("Security Exception: Unauthorized access attempt blocked.");
    };

    // 2. Iframe Enforcement: Block direct URL access
    const isIframe = window.self !== window.top;
    if (!isIframe) {
        showAccessDenied();
    }

    // 3. Domain Locking: Prevent cross-origin embedding
    try {
        // If a thief embeds this iframe on their domain, accessing window.top.location throws a cross-origin DOMException.
        const parentHostname = window.top.location.hostname;
        if (!ALLOWED_DOMAINS.includes(parentHostname)) {
            showAccessDenied();
        }
    } catch (e) {
        // Cross-origin access blocked = thief's website
        showAccessDenied();
    }

    // 4. Debug & Inspect Protection
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))
        ) {
            e.preventDefault();
        }
    });

    // 5. Console Protection
    setInterval(() => {
        console.clear();
        console.log("%cProtected Asset", "color: #f472b6; font-size: 40px; font-weight: bold; text-shadow: 2px 2px 0 #000;");
        console.log("%cUnauthorized usage, copying, or reverse engineering is strictly prohibited.", "color: #fff; font-size: 14px;");
    }, 1500);
})();
