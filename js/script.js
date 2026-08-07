/* ============================================
   SCRIPT.JS — Sitio web Ingrid Zúñiga Abanto
   Autor: Versión 2.0 Responsive
   ============================================ */
 
// ============================================
// 1. MENÚ HAMBURGUESA
// ============================================
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('navMenu');
const menuOverlay = document.getElementById('menuOverlay');
 
/* --- Abrir / cerrar con el botón --- */
hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
 
/* --- Cerrar al hacer click en un enlace --- */
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});
 
/* --- Cerrar al hacer click en el overlay --- */
menuOverlay.addEventListener('click', closeMenu);
 
/* --- Cerrar con tecla Escape --- */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});
 
/* --- Cerrar al redimensionar a desktop --- */
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
});
 
function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
 
// ============================================
// 2. NAVBAR: CLASE "SCROLLED" AL BAJAR
// ============================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});
 
// ============================================
// 3. DARK MODE
// ============================================
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme  = localStorage.getItem('theme');
 
/* Aplicar tema guardado o preferencia del sistema */
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
} else {
    darkModeToggle.textContent = '🌙';
}
 
darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
 
// ============================================
// 4. CONTADORES ANIMADOS (easeOutExpo)
// ============================================
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
 
function animateCounter(el, target, duration = 2000) {
    const start = Date.now();
    (function update() {
        const progress  = Math.min((Date.now() - start) / duration, 1);
        const eased     = easeOutExpo(progress);
        el.textContent  = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(update);
    })();
}
 
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            animateCounter(entry.target, +entry.target.dataset.target);
        }
    });
}, { threshold: 0.5 });
 
document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));
 
// ============================================
// 5. PARTÍCULAS EN CANVAS
// ============================================
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
 
function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
 
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.size    = Math.random() * 2 + 1;
        this.speedX  = (Math.random() - 0.5) * 0.6;
        this.speedY  = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width)  this.x = 0;
        if (this.x < 0)             this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0)             this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
 
function initParticles() {
    particles = [];
    const count = window.innerWidth > 768 ? 60 : 25;
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
 
function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.hypot(dx, dy);
            if (d < 120) {
                ctx.strokeStyle = `rgba(212,175,55,${0.15*(1-d/120)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}
 
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    if (window.innerWidth > 480) drawLines();
    requestAnimationFrame(animateParticles);
}
 
resizeCanvas();
initParticles();
animateParticles();
 
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});
 
// ============================================
// 6. TIMELINE INTERACTIVO (click para expandir)
// ============================================
document.querySelectorAll('.timeline-content').forEach(item => {
    item.addEventListener('click', () => {
        const details = item.querySelector('.timeline-details');
        if (!details) return;
        const isOpen = details.classList.toggle('active');
        item.setAttribute('aria-expanded', isOpen);
    });
    /* Accesibilidad: activar con Enter / Space */
    item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); item.click();
        }
    });
});
 
// ============================================
// 7. SCROLL SUAVE CON OFFSET DEL NAVBAR
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target    = document.querySelector(href);
        const navHeight = document.querySelector('.navbar').offsetHeight;
        if (target) {
            window.scrollTo({
                top: target.offsetTop - navHeight,
                behavior: 'smooth'
            });
        }
    });
});
 
// ============================================
// 8. BOTÓN VOLVER ARRIBA
// ============================================
const scrollToTop = document.getElementById('scrollToTop');
 
window.addEventListener('scroll', () => {
    scrollToTop.classList.toggle('show', window.scrollY > 300);
});
 
scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
 
// ============================================
// 9. LINK ACTIVO EN NAVBAR (según sección visible)
// ============================================
function updateActiveLink() {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    let current = '';
 
    document.querySelectorAll('section[id]').forEach(section => {
        if (window.scrollY >= section.offsetTop - navHeight - 50) {
            current = section.id;
        }
    });
 
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + current
        );
    });
}
 
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();
 
// ============================================
// 10. ANIMACIONES AL SCROLL (IntersectionObserver)
// ============================================
const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
 
document.querySelectorAll(
    '.highlight-card, .especialidad-card, .reconocimiento-card, .timeline-item'
).forEach(el => scrollObserver.observe(el));
 
// ============================================
// 11. LAZY LOADING DE IMÁGENES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                imageObs.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imageObs.observe(img));
}
 
// ============================================
// 12. LOG DE INICIALIZACIÓN
// ============================================
console.log('✅ Sitio Ingrid Zúñiga Abanto cargado correctamente');
console.log('✅ Menú hamburguesa activo');
console.log('✅ Dark mode disponible');
console.log('✅ Partículas y animaciones activas');
