// Fondo de partículas: líneas de luz que suben, caracteres que caen despacio
// y se unen entre sí, y se conectan con el cursor cuando está cerca.
// Con "reducir movimiento" se dibuja un solo cuadro y queda quieto.
(function particleField() {
    const canvas = document.getElementById('particle-field');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*'.split('');
    const ACCENT = '61, 174, 255'; // --primary
    const NEUTRAL = '163, 174, 189'; // --ink-muted
    const LINK = 120; // distancia máxima entre caracteres unidos
    const REACH = 180; // radio de alcance del cursor

    let width = 0;
    let height = 0;
    let nodes = [];
    let beams = [];
    let frame = null;
    let lastTime = 0;
    const mouse = { x: -9999, y: -9999 };

    const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    function makeBeam(anywhere) {
        const length = 50 + Math.random() * 100;
        return {
            x: Math.random() * width,
            y: anywhere ? Math.random() * height : height + length,
            length,
            speed: 180 + Math.random() * 360, // px por segundo
            opacity: 0.18 + Math.random() * 0.3
        };
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const area = width * height;
        const nodeCount = Math.round(Math.min(140, Math.max(30, area / 10400)));
        const beamCount = Math.round(Math.min(36, Math.max(8, area / 37000)));
        nodes = Array.from({ length: nodeCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vy: 6 + Math.random() * 24, // px por segundo
            char: randomChar()
        }));
        beams = Array.from({ length: beamCount }, () => makeBeam(true));
        draw(0);
    }

    function draw(dt) {
        ctx.clearRect(0, 0, width, height);

        // Líneas de luz que suben
        ctx.lineWidth = 1.5;
        for (const b of beams) {
            if (dt) {
                b.y -= b.speed * dt;
                if (b.y + b.length < 0) Object.assign(b, makeBeam(false));
            }
            const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.length);
            g.addColorStop(0, `rgba(${ACCENT}, ${b.opacity})`);
            g.addColorStop(1, `rgba(${ACCENT}, 0)`);
            ctx.strokeStyle = g;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x, b.y + b.length);
            ctx.stroke();
        }

        // Caracteres que caen
        if (dt) {
            for (const n of nodes) {
                n.y += n.vy * dt;
                if (n.y > height + 20) {
                    n.y = -20;
                    n.x = Math.random() * width;
                }
            }
        }

        // Uniones entre caracteres cercanos
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
                const d = Math.hypot(dx, dy);
                if (d < LINK) {
                    ctx.strokeStyle = `rgba(${NEUTRAL}, ${0.12 * (1 - d / LINK)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        ctx.font = "12px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const n of nodes) {
            const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
            const near = dist < REACH;
            if (dt && (near || Math.random() < dt * 1.2)) n.char = randomChar();

            if (near) {
                ctx.strokeStyle = `rgba(${ACCENT}, ${0.45 * (1 - dist / REACH)})`;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
            ctx.fillStyle = near ? `rgb(${ACCENT})` : `rgba(${NEUTRAL}, 0.3)`;
            ctx.fillText(n.char, n.x, n.y);
        }
    }

    function loop(time) {
        const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
        lastTime = time;
        draw(dt);
        frame = requestAnimationFrame(loop);
    }

    function start() {
        if (frame || reduceMotion.matches || document.hidden) return;
        lastTime = 0;
        frame = requestAnimationFrame(loop);
    }

    function stop() {
        if (frame) cancelAnimationFrame(frame);
        frame = null;
    }

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseout', (e) => {
        if (e.relatedTarget) return;
        mouse.x = -9999;
        mouse.y = -9999;
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    reduceMotion.addEventListener('change', () => (reduceMotion.matches ? (stop(), draw(0)) : start()));

    // La fuente monoespaciada puede llegar después del primer cuadro
    if (document.fonts) document.fonts.ready.then(() => draw(0));

    resize();
    start();
})();

// Header: fondo sólido al hacer scroll
const header = document.getElementById('site-header');

function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Menú móvil
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');

function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
    }
});

window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
});

// Sección activa en la navegación
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                const active = link.getAttribute('href') === `#${entry.target.id}`;
                if (active) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        });
    },
    { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((section) => observer.observe(section));

// Copiar el mail
const copyBtn = document.querySelector('[data-copy]');
const copyStatus = document.getElementById('copy-status');

if (copyBtn) {
    const label = copyBtn.querySelector('.copy-label');
    let resetTimer;

    copyBtn.addEventListener('click', async () => {
        const text = copyBtn.dataset.copy;
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.classList.add('is-copied');
            label.textContent = 'Copiado';
            copyStatus.textContent = 'Mail copiado al portapapeles';
        } catch {
            label.textContent = 'No se pudo copiar';
            copyStatus.textContent = 'No se pudo copiar. Seleccioná el mail y copialo a mano.';
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            copyBtn.classList.remove('is-copied');
            label.textContent = 'Copiar';
            copyStatus.textContent = '';
        }, 2400);
    });
}

