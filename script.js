const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let mouseX = -1000;
let mouseY = -1000;
let isMouseActive = false;

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    stars = [];
    const numStars = window.innerWidth < 768 ? 80 : 150; // Menos cantidad para que se distingan bien
    
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

// Función para dibujar una estrella real de N puntas
function drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

class Star {
    constructor() {
        this.reset(true);
    }
    
    reset(randomizePosition = false) {
        this.x = randomizePosition ? Math.random() * width : Math.random() * width;
        this.y = randomizePosition ? Math.random() * height : height + 20;
        
        // Estrellas de 4 puntas (estilo destello futurista)
        this.spikes = 4;
        this.outerRadius = Math.random() * 3 + 2.5; // Tamaño más notable
        this.innerRadius = this.outerRadius / 3;
        
        // Velocidad base más lenta para que no parezca que nadan
        this.baseSpeedX = (Math.random() - 0.5) * 0.4;
        this.baseSpeedY = -(Math.random() * 0.5 + 0.3);
        
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        
        this.alpha = Math.random() * 0.6 + 0.2;
        this.pulse = Math.random() * 0.02 + 0.01;
        
        // Color aleatorio: Rojo o Azul neón
        if (Math.random() > 0.5) {
            this.colorRGB = '255, 26, 26';
            this.shadowColor = '#ff1a1a';
        } else {
            this.colorRGB = '26, 140, 255';
            this.shadowColor = '#1a8cff';
        }
    }
    
    update() {
        // Atracción hacia el mouse
        if (isMouseActive) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Si el mouse está cerca (radio de 250px), son atraídas sutilmente
            if (distance < 250) {
                const force = (250 - distance) / 250;
                this.speedX += (dx / distance) * force * 0.15;
                this.speedY += (dy / distance) * force * 0.15;
            }
        } else {
            // Si el mouse no está, vuelven suavemente a su rumbo original
            this.speedX += (this.baseSpeedX - this.speedX) * 0.02;
            this.speedY += (this.baseSpeedY - this.speedY) * 0.02;
        }

        // Fricción para que no aceleren infinitamente
        this.speedX *= 0.95;
        this.speedY *= 0.95;
        
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Efecto de titileo (pulse)
        this.alpha += this.pulse;
        if (this.alpha > 0.9 || this.alpha < 0.2) {
            this.pulse *= -1;
        }
        
        // Reaparecer cuando salen de la pantalla
        if (this.y < -30 || this.y > height + 30 || this.x < -30 || this.x > width + 30) {
            this.reset(false);
            if (Math.random() > 0.5) {
                this.x = Math.random() > 0.5 ? -20 : width + 20;
                this.y = Math.random() * height;
            } else {
                this.x = Math.random() * width;
                this.y = Math.random() > 0.5 ? -20 : height + 20;
            }
        }
    }
    
    draw() {
        drawStarShape(ctx, this.x, this.y, this.spikes, this.outerRadius, this.innerRadius);
        
        ctx.fillStyle = `rgba(${this.colorRGB}, ${this.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.shadowColor;
        ctx.fill();
        
        ctx.shadowBlur = 0; // Reset
    }
}

function animate() {
    // Limpiamos todo el canvas SIN DEJAR RASTRO
    // Esto elimina el efecto de "cola" para que no parezcan espermatozoides
    ctx.clearRect(0, 0, width, height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

// Eventos de Mouse
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
});

window.addEventListener('mouseout', () => {
    isMouseActive = false;
});

window.addEventListener('resize', init);

// Iniciar
init();
animate();

// Menú Hamburguesa
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}
