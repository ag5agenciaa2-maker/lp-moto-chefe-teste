/**
 * Motochefe Campo Grande - Links 360
 * Script principal de interatividade
 */

// ============================================
// FUNÇÃO: Ocultar/mostrar botões fixos ao rolar
// ============================================
(function () {
    let lastScrollY = 0;
    const SCROLL_THRESHOLD = 80;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const btns = document.querySelectorAll('.theme-toggle');

        if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
            btns.forEach(btn => btn.classList.add('hidden-btn'));
        } else {
            btns.forEach(btn => btn.classList.remove('hidden-btn'));
        }
        lastScrollY = currentScrollY;
    }, { passive: true });
})();


// ============================================
// CONFIGURAÇÃO GLOBAL
// ============================================
const CONFIG = window.Link360Config || {
    projectName: "motochefe-campo-grande",
    themeKey: "motochefe-theme",
    defaultDark: false,
    greetingText: "Bem-vindo à Motochefe",
    accentColor: "#C9A227"
};

// ============================================
// FUNÇÃO: Download vCard
// ============================================
function downloadVCard() {
    const vcardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${CONFIG.vcard?.fn || 'Motochefe Campo Grande'}`,
        `N:${CONFIG.vcard?.n || 'Motochefe Campo Grande;;;'}`,
        `ORG:${CONFIG.vcard?.org || 'Motochefe'}`,
        `TITLE:${CONFIG.vcard?.title || 'Veículos Elétricos'}`,
        `TEL;TYPE=CELL:${CONFIG.vcard?.tel || '+5521977342290'}`,
        `TEL;TYPE=WORK:${CONFIG.vcard?.telWork || '21977342290'}`,
        `URL:${CONFIG.vcard?.url || 'https://campogrande.motochefe.com.br/'}`,
        `ADR;TYPE=WORK:;;${CONFIG.vcard?.adr || 'Estrada do Cachamorra, 133;Campo Grande;RJ;23000-000;Brasil'}`,
        'END:VCARD'
    ].join('\n');

    const blob = new Blob([vcardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${CONFIG.vcard?.filename || 'Motochefe_Campo_Grande'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ============================================
// FUNÇÃO: Modal System
// ============================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animação de entrada
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.animation = 'none';
            setTimeout(() => {
                content.style.animation = 'modalIn 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            }, 10);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function openImageModal(src) {
    const modal = document.getElementById('modal-image');
    const img = document.getElementById('popup-img');
    if (modal && img) {
        img.src = src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// ============================================
// FUNÇÃO: Dynamic Greeting
// ============================================
function updateGreeting() {
    const greetings = document.querySelectorAll('.dynamic-greeting');
    const hour = new Date().getHours();
    let greeting = CONFIG.greetingText || 'Seja Bem-Vindo';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Bom Dia';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Boa Tarde';
    } else {
        greeting = 'Boa Noite';
    }
    
    greetings.forEach(el => {
        el.textContent = `${greeting} | Volte Sempre`;
    });
}


// ============================================
// FUNÇÃO: Theme Toggle
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle-custom');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggle) {
        console.log('Theme toggle button not found');
        return;
    }
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem(CONFIG.themeKey);
    
    // Aplicar tema inicial (padrão é light para Motochefe)
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-xs';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-sm';
    }
    
    // Toggle click handler
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation(); // Evita que outros scripts (como o core.js) disparem simultaneamente
        e.stopPropagation();
        
        const isDark = document.body.classList.contains('dark-mode');
        
        if (isDark) {
            // Switch to light
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem(CONFIG.themeKey, 'light');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-sm';
            console.log('Switched to light mode');
        } else {
            // Switch to dark
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem(CONFIG.themeKey, 'dark');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-xs';
            console.log('Switched to dark mode');
        }
    });
}



// ============================================
// FUNÇÃO: Scroll Reveal Animation
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
}

// ============================================
// FUNÇÃO: Gallery Carousel
// ============================================
function initGalleryCarousel() {
    const carousel = document.getElementById('galleryCarousel');
    const dots = document.querySelectorAll('#galleryDots button');
    
    if (!carousel) return;
    
    let isHovering = false;
    let autoPlayInterval;
    
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isHovering) return;
            
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            const itemWidth = carousel.querySelector('div')?.offsetWidth || 300;
            const currentScroll = carousel.scrollLeft;
            
            if (currentScroll >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: itemWidth + 16, behavior: 'smooth' });
            }
        }, 2500); // Roda a cada 2.5s
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }
    
    // Pausar auto-play em interação
    carousel.addEventListener('mouseenter', () => isHovering = true);
    carousel.addEventListener('mouseleave', () => {
        isHovering = false;
        startAutoPlay();
    });
    carousel.addEventListener('touchstart', () => {
        isHovering = true;
        stopAutoPlay();
    }, {passive:true});
    carousel.addEventListener('touchend', () => {
        isHovering = false;
        startAutoPlay();
    }, {passive:true});

    // Iniciar só quando estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        });
    }, { threshold: 0.1 });
    observer.observe(carousel);
    
    // Atualizar dots ao scroll
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = carousel.querySelector('div')?.offsetWidth || 300;
        const activeIndex = Math.round(scrollLeft / (itemWidth + 16));
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active-dot');
                dot.classList.remove('bg-white/20');
                dot.classList.remove('bg-brand-dark/20', 'dark:bg-white/20');
                dot.classList.add('bg-brand-main');
            } else {
                dot.classList.remove('active-dot');
                dot.classList.remove('bg-brand-main');
                dot.classList.add('bg-brand-dark/20', 'dark:bg-white/20');
            }
        });
    });

    // Clicar nos dots para navegar
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const itemWidth = carousel.querySelector('div')?.offsetWidth || 300;
            carousel.scrollTo({ left: index * (itemWidth + 16), behavior: 'smooth' });
            startAutoPlay(); // Reseta intervalo
        });
    });
}

function scrollGallery(direction) {
    const carousel = document.getElementById('galleryCarousel');
    if (carousel) {
        const itemWidth = carousel.querySelector('div')?.offsetWidth || 300;
        carousel.scrollBy({
            left: direction * (itemWidth + 16),
            behavior: 'smooth'
        });
    }
}

// ============================================
// FUNÇÃO: Video Carousel
// ============================================
function initVideoCarousel() {
    const carousel = document.getElementById('videoCarousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.video-slide');
    const dots = document.querySelectorAll('.video-dot');
    const btnAtivarSom = document.getElementById('btnAtivarSom');
    let currentIndex = 0;
    let isPlaying = false;
    
    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
            
            if (index === currentIndex) {
                slide.classList.add('is-active');
                const video = slide.querySelector('video');
                if (video && isPlaying) {
                    video.play().catch(() => {});
                }
            } else if (index === currentIndex - 1 || (currentIndex === 0 && index === slides.length - 1)) {
                slide.classList.add('is-prev');
                const video = slide.querySelector('video');
                if (video) video.pause();
            } else if (index === currentIndex + 1 || (currentIndex === slides.length - 1 && index === 0)) {
                slide.classList.add('is-next');
                const video = slide.querySelector('video');
                if (video) video.pause();
            } else {
                slide.classList.add('is-hidden');
                const video = slide.querySelector('video');
                if (video) video.pause();
            }
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Click on dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlides();
        });
    });
    
    // Click on slides
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (index !== currentIndex) {
                currentIndex = index;
                updateSlides();
            }
        });
    });
    
    // Botão ativar som
    if (btnAtivarSom) {
        btnAtivarSom.addEventListener('click', () => {
            isPlaying = true;
            btnAtivarSom.style.display = 'none';
            updateSlides();
        });
    }
    
    // Inicializar
    updateSlides();
}

// ============================================
// FUNÇÃO: Image Comparison Slider
// ============================================
function initComparisonSlider() {
    const container = document.getElementById('comparison-container');
    const slider = document.getElementById('comparison-slider');
    
    if (!container || !slider) return;
    
    slider.addEventListener('input', (e) => {
        const value = e.target.value;
        container.style.setProperty('--exposure', `${value}%`);
    });
}

// ============================================
// FUNÇÃO: Close Modals on Backdrop Click
// ============================================
function initModalBackdrops() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    
    backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
}

// ============================================
// FUNÇÃO: Close Modals on Escape Key
// ============================================
function initEscapeKey() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-backdrop[style*="flex"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// FUNÇÃO: WhatsApp Message Bubble (Premium Logic)
// ============================================
function initWhatsappBubble() {
    const whatsappMessage = document.getElementById('whatsapp-message');
    const whatsappNotify = document.querySelector('.whatsapp-notify');
    const closeBubbleBtn = document.querySelector('.close-whatsapp-bubble');
    const whatsappLink = document.querySelector('.whatsapp-float');
    let messageShown = false;
    
    // Atualizar conteúdo do balão e link
    if (whatsappMessage) {
        const msgText = whatsappMessage.querySelector('p');
        if (msgText) msgText.textContent = "Olá! Gostaria de falar sobre veículos elétricos? Estou pronto para te ajudar!";
    }
    if (whatsappLink) {
        const waMsg = encodeURIComponent("Olá, vim através do link da bio e gostaria de falar sobre veículos elétricos.");
        whatsappLink.href = `https://wa.me/5521977342290?text=${waMsg}`;
    }
    
    // Gatilho: Seção de Diferenciais
    const triggerSection = document.getElementById('section-diferenciais'); 

    function showWhatsappBubble() {
        if (messageShown || !whatsappMessage) return;
        messageShown = true;

        whatsappMessage.classList.add('show');
        
        // Auto-esconder após 15 segundos
        setTimeout(() => {
            if (whatsappMessage.classList.contains('show')) {
                whatsappMessage.classList.remove('show');
                showNotification();
            }
        }, 15000);
    }

    function showNotification() {
        setTimeout(() => {
            if (whatsappNotify) whatsappNotify.classList.add('show');
        }, 5000);
    }

    // Gatilho por Tempo (10 segundos)
    setTimeout(showWhatsappBubble, 10000);

    if (triggerSection && whatsappMessage) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(showWhatsappBubble, 800);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(triggerSection);
    }

    if (closeBubbleBtn && whatsappMessage) {
        closeBubbleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (whatsappMessage.classList.contains('show')) {
                whatsappMessage.classList.remove('show');
                showNotification();
            }
        });
    }
}

