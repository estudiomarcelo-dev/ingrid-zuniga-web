// ============================================
// DARK MODE
// ============================================

const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Verificar preferencia guardada
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// ============================================
// ANIMACIÓN DE CONTADORES
// ============================================

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Observador para activar contadores cuando se ven
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    observer.observe(heroStats);
}

// ============================================
// ANIMACIONES AL SCROLL
// ============================================

const fadeInElements = document.querySelectorAll('section');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(element => {
    scrollObserver.observe(element);
});

// ============================================
// TIMELINE INTERACTIVO
// ============================================

const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach(item => {
    item.addEventListener('click', () => {
        const details = item.querySelector('.timeline-details');
        if (details) {
            details.classList.toggle('active');
        }
    });

    // Permitir activación con teclado
    item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

// ============================================
// PARTÍCULAS DECORATIVAS EN HERO
// ============================================

const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Crear partículas
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Redimensionar canvas al cambiar ventana
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// SMOOTH SCROLL MEJORADO
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ACCESIBILIDAD - NAVEGACIÓN POR TECLADO
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Cerrar cualquier elemento expandido
        document.querySelectorAll('.timeline-details.active').forEach(detail => {
            detail.classList.remove('active');
        });
    }
});

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// ANALYTICS Y TRACKING (Opcional)
// ============================================

// Aquí puedes agregar Google Analytics o similar
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}
// gtag('js', new Date());
// gtag('config', 'GA_MEASUREMENT_ID');

console.log('✅ Sitio web de Ingrid Zúñiga cargado correctamente');
// ============================================
// MENÚ RESPONSIVE
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

}