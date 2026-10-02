// Fondo de estrellas: puntos finos que derivan despacio.
// Con "reducir movimiento" se dibujan una sola vez y quedan quietas.
(function starfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;
    let stars = [];
    let frame = null;
    let lastTime = 0;

    function makeStar() {
        const depth = Math.random();
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            r: 0.4 + depth * 1.1,
            speed: 2 + depth * 8, // px por segundo
            alpha: 0.25 + depth * 0.55,
            twinkle: Math.random() * Math.PI * 2,
            blue: Math.random() < 0.18
        };
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.round(Math.min(220, (width * height) / 7000));
        stars = Array.from({ length: count }, makeStar);
        draw(0);
    }

    function draw(dt) {
        ctx.clearRect(0, 0, width, height);
        for (const s of stars) {
            if (dt) {
                s.y -= s.speed * dt;
                s.twinkle += dt * 0.8;
                if (s.y < -4) {
                    s.y = height + 4;
                    s.x = Math.random() * width;
                }
            }
            const a = s.alpha * (0.75 + 0.25 * Math.sin(s.twinkle));
            ctx.fillStyle = s.blue ? `rgba(61, 174, 255, ${a})` : `rgba(237, 241, 247, ${a})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
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

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    reduceMotion.addEventListener('change', () => (reduceMotion.matches ? (stop(), draw(0)) : start()));

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