// ============================================
// CATÁLOGO PREMIUM - GOOGLE SHEETS + FALLBACK
// ============================================

const GOOGLE_SHEETS_CSV_URL = '';

const CATALOG_FALLBACK_DATA = [
    { id: 1, nome: 'Giga', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Frente agressiva, farol e setas em LED e painel digital futurista. Escolha de quem quer sair do óbvio, chegar em silêncio e causar impacto.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/Giga_modelo.webp', link: 'https://motochefebrasil.com.br/modelos/giga', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 2, nome: 'JET MAX', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '55 km', descricao: 'Visual esportivo de scooter robusta com tecnologia e conforto. Motor 1000W com 55 km de autonomia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/JET-MAX-_-Oficial-2_b.webp', link: 'https://motochefebrasil.com.br/modelos/jet-max', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 3, nome: 'X12', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Scooter elétrica que redefine mobilidade urbana. Compacta, potente e tecnológica com 1000W e até 50 km de autonomia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/x12b.webp', link: 'https://motochefebrasil.com.br/modelos/x12/', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 4, nome: 'BOB', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Posição confortável, plataforma baixa, assento amplo com espaço para carona e encosto traseiro.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/bob_1.webp', link: 'https://motochefebrasil.com.br/modelos/bob', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 5, nome: 'JET', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Visual agressivo, zero burocracia: ligou, acelerou, chegou.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/JET_1-1.webp', link: 'https://motochefebrasil.com.br/modelos/jet', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 6, nome: 'Joyzinha', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '600 W', autonomia: '40 km', descricao: 'Design para o dia a dia, parceira ideal para trabalho, faculdade ou passeio na orla.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/5.webp', link: 'https://motochefebrasil.com.br/modelos/joyzinha', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 7, nome: 'Joy Classic', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '600 W', autonomia: '40 km', descricao: 'Estilo clássico, conforto de sobra e autonomia para o seu dia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/JOY-CLASSIC-_1-1.webp', link: 'https://motochefebrasil.com.br/modelos/joy-classic', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 8, nome: 'Joy Super', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '800 W', autonomia: '40 km', descricao: 'Visual agressivo, zero burocracia: ligou, acelerou, chegou.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/JOY-SUPER-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/joy-super', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 9, nome: 'MC20 Mini', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Farol FULL LED, freio a disco hidráulico, bateria removível turbo 5A, suporta até 180 kg.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/MC20-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/mc20-mini', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 10, nome: 'MC21 Mini', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Equilíbrio perfeito entre design minimalista e desempenho elétrico. Bateria de lítio removível.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/mc21_mini_tin.webp', link: 'https://motochefebrasil.com.br/modelos/mc21-mini', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 11, nome: 'Mia', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Não é necessária CNH para conduzir um equipamento autopropelido (Resolução nº 996/2023 do Contran).', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/MIA-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/mia', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 12, nome: 'Sofia', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Combina estilo clássico e tecnologia moderna. Motor 1000W, 32 km/h e autonomia de até 40 km.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/sofia_web3_tiny.webp', link: 'https://motochefebrasil.com.br/modelos/sofia', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 13, nome: 'Ret', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Visual agressivo, zero burocracia: ligou, acelerou, chegou.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/RET-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/ret', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 14, nome: 'Soma', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Sem CNH, sem emplacamento. Motor 1000W, bateria 60V 20Ah removível e 40 km de autonomia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/Soma-1-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/soma', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 15, nome: 'Mia Tri', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '800 W', autonomia: '40 km', descricao: 'Triciclo elétrico 800W para quem quer segurança, praticidade e estilo.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/MIA-TRI-01-1.webp', link: 'https://motochefebrasil.com.br/modelos/mia-tri', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 16, nome: 'Joy Tri', categoria: 'Autopropelidos', velocidade: '30 km/h', potencia: '600 W', autonomia: '40 km', descricao: 'Chassi robusto de três rodas com estabilidade e confiança para o dia a dia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/JOY-TRI-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/joy-tri', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 17, nome: 'BIG TRI', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Liberdade com segurança. Design retrô, conforto e tecnologia moderna em triciclo elétrico 1000W.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/big_tri.webp', link: 'https://motochefebrasil.com.br/modelos/big-tri/', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 18, nome: 'VED', categoria: 'Autopropelidos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Mobilidade elétrica acessível, segura e confortável. Motor 1000W e autonomia de até 40 km.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/ved_1-1.webp', link: 'https://motochefebrasil.com.br/modelos/ved', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 19, nome: 'X11', categoria: 'Ciclomotor', velocidade: '50 km/h', potencia: '2000 W', autonomia: '80 km', descricao: 'Design robusto e presença marcante com soluções modernas de mobilidade elétrica.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/x11__-1.webp', link: 'https://motochefebrasil.com.br/modelos/x11', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 20, nome: 'MC20', categoria: 'Ciclomotor', velocidade: '50 km/h', potencia: '2000 W', autonomia: '40 km', descricao: '2000W ou 3000W, NFC, alarme com bloqueio, painel digital e até 80 km com bateria extra. Visual chopper, IP65.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/mc20_pop-1.webp', link: 'https://motochefebrasil.com.br/modelos/mc20/', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 21, nome: 'X15', categoria: 'Ciclomotor', velocidade: '50 km/h', potencia: '3000 W', autonomia: '40 km', descricao: 'Triciclo elétrico potente e seguro com motor 3000W para aceleração firme e desempenho consistente.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/x15.webp', link: 'https://motochefebrasil.com.br/modelos/x15', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 22, nome: 'Roma', categoria: 'Ciclomotor', velocidade: '50 km/h', potencia: '3000 W', autonomia: '50 km', descricao: 'Charme retrô europeu com tecnologia elétrica moderna. 3000W, 50 km de autonomia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/roma_ai_sombra-1.webp', link: 'https://motochefebrasil.com.br/modelos/roma', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 23, nome: 'GRID', categoria: 'E-Bikes', velocidade: '32 km/h', potencia: '750 W', autonomia: '35 km', descricao: 'Ágil, robusta e divertida de pilotar.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/GRID-LATERAL1-1.webp', link: 'https://motochefebrasil.com.br/modelos/grid/', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 24, nome: 'Style', categoria: 'E-Bikes', velocidade: '32 km/h', potencia: '750 W', autonomia: '35 km', descricao: 'E-bike urbana 750W (pico 1000W), bateria 48V 15,6Ah removível, freio a disco hidráulico — assinada por Diego Ribas.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/style-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/style', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 25, nome: 'Liberty', categoria: 'E-Bikes', velocidade: '32 km/h', potencia: '500 W', autonomia: '35 km', descricao: 'Motor 500W (pico 800W), bateria 48V 13Ah removível e modos por aceleração ou pedal assistido PAS 5 níveis.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/liberty_product_web.webp', link: 'https://motochefebrasil.com.br/modelos/liberty', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 26, nome: 'SPACE', categoria: 'E-Bikes', velocidade: '32 km/h', potencia: '750 W', autonomia: '35 km', descricao: 'Motor 750W, bateria 48V 12Ah removível, 7 marchas. Aceleração no punho ou pedal assistido PAS 5 níveis.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/space_ia-1.webp', link: 'https://motochefebrasil.com.br/modelos/space', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 27, nome: 'Retrô', categoria: 'E-Bikes', velocidade: '32 km/h', potencia: '500 W', autonomia: '35 km', descricao: 'Visual de bike urbana com praticidade de e-bike moderna. Motor 500W, 32 km/h e 35 km de autonomia.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/retro_hero-1.webp', link: 'https://motochefebrasil.com.br/modelos/retro', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 28, nome: 'Joy Tri', categoria: 'Triciclos', velocidade: '30 km/h', potencia: '600 W', autonomia: '40 km', descricao: 'Chassi de três rodas com estabilidade e confiança. Ideal para quem quer segurança sem abrir mão da liberdade.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/JOY-TRI-1-1.webp', link: 'https://motochefebrasil.com.br/modelos/joy-tri', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 29, nome: 'BIG TRI', categoria: 'Triciclos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Liberdade com segurança. Triciclo 1000W com design retrô, conforto e tecnologia moderna.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/big_tri.webp', link: 'https://motochefebrasil.com.br/modelos/big-tri/', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 30, nome: 'Mia Tri', categoria: 'Triciclos', velocidade: '32 km/h', potencia: '800 W', autonomia: '40 km', descricao: 'Triciclo elétrico 800W para quem quer segurança, praticidade e estilo.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/10/MIA-TRI-01-1.webp', link: 'https://motochefebrasil.com.br/modelos/mia-tri', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 31, nome: 'X15', categoria: 'Triciclos', velocidade: '50 km/h', potencia: '3000 W', autonomia: '40 km', descricao: 'Triciclo elétrico potente com motor 3000W para aceleração firme e desempenho consistente.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/x15.webp', link: 'https://motochefebrasil.com.br/modelos/x15', preco: '', destaque: 'Não', status: 'Ativo' },
    { id: 32, nome: 'VED', categoria: 'Triciclos', velocidade: '32 km/h', potencia: '1000 W', autonomia: '40 km', descricao: 'Mobilidade elétrica acessível, segura e confortável. Motor 1000W e autonomia de até 40 km.', imagem: 'https://motochefebrasil.com.br/wp-content/uploads/2025/11/ved_1-1.webp', link: 'https://motochefebrasil.com.br/modelos/ved', preco: '', destaque: 'Não', status: 'Ativo' }
];

let catalogData = [];
let catalogFilter = 'Todos';

function renderCatalogPremium() {
    const grid = document.getElementById('catalog-grid');
    const counter = document.getElementById('catalog-count');
    if (!grid) return;
    
    const data = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const filtered = data.filter(p => catalogFilter === 'Todos' || p.categoria === catalogFilter);
    
    if (counter) counter.textContent = filtered.length;
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fa-solid fa-motorcycle text-4xl text-brand-main/30 mb-4"></i><p class="text-sm font-bold text-brand-dark dark:text-white">Nenhum veículo encontrado</p></div>';
        return;
    }
    
    grid.innerHTML = filtered.map((p, idx) => {
        const isDestaque = String(p.destaque).toLowerCase() === 'sim' || String(p.destaque).toLowerCase() === 'yes' || String(p.destaque).includes('🔥');
        return `
            <div onclick="openProductModal(${p.id})" class="catalog-card-premium" style="animation-delay: ${idx * 60}ms">
                <div class="relative overflow-hidden">
                    <img src="${p.imagem}" alt="${p.nome}" class="card-image" loading="lazy" onerror="this.src='assets/logo-motochefe-campo-grande-veiculos-eletricos.png'">
                    <div class="card-badges">
                        ${isDestaque ? '<span class="badge-destaque"><i class="fa-solid fa-star"></i> Destaque</span>' : '<span></span>'}
                        <span class="badge-categoria">${p.categoria}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${p.nome}</h3>
                    <p class="card-desc">${p.descricao}</p>
                    <div class="card-specs">
                        ${p.velocidade ? `<span class="card-spec"><i class="fa-solid fa-gauge-high"></i> ${p.velocidade}</span>` : ''}
                        ${p.potencia ? `<span class="card-spec"><i class="fa-solid fa-bolt"></i> ${p.potencia}</span>` : ''}
                        ${p.autonomia ? `<span class="card-spec"><i class="fa-solid fa-road"></i> ${p.autonomia}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.openProductModal = function(id) {
    const data = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const p = data.find(item => item.id === id);
    if (!p) return;
    
    document.getElementById('produto-img').src = p.imagem;
    document.getElementById('produto-img').alt = p.nome;
    document.getElementById('produto-nome').textContent = p.nome;
    document.getElementById('produto-categoria').textContent = p.categoria;
    document.getElementById('produto-badge-categoria').textContent = p.categoria;
    document.getElementById('produto-descricao').textContent = p.descricao;
    document.getElementById('produto-velocidade').textContent = p.velocidade || '-';
    document.getElementById('produto-potencia').textContent = p.potencia || '-';
    document.getElementById('produto-autonomia').textContent = p.autonomia || '-';
    document.getElementById('produto-link-site').href = p.link || '#';
    
    const badgeDestaque = document.getElementById('produto-badge-destaque');
    const isDestaque = String(p.destaque).toLowerCase() === 'sim' || String(p.destaque).toLowerCase() === 'yes' || String(p.destaque).includes('🔥');
    badgeDestaque.classList.toggle('hidden', !isDestaque);
    
    const precoBox = document.getElementById('produto-preco-box');
    if (p.preco && String(p.preco).trim() !== '') {
        document.getElementById('produto-preco').textContent = 'R$ ' + p.preco;
        precoBox.classList.remove('hidden');
    } else {
        precoBox.classList.add('hidden');
    }
    
    const waText = encodeURIComponent('Olá, vim pelo catálogo do link da bio e tenho interesse no modelo ' + p.nome + '.');
    document.getElementById('produto-link-whatsapp').href = 'https://wa.me/5521977342290?text=' + waText;
    
    const modal = document.getElementById('modal-produto');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

function initCatalog() {
    renderCatalogPremium();
    
    const filters = document.getElementById('catalog-filters-premium');
    if (filters) {
        filters.addEventListener('click', (e) => {
            const btn = e.target.closest('.catalog-filter-premium');
            if (!btn) return;
            catalogFilter = btn.dataset.filter;
            document.querySelectorAll('.catalog-filter-premium').forEach(b => {
                b.classList.toggle('active', b === btn);
            });
            renderCatalogPremium();
        });
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar alternância de tema (Prioridade)
    initThemeToggle();
    
    // 2. Atualizar saudação
    updateGreeting();
    
    // 3. Inicializar animações de scroll
    initScrollReveal();
    
    // Outros componentes
    initGalleryCarousel();
    initVideoCarousel();
    initComparisonSlider();
    initModalBackdrops();
    initEscapeKey();
    initWhatsappBubble();
    initCatalog();

    // Console log
    console.log(`%c${CONFIG.projectName}`, 'color: #C9A227; font-size: 20px; font-weight: bold;');
    console.log('%cMotochefe Campo Grande', 'color: #C9A227; font-size: 14px;');
    console.log('%cDesenvolvido por AG5 Agência', 'color: #8B5E1E; font-size: 12px;');
});

// ============================================
// EXPORTS (para uso global)
// ============================================
window.openModal = openModal;
window.closeModal = closeModal;
window.openImageModal = openImageModal;
window.downloadVCard = downloadVCard;
window.scrollGallery = scrollGallery;
window.openProductModal = openProductModal;