// Carrusel de proyectos del hero
(function showcase() {
    const root = document.querySelector('.showcase');
    if (!root) return;

    const slides = [...root.querySelectorAll('.slide')];
    const dots = [...root.querySelectorAll('.showcase-dot')];
    const toggleBtn = root.querySelector('.showcase-toggle');
    const nameLink = root.querySelector('.showcase-name');
    const title = root.querySelector('.showcase-title');
    const url = root.querySelector('.showcase-url');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const DURATION = 5000;

    let index = 0;
    let timer = null;
    let startedAt = 0;
    let remaining = DURATION;
    let stopped = reduceMotion.matches; // pausa elegida por la persona
    const holds = new Set(); // pausas temporales: hover, foco, fuera de pantalla, pestaña oculta

    root.style.setProperty('--slide-ms', `${DURATION}ms`);

    function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const active = i === index;
            slide.classList.toggle('is-active', active);
            if (active) slide.removeAttribute('aria-hidden');
            else slide.setAttribute('aria-hidden', 'true');
        });
        dots.forEach((dot, i) => {
            if (i === index) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        const current = slides[index];
        title.textContent = current.dataset.name;
        url.textContent = current.dataset.url;
        nameLink.setAttribute('href', current.dataset.href);
        restartProgress();
    }

    // Reinicia la animación de la barrita del punto activo
    function restartProgress() {
        root.classList.remove('is-playing');
        void root.offsetWidth;
        if (!stopped) root.classList.add('is-playing');
        remaining = DURATION;
        schedule();
    }

    function schedule() {
        clearTimeout(timer);
        timer = null;
        if (stopped || holds.size) return;
        startedAt = performance.now();
        timer = setTimeout(() => show(index + 1), remaining);
    }

    function hold(reason) {
        if (holds.has(reason)) return;
        holds.add(reason);
        if (timer) {
            clearTimeout(timer);
            timer = null;
            remaining = Math.max(0, remaining - (performance.now() - startedAt));
        }
        root.classList.add('is-held');
    }

    function release(reason) {
        if (!holds.delete(reason)) return;
        if (holds.size) return;
        root.classList.remove('is-held');
        schedule();
    }

    function setStopped(value) {
        stopped = value;
        root.classList.toggle('is-stopped', stopped);
        toggleBtn.setAttribute('aria-label', stopped ? 'Reanudar el carrusel' : 'Pausar el carrusel');
        restartProgress();
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => show(Number(dot.dataset.index)));
    });

    toggleBtn.addEventListener('click', () => setStopped(!stopped));

    root.addEventListener('mouseenter', () => hold('hover'));
    root.addEventListener('mouseleave', () => release('hover'));
    root.addEventListener('focusin', () => hold('focus'));
    root.addEventListener('focusout', (e) => {
        if (!root.contains(e.relatedTarget)) release('focus');
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) hold('hidden');
        else release('hidden');
    });

    new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) release('offscreen');
        else hold('offscreen');
    }, { threshold: 0.25 }).observe(root);

    reduceMotion.addEventListener('change', () => setStopped(reduceMotion.matches));

    setStopped(stopped);
})();
