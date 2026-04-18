/**
 * Motochefe Campo Grande - Links 360
 * Script principal de interatividade
 */

// ============================================
// FUNÃ‡ÃƒO: Ocultar/mostrar botões fixos ao rolar
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
// CONFIGURAÃ‡ÃƒO GLOBAL
// ============================================
const CONFIG = window.Link360Config || {
    projectName: "motochefe-campo-grande",
    themeKey: "motochefe-theme",
    defaultDark: false,
    greetingText: "Bem-vindo à Motochefe",
    accentColor: "#C9A227"
};

// ============================================
// FUNÃ‡ÃƒO: Download vCard
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
// FUNÃ‡ÃƒO: Modal System
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
// FUNÃ‡ÃƒO: Controle de Música
// ============================================
function initMusicToggle() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    if (!musicBtn) return;

    if (music) music.volume = 0.2;

    const updateIcon = () => {
        const musicPlaying = music && !music.paused;
        if (musicPlaying) {
            if (musicIcon) musicIcon.className = 'fa-solid fa-volume-high text-xs';
        } else {
            if (musicIcon) musicIcon.className = 'fa-solid fa-volume-xmark text-xs';
        }
    };

    musicBtn.addEventListener('click', () => {
        if (music) {
            if (music.paused) {
                music.play().catch(e => console.log("Erro ao tocar música:", e));
            } else {
                music.pause();
            }
        }
        updateIcon();
    });

    if (music) {
        music.addEventListener('play', updateIcon);
        music.addEventListener('pause', updateIcon);
    }
}

// ============================================
// FUNÃ‡ÃƒO: Dynamic Greeting
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
// FUNÃ‡ÃƒO: Theme Toggle
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
// FUNÃ‡ÃƒO: Scroll Reveal Animation
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
// FUNÃ‡ÃƒO: Gallery Carousel
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
// FUNÃ‡ÃƒO: Video Carousel
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
// FUNÃ‡ÃƒO: Image Comparison Slider
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
// FUNÃ‡ÃƒO: Close Modals on Backdrop Click
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
// FUNÃ‡ÃƒO: Close Modals on Escape Key
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
// FUNÃ‡ÃƒO: WhatsApp Message Bubble (Premium Logic)
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

const SHEETS_ID = '10XX9vD_MP7vQMhFj9pcRPBkmQCsnY1xCWDKLUwxfd6Q';
const GOOGLE_SHEETS_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=%F0%9F%93%A6%20Cat%C3%A1logo`;

async function loadSheetTab(sheetName) {
    const ts = Date.now();
    const cleanName = sheetName.replace(/[\uD83D\uDD14\uD83D\uDD52\uD83D\uDCE2\uD83D\uDCE3\u231B]/g, '').trim();
    
    // Lista de tentativas: nome original e nome sem emoji
    const attempts = [sheetName];
    if (cleanName !== sheetName) attempts.push(cleanName);
    if (sheetName.includes('Alertas')) attempts.push('Alertas');
    if (sheetName.includes('Horarios')) attempts.push('Horarios');
    if (sheetName.includes('Promocoes')) attempts.push('Promocoes');

    for (const name of attempts) {
        const url = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}&_=${ts}`;
        try {
            const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
            if (!res.ok) continue;
            
            const text = await res.text();
            if (!text || text.includes('<!DOCTYPE html>')) continue; // Se retornar HTML, a aba não existe ou está inacessível

            const lines = text.trim().split(/\r?\n/);
            if (!lines.length) continue;

            const firstRow = parseCSVLine(lines[0]).map(c => c.trim().toLowerCase());
            const isHorizontal = firstRow.length > 1 && firstRow[0] !== 'campo';

            const result = {};
            if (isHorizontal) {
                const headers = parseCSVLine(lines[0]).map(c => c.trim());
                const values  = lines[1] ? parseCSVLine(lines[1]).map(c => c.trim()) : [];
                headers.forEach((h, i) => { if (h) result[h] = values[i] || ''; });
            } else {
                let dataStart = 0;
                for (let i = 0; i < lines.length; i++) {
                    const row = parseCSVLine(lines[i]);
                    const k = (row[0] || '').trim().toLowerCase();
                    if (k === 'campo') { dataStart = i + 1; break; }
                    if (k && !k.includes('🔔') && !k.includes('🕐') && !k.includes('📢')) {
                        dataStart = i; break;
                    }
                }
                for (let i = dataStart; i < lines.length; i++) {
                    const cols = parseCSVLine(lines[i]);
                    const key = (cols[0] || '').trim();
                    const val = (cols[1] || '').trim();
                    if (key) result[key] = val;
                }
            }
            if (Object.keys(result).length > 0) {
                console.log(`✅ Aba [${name}] carregada com sucesso.`);
                return result;
            }
        } catch (e) {
            console.warn(`Tentativa falhou para aba [${name}]:`, e);
        }
    }
    console.error(`❌ Não foi possível encontrar a aba [${sheetName}] ou ela está inacessível.`);
    return null;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const next = line[i + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) return [];
    // Pula linha de título da planilha (linha 0 tem o nome do catálogo, headers reais estão na linha 1)
    const firstCols = parseCSVLine(lines[0]);
    const headerLineIdx = (firstCols[0] || '').trim() === 'ID' ? 0 : 1;
    const headers = parseCSVLine(lines[headerLineIdx]).map(h => h.trim());
    const rows = [];
    for (let i = headerLineIdx + 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = (values[idx] || '').trim();
        });
        // anexa array bruto para leitura por índice de coluna
        obj.__raw = values.map(v => (v || '').trim());
        rows.push(obj);
    }
    return rows;
}

function findKey(obj, ...candidates) {
    const keys = Object.keys(obj);
    for (const c of candidates) {
        const lower = c.toLowerCase();
        const exact = keys.find(k => k.toLowerCase() === lower);
        if (exact !== undefined) return exact;
        const partial = keys.find(k => k.toLowerCase().includes(lower));
        if (partial !== undefined) return partial;
    }
    return undefined;
}

function normalizeProductData(_raw, rawArray) {
    // rawArray = valores em ordem de coluna [col0, col1, ..., col16]
    // Posições fixas (baseadas na planilha atual):
    // 0=ID, 1=Nome, 2=Cat, 3=Vel, 4=Pot, 5=Auto, 6=Desc,
    // 7=Img1, 8=Img2, 9=Img3, 10=Link,
    // 11=De: Preço (col L), 12=Por: Preço (col M),
    // 13=Parcelado, 14=Badge, 15=Oferta, 16=Status

    function col(idx) {
        if (rawArray && rawArray[idx] !== undefined) return String(rawArray[idx] || '').trim();
        return '';
    }

    function parseMoney(val) {
        const clean = (val || '').replace(/[^\d,]/g, '').replace(',', '.').trim();
        return clean ? parseFloat(clean).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    }

    const id = parseInt(col(0), 10) || 0;
    const precoDeRaw = col(11);
    const precoPorRaw = col(12);

    // Se De e Por forem idênticos, não há desconto — exibe só o Por sem risco
    const precoDe  = parseMoney(precoDeRaw);
    const precoPor = parseMoney(precoPorRaw);
    const temDesconto = precoDe && precoPor && precoDe !== precoPor;

    return {
        id,
        nome:       col(1),
        categoria:  col(2),
        velocidade: col(3),
        potencia:   col(4),
        autonomia:  col(5),
        descricao:  col(6),
        imagem:     col(7),
        imagem2:    col(8),
        imagem3:    col(9),
        link:       col(10),
        preco:      precoDe,
        precoPor:   precoPor || precoDe,
        parcelado:  col(13),
        badge:      col(14).replace(/Sem CNH\s*\|?\s*/gi, '').trim(),
        destaque:   col(15) || 'Não',
        status:     col(16) || 'Ativo'
    };
}

async function loadCatalogData() {
    if (GOOGLE_SHEETS_CSV_URL) {
        try {
            const response = await fetch(GOOGLE_SHEETS_CSV_URL, { cache: 'no-store' });
            if (response.ok) {
                const csvText = await response.text();
                const parsed = parseCSV(csvText);
                catalogData = parsed.map(p => normalizeProductData(p, p.__raw))
                                    .filter(p => p.nome && p.status.toLowerCase() !== 'inativo');
                console.log('âœ… Catálogo carregado do Google Sheets:', catalogData.length);
                return;
            }
        } catch (e) {
            console.warn('âš ï¸ Falha ao carregar Google Sheets:', e);
        }
    }
    catalogData = CATALOG_FALLBACK_DATA.filter(p => p.status.toLowerCase() !== 'inativo');
    console.log('📦 Catálogo usando fallback local:', catalogData.length);
}

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
let catalogSearchQuery = '';

function normalizeText(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function productMatchesSearch(p, query) {
    if (!query) return true;
    const q = normalizeText(query);
    const fields = [
        p.nome,
        p.categoria,
        p.velocidade,
        p.potencia,
        p.autonomia,
        p.descricao,
        p.preco,
        p.precoPor,
        p.parcelado,
        p.badge,
        p.status
    ];
    return fields.some(field => normalizeText(field).includes(q));
}

function renderCatalogPremium() {
    const grid = document.getElementById('catalog-grid');
    const counter = document.getElementById('catalog-count');
    // remove skeletons antes de renderizar
    grid && grid.querySelectorAll('.catalog-skeleton').forEach(s => s.remove());
    if (!grid) return;

    const data = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const filtered = data.filter(p => {
        if ((p.status || '').toLowerCase() === 'inativo') return false;
        const matchesFilter = catalogFilter === 'Todos' || (p.categoria && p.categoria.toLowerCase().includes(catalogFilter.toLowerCase()));
        const matchesSearch = productMatchesSearch(p, catalogSearchQuery);
        return matchesFilter && matchesSearch;
    });

    if (counter) counter.textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-16">
            <i class="fa-solid fa-motorcycle text-5xl text-brand-main/20 mb-4 block"></i>
            <p class="text-sm font-bold text-brand-dark dark:text-white">Nenhum veículo encontrado</p>
            <p class="text-xs text-brand-gray mt-2">Tente outro termo de busca ou filtro</p>
        </div>`;
        return;
    }

    grid.innerHTML = filtered.map((p, idx) => {
        const isOferta = String(p.destaque).toLowerCase() === 'oferta da semana';
        return cardV2HTML(p, idx, false, isOferta, false);
    }).join('');
}

window.openProductModal = function(id) {
    const data = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const p = data.find(item => item.id === id);
    if (!p) return;
    
    const imgEl = document.getElementById('produto-img');
    imgEl.src = p.imagem;
    imgEl.alt = p.nome;
    imgEl.style.cursor = 'zoom-in';
    imgEl.onclick = null;
    imgEl.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var src = document.getElementById('produto-img').src;
        var alt = document.getElementById('produto-img').alt;
        window._abrirLightboxProduto(src, alt);
    };

    // Miniaturas
    const thumbsContainer = document.getElementById('produto-thumbs');
    const thumbs = [p.imagem, p.imagem2, p.imagem3].filter(src => src && src.trim() !== '');
    if (thumbsContainer) {
        if (thumbs.length > 1) {
            thumbsContainer.classList.remove('hidden');
            thumbsContainer.innerHTML = thumbs.map((src, idx) => `
                <button onclick="
                    var im = document.getElementById('produto-img');
                    im.src='${src}';
                    document.querySelectorAll('#produto-thumbs button').forEach(function(b,i){ b.style.borderColor = i===${idx} ? 'var(--color-brand-main, #e11d48)' : 'transparent'; });
                " class="flex-shrink-0 w-16 h-16 rounded-xl border-2 ${idx === 0 ? 'border-brand-main' : 'border-transparent'} overflow-hidden hover:border-brand-main transition-colors" style="border-color:${idx === 0 ? 'var(--color-brand-main,#e11d48)' : 'transparent'}">
                    <img src="${src}" alt="" class="w-full h-full object-cover">
                </button>
            `).join('');
        } else {
            thumbsContainer.classList.add('hidden');
            thumbsContainer.innerHTML = '';
        }
    }
    document.getElementById('produto-nome').textContent = p.nome;
    document.getElementById('produto-categoria').textContent = p.categoria;
    document.getElementById('produto-descricao').textContent = p.descricao;
    document.getElementById('produto-velocidade').textContent = p.velocidade || '-';
    document.getElementById('produto-potencia').textContent = p.potencia || '-';
    document.getElementById('produto-autonomia').textContent = p.autonomia || '-';
    document.getElementById('produto-link-site').href = p.link || '#';
    
    const badgeDestaque = document.getElementById('produto-badge-destaque');
    const isDestaque = String(p.destaque).toLowerCase().includes('mais vendidos') || String(p.destaque).toLowerCase() === 'sim' || String(p.destaque).toLowerCase() === 'yes' || String(p.destaque).includes('🔥');
    badgeDestaque.classList.toggle('hidden', !isDestaque);
    
    const isOfertaPopup = String(p.destaque).toLowerCase() === 'oferta da semana';
    const precoBox = document.getElementById('produto-preco-box');
    if ((p.preco && String(p.preco).trim()) || (p.precoPor && String(p.precoPor).trim())) {
        const precoEl = document.getElementById('produto-preco');
        let html = '';
        if (p.preco && String(p.preco).trim()) {
            html += `<span class="modal-preco-de">R$ ${p.preco}</span>`;
        }
        if (p.precoPor && String(p.precoPor).trim()) {
            html += `<span class="modal-preco-por">R$ ${p.precoPor}</span>`;
        }
        precoEl.innerHTML = html;
        precoBox.classList.remove('hidden');

        const parceladoEl = document.getElementById('produto-parcelado');
        if (parceladoEl) {
            if (p.parcelado && String(p.parcelado).trim()) {
                parceladoEl.textContent = p.parcelado;
                parceladoEl.classList.remove('hidden');
            } else {
                parceladoEl.classList.add('hidden');
            }
        }
    } else {
        precoBox.classList.add('hidden');
    }
    
    const precoWa = p.precoPor ? ` — R$ ${p.precoPor}` : '';
    const waText = encodeURIComponent(`Olá! Vi o catálogo e tenho interesse no modelo ${p.nome}${precoWa}. Pode me passar mais informações?`);
    document.getElementById('produto-link-whatsapp').href = 'https://wa.me/5521977342290?text=' + waText;
    
    const modal = document.getElementById('modal-produto');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

function cardV2HTML(p, idx, forceDestaque = false, isOferta = false, hidePreco = false) {
    const isDestaque  = forceDestaque || String(p.destaque).toLowerCase().includes('mais vendidos') || String(p.destaque).toLowerCase() === 'sim';
    const temPreco    = p.precoPor && String(p.precoPor).trim();
    const temDesconto = p.preco && String(p.preco).trim() && p.preco !== p.precoPor;
    const badge       = (p.badge || '').replace('Sem CNH', '').replace('Sem CNH | ', '').trim();

    // Preço no card: ofertas sempre mostram De/Por (forçando desconto visual)
    let precoHTML = '';
    if (!hidePreco && p.precoPor && String(p.precoPor).trim()) {
        const temPrecoDe = p.preco && String(p.preco).trim();
        precoHTML = `<div class="card-v2-preco-wrap">
            ${temPrecoDe ? `<span class="card-v2-de">R$ ${p.preco}</span>` : ''}
            <span class="card-v2-por">R$ ${p.precoPor}</span>
        </div>`;
    }

    return `
    <div onclick="openProductModal(${p.id})" class="card-v2 ${isOferta ? 'card-v2-oferta' : ''}" style="animation-delay:${idx*60}ms">
        ${isOferta ? `<div class="card-v2-promo-strip">Promoção</div>` : ''}
        <div class="card-v2-img-wrap">
            <img src="${p.imagem}" alt="${p.nome}" loading="lazy"
                 onerror="this.src='assets/logo-desktop-motochefe-campo-grande-veiculos-eletricos.webp'">
            <div class="card-v2-gradient"></div>
            <div class="card-v2-top">
                ${isDestaque ? `<span class="card-v2-badge-destaque"><i class="fa-solid fa-star"></i></span>` : '<span></span>'}
            </div>
            <div class="card-v2-over">
                <h3 class="card-v2-nome">${p.nome}</h3>
                ${precoHTML}
            </div>

            <!-- ver detalhes no canto inferior direito -->
            <div class="card-v2-details">Ver detalhes</div>
        </div>
        <div class="card-v2-footer">
            <div class="card-v2-specs">
                <span class="card-v2-spec card-v2-spec-cat"><i class="fa-solid fa-tag"></i>${p.categoria.split(',')[0].trim()}</span>
                ${p.velocidade ? `<span class="card-v2-spec"><i class="fa-solid fa-gauge-high"></i>${p.velocidade}</span>` : ''}
                ${p.potencia   ? `<span class="card-v2-spec"><i class="fa-solid fa-bolt"></i>${p.potencia}</span>`   : ''}
                ${p.autonomia  ? `<span class="card-v2-spec"><i class="fa-solid fa-road"></i>${p.autonomia}</span>`  : ''}
            </div>
            <div class="card-v2-actions">
                ${badge ? `<span class="card-v2-tag">${badge}</span>` : ''}
            </div>
        </div>
    </div>`;
}

function renderOfertasSemana() {
    const section = document.getElementById('section-ofertas-semana');
    const wrap    = document.getElementById('catalog-grid-ofertas');
    if (!wrap || !section) return;

    // Se há busca ativa, oculta a seção de ofertas
    if (catalogSearchQuery && catalogSearchQuery.trim().length > 0) {
        section.style.display = 'none';
        return;
    }

    const data    = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const ativos  = data.filter(p => (p.status || '').toLowerCase() !== 'inativo');
    const ofertas = ativos.filter(p => String(p.destaque).toLowerCase() === 'oferta da semana');

    // Sem nenhuma oferta da semana â†’ oculta a seção inteira
    if (ofertas.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = '';

    // Layout: todos em cards grandes (col-span total)
    wrap.innerHTML = ofertas.map((p, idx) => `
        <div class="grid grid-cols-1 gap-3">
            ${cardV2HTML(p, idx, false, true)}
        </div>
    `).join('');
}

function renderDestaqueGrid() {
    const section = document.getElementById('section-mais-vendidos');
    const wrap    = document.getElementById('catalog-grid-destaque');
    if (!wrap || !section) return;

    // Se há busca ativa, oculta a seção de destaques para focar nos resultados filtrados
    if (catalogSearchQuery && catalogSearchQuery.trim().length > 0) {
        section.style.display = 'none';
        return;
    }

    const data    = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const ativos  = data.filter(p => (p.status || '').toLowerCase() !== 'inativo');
    const destaques = ativos.filter(p => String(p.destaque).toLowerCase().includes('mais vendidos'));

    // Sem nenhum destaque na col P â†’ oculta a seção inteira
    if (destaques.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = '';

    const top3 = destaques.slice(0, 3);

    // Layout: todos os destaques em cards grandes (col-span total)
    wrap.innerHTML = top3.map((p, idx) => `
        <div class="grid grid-cols-1 gap-3">
            ${cardV2HTML(p, idx, true, false, true)}
        </div>
    `).join('');
}

function openCategoriaModal(filterValue) {
    const modal = document.getElementById('modal-categoria');
    const grid = document.getElementById('modal-categoria-grid');
    const titulo = document.getElementById('modal-categoria-titulo');
    const counter = document.getElementById('modal-categoria-count');
    if (!modal || !grid) return;

    const data = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
    const filtered = data.filter(p => {
        if ((p.status || '').toLowerCase() === 'inativo') return false;
        if (filterValue === 'Todos') return true;
        return p.categoria && p.categoria.toLowerCase().includes(filterValue.toLowerCase());
    });

    if (titulo) titulo.textContent = filterValue;
    if (counter) counter.textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-center py-12">
            <i class="fa-solid fa-motorcycle text-5xl text-brand-main/20 mb-4 block"></i>
            <p class="text-sm font-bold text-brand-dark dark:text-white">Nenhum veículo encontrado</p>
        </div>`;
    } else {
        grid.innerHTML = filtered.map((p, idx) => {
            const isOferta = String(p.destaque).toLowerCase() === 'oferta da semana';
            const temPreco = p.precoPor && String(p.precoPor).trim();
            const temDesconto = p.preco && String(p.preco).trim() && p.preco !== p.precoPor;
            const badge = (p.badge || '').replace('Sem CNH', '').replace('Sem CNH | ', '').trim();

            let precoHTML = '';
            if (p.precoPor && String(p.precoPor).trim()) {
                const temPrecoDe = p.preco && String(p.preco).trim();
                precoHTML = `<div class="flex items-baseline gap-2 mt-1">
                    ${temPrecoDe ? `<span class="text-[11px] font-bold text-white/70 line-through decoration-red-500 decoration-2">R$ ${p.preco}</span>` : ''}
                    <span class="text-base font-extrabold text-brand-main" style="font-family:'Barlow Condensed',sans-serif">R$ ${p.precoPor}</span>
                </div>`;
            }

            return `
            <div onclick="openProductModal(${p.id})" class="group relative bg-white dark:bg-[#18181b] rounded-[1.5rem] overflow-hidden border border-black/10 dark:border-white/10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer" style="animation-delay:${idx*50}ms">
                ${isOferta ? `<div class="absolute top-3 right-[-26px] w-[100px] bg-gradient-to-r from-red-500 to-red-600 text-white text-[8px] font-black uppercase tracking-wider py-1 text-center rotate-45 z-10 shadow-md">Promoção</div>` : ''}
                <div class="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="this.src='assets/logo-desktop-motochefe-campo-grande-veiculos-eletricos.webp'" class="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105">
                    ${(String(p.destaque).toLowerCase().includes('mais vendidos') || String(p.destaque).toLowerCase() === 'sim') ? `<div class="absolute top-3 left-3 w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg"><i class="fa-solid fa-star text-[10px]"></i></div>` : ''}
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                        <h3 class="text-white font-extrabold text-lg uppercase tracking-tight leading-none" style="font-family:'Barlow Condensed',sans-serif;text-shadow:0 1px 3px rgba(0,0,0,.5)">${p.nome}</h3>
                        ${precoHTML}
                    </div>
                </div>
                <div class="p-3">
                    <div class="flex flex-wrap gap-1.5 mb-2">
                        <span class="text-[9px] font-bold text-brand-main bg-brand-main/10 border border-brand-main/20 px-2 py-1 rounded-full uppercase tracking-wide"><i class="fa-solid fa-tag mr-1"></i>${p.categoria.split(',')[0].trim()}</span>
                        ${p.velocidade ? `<span class="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full uppercase"><i class="fa-solid fa-gauge-high mr-1 text-brand-main"></i>${p.velocidade}</span>` : ''}
                        ${p.potencia ? `<span class="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full uppercase"><i class="fa-solid fa-bolt mr-1 text-brand-main"></i>${p.potencia}</span>` : ''}
                        ${p.autonomia ? `<span class="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full uppercase"><i class="fa-solid fa-road mr-1 text-brand-main"></i>${p.autonomia}</span>` : ''}
                    </div>
                    ${badge ? `<div class="flex items-center justify-between"><span class="text-[9px] font-extrabold text-brand-main bg-brand-main/10 border border-brand-main/25 px-2.5 py-1 rounded-full uppercase tracking-wide">${badge}</span></div>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

async function initCatalog() {
    await loadCatalogData();
    renderOfertasSemana();
    renderDestaqueGrid();
    
    // Esconde o grid principal e contador da tela inicial
    const gridPrincipal = document.getElementById('catalog-grid');
    const counterPrincipal = document.getElementById('catalog-counter');
    if (gridPrincipal) gridPrincipal.style.display = 'none';
    if (counterPrincipal) counterPrincipal.style.display = 'none';
    
    const filters = document.getElementById('catalog-filters-premium');
    if (filters) {
        filters.addEventListener('click', (e) => {
            const btn = e.target.closest('.catalog-filter-premium');
            if (!btn) return;
            catalogFilter = btn.dataset.filter;
            document.querySelectorAll('.catalog-filter-premium').forEach(b => {
                b.classList.toggle('active', b === btn);
            });
            openCategoriaModal(catalogFilter);
        });
    }

    // Barra de pesquisa
    const searchInput = document.getElementById('catalog-search');
    const searchClear = document.getElementById('catalog-search-clear');

    function renderBusca() {
        const secBusca = document.getElementById('section-busca-resultados');
        const gridBusca = document.getElementById('catalog-grid-busca');
        if (!secBusca || !gridBusca) return;

        if (!catalogSearchQuery) {
            secBusca.style.display = 'none';
            gridBusca.innerHTML = '';
            return;
        }

        const data = catalogData.length > 0 ? catalogData : CATALOG_FALLBACK_DATA;
        const filtered = data.filter(p =>
            (p.status || '').toLowerCase() !== 'inativo' &&
            productMatchesSearch(p, catalogSearchQuery)
        );

        if (filtered.length === 0) {
            gridBusca.innerHTML = `<div class="col-span-full text-center py-10">
                <i class="fa-solid fa-magnifying-glass text-4xl text-brand-main/20 mb-3 block"></i>
                <p class="text-sm font-bold text-brand-dark dark:text-white">Nenhum resultado para "${catalogSearchQuery}"</p>
                <p class="text-xs text-brand-gray mt-1">Tente outro termo de busca</p>
            </div>`;
        } else {
            gridBusca.innerHTML = filtered.map((p, idx) => {
                const isOferta = String(p.destaque).toLowerCase() === 'oferta da semana';
                return cardV2HTML(p, idx, false, isOferta, false);
            }).join('');
        }

        secBusca.style.display = '';
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            catalogSearchQuery = e.target.value.trim();
            if (searchClear) searchClear.classList.toggle('visible', catalogSearchQuery.length > 0);
            renderBusca();
        });
    }
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            catalogSearchQuery = '';
            if (searchInput) { searchInput.value = ''; searchInput.focus(); }
            searchClear.classList.remove('visible');
            renderBusca();
        });
    }
}

// ============================================
// CONTADOR DE IMPACTO AMBIENTAL
// ============================================
function initImpactoAmbiental() {
    const elCo2    = document.getElementById('counter-co2');
    const elLitros = document.getElementById('counter-litros');
    const section  = document.getElementById('impacto-ambiental');
    if (!elCo2 || !elLitros || !section) return;

    // Premissa conservadora: 30 veículos × 30 km/dia × 0,04 kg CO₂/km evitado
    // Gasolina: 0,04 kg CO₂/km ÷ 2,3 kg CO₂/litro ≈ 0,017 L/km × 30 km × 30 veíc.
    const INICIO         = new Date('2025-01-01');
    const dias           = Math.max(0, Math.floor((Date.now() - INICIO) / 86400000));
    const CO2_POR_DIA    = 36;    // kg  (30 veíc × 30 km × 0,04 kg/km)
    const LITROS_POR_DIA = 15.6;  // L   (30 veíc × 30 km × 0,017 L/km)

    const totalCo2    = Math.round(dias * CO2_POR_DIA);
    const totalLitros = Math.round(dias * LITROS_POR_DIA);

    function formatNum(n) {
        return n.toLocaleString('pt-BR');
    }

    function animateCounter(el, target, duration) {
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = formatNum(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            animateCounter(elCo2,    totalCo2,    2000);
            animateCounter(elLitros, totalLitros, 2000);
        }
    }, { threshold: 0.4 });
    observer.observe(section);
}

// ============================================
// MÓDULO: ALERTAS (Google Sheets → aba 🔔 Alertas)
// ============================================
async function initAlertas() {
    const data = await loadSheetTab('🔔 Alertas');
    if (!data) { console.log('🔔 Alertas: sem dados na planilha'); return; }
    
    // Função auxiliar para buscar chaves sem se preocupar com maiúsculas/acentos
    const get = (key) => {
        const k = key.toLowerCase();
        const found = Object.keys(data).find(dk => dk.toLowerCase().includes(k));
        return found ? (data[found] || '').trim() : '';
    };

    const ativo = get('ativo').toLowerCase() === 'sim';
    if (!ativo) { console.log('🔔 Alertas: inativo na planilha'); return; }

    const tipo     = get('tipo').toLowerCase() || 'info';
    const mensagem = get('mensagem');
    const exibirDe  = get('exibir de');
    const exibirAte = get('exibir ate');

    if (!mensagem) { console.log('🔔 Alertas: mensagem vazia'); return; }

    function parseDMY(str) {
        if (!str || !str.includes('/')) return null;
        const p = str.trim().split('/');
        return new Date(+p[2], +p[1] - 1, +p[0]);
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const de  = parseDMY(exibirDe);
    const ate = parseDMY(exibirAte);
    
    if (de  && now < de)  { console.log('🔔 Alertas: fora do período (antes)'); return; }
    if (ate && now > ate) { console.log('🔔 Alertas: fora do período (depois)'); return; }

    const cores = {
        info:    { bg: '#1565C0', icon: 'fa-circle-info' },
        aviso:   { bg: '#F57F17', icon: 'fa-triangle-exclamation' },
        urgente: { bg: '#C62828', icon: 'fa-circle-exclamation' },
    };
    const { bg, icon } = cores[tipo] || cores.info;

    // Remove barra anterior se existir
    const old = document.getElementById('alerta-bar');
    if (old) { old.remove(); document.body.style.paddingTop = ''; }

    const bar = document.createElement('div');
    bar.id = 'alerta-bar';
    bar.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:99999;background:${bg};color:#fff;
        font-size:11px;font-weight:700;letter-spacing:.05em;text-align:center;
        padding:12px 48px 12px 16px;display:flex;align-items:center;justify-content:center;gap:8px;
        box-shadow:0 4px 15px rgba(0,0,0,.3);animation:alertaSlideDown .4s cubic-bezier(.23,1,.32,1);line-height:1.4;`;
    
    bar.innerHTML = `
        <i class="fa-solid ${icon}" style="font-size:14px;flex-shrink:0;"></i>
        <span style="max-width:800px;">${mensagem}</span>
        <button onclick="this.closest('#alerta-bar').remove();document.body.style.paddingTop=''"
            style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
                   background:rgba(255,255,255,.2);border:none;color:#fff;width:28px;height:28px;
                   border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;">
            <i class="fa-solid fa-xmark" style="font-size:14px;"></i>
        </button>`;
    
    document.body.prepend(bar);
    document.body.style.paddingTop = bar.offsetHeight + 'px';
    console.log('✅ Alerta ativado:', mensagem);
}

// ============================================
// MÓDULO: HORÁRIOS AO VIVO (Google Sheets → aba 🕐 Horarios)
// ============================================
async function initHorariosAoVivo() {
    const data = await loadSheetTab('🕐 Horarios');
    if (!data) { console.log('Horários: sem dados'); return; }
    console.log('Horários data:', data);

    // --- ATUALIZAÇÃO DOS TEXTOS NA SEÇÃO ONDE ESTAMOS ---
    const hSegSex = document.getElementById('horario-seg-sex');
    const hSabado = document.getElementById('horario-sabado');
    const hDomingo = document.getElementById('horario-domingo');
    const liDomingo = document.getElementById('li-horario-domingo');

    if (hSegSex && data['Seg-Sex Abertura'] && data['Seg-Sex Fechamento']) {
        hSegSex.textContent = `${data['Seg-Sex Abertura']} - ${data['Seg-Sex Fechamento']}`;
    }
    if (hSabado && data['Sabado Abertura'] && data['Sabado Fechamento']) {
        const val = data['Sabado Abertura'].toLowerCase() === 'fechado' ? 'Fechado' : `${data['Sabado Abertura']} - ${data['Sabado Fechamento']}`;
        hSabado.textContent = val;
    }
    if (hDomingo && liDomingo && data['Domingo']) {
        const domVal = data['Domingo'].trim();
        if (domVal.toLowerCase() !== 'fechado') {
            hDomingo.textContent = domVal.includes('-') ? domVal.replace('-', ' - ') : domVal;
            liDomingo.classList.remove('hidden');
            liDomingo.classList.add('flex');
        } else {
            liDomingo.classList.add('hidden');
            liDomingo.classList.remove('flex');
        }
    }
    // --------------------------------------------------

    if ((data['Exibir Status ao Vivo'] || '').toLowerCase().trim() !== 'sim') return;

    function toMin(hhmm) {
        if (!hhmm || hhmm.trim().toLowerCase() === 'fechado') return null;
        const parts = hhmm.trim().split(':').map(Number);
        return parts[0] * 60 + (parts[1] || 0);
    }

    const now       = new Date();
    const dia       = now.getDay();   // 0=dom 1=seg … 6=sab
    const minAtual  = now.getHours() * 60 + now.getMinutes();

    // Feriado: só considera feriado se o campo tiver formato dd/mm/aaaa
    const feriadoStr = (data['Feriado Proximo'] || '').trim();
    let isFeriado = false;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(feriadoStr)) {
        const [fd, fm, fy] = feriadoStr.split('/').map(Number);
        isFeriado = now.getDate() === fd && (now.getMonth() + 1) === fm && now.getFullYear() === fy;
    }

    let aberto = false;
    let proximaAbertura = '';
    const msgFeriado = data['Msg Feriado'] || 'Fechado no feriado';
    const abreSeg = data['Seg-Sex Abertura'] || '08:00';
    const abreSab = data['Sabado Abertura']  || '09:00';

    if (isFeriado) {
        aberto = false;
        proximaAbertura = msgFeriado;
    } else if (dia >= 1 && dia <= 5) {
        // Segunda a Sexta
        const abre  = toMin(data['Seg-Sex Abertura']);
        const fecha = toMin(data['Seg-Sex Fechamento']);
        aberto = abre !== null && fecha !== null && minAtual >= abre && minAtual < fecha;
        if (!aberto) {
            if (minAtual < abre) {
                proximaAbertura = `Abre hoje às ${data['Seg-Sex Abertura']}`;
            } else if (dia < 5) {
                proximaAbertura = `Abre amanhã às ${abreSeg}`;
            } else {
                // Sexta após fechar → verifica se tem sábado
                const sabAbre = toMin(data['Sabado Abertura']);
                proximaAbertura = sabAbre !== null
                    ? `Abre Sábado às ${abreSab}`
                    : `Abre Segunda às ${abreSeg}`;
            }
        }
    } else if (dia === 6) {
        // Sábado
        const abre  = toMin(data['Sabado Abertura']);
        const fecha = toMin(data['Sabado Fechamento']);
        if (abre === null) {
            aberto = false;
            proximaAbertura = `Abre Segunda às ${abreSeg}`;
        } else {
            aberto = fecha !== null && minAtual >= abre && minAtual < fecha;
            if (!aberto) {
                proximaAbertura = minAtual < abre
                    ? `Abre hoje às ${abreSab}`
                    : `Abre Segunda às ${abreSeg}`;
            }
        }
    } else {
        // Domingo
        const domVal = (data['Domingo'] || 'Fechado').trim().toLowerCase();
        if (domVal !== 'fechado' && domVal.includes('-')) {
            const [a, f] = domVal.split('-');
            const abre  = toMin(a);
            const fecha = toMin(f);
            aberto = abre !== null && fecha !== null && minAtual >= abre && minAtual < fecha;
        }
        if (!aberto) proximaAbertura = `Abre Segunda às ${abreSeg}`;
    }

    // Remove badge anterior se existir
    const oldBadge = document.getElementById('status-badge');
    if (oldBadge) oldBadge.remove();

    const badge = document.createElement('div');
    badge.id = 'status-badge';
    badge.style.cssText = `display:flex;align-items:center;justify-content:center;gap:6px;
        font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
        padding:5px 14px;border-radius:999px;margin:0 auto 2px;width:fit-content;
        background:${aberto ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.12)'};
        color:${aberto ? '#16a34a' : '#dc2626'};
        border:1px solid ${aberto ? 'rgba(34,197,94,.35)' : 'rgba(239,68,68,.3)'};`;
    badge.innerHTML = `
        <span style="width:6px;height:6px;border-radius:50%;flex-shrink:0;display:inline-block;
            background:${aberto ? '#22c55e' : '#ef4444'};
            ${aberto ? 'box-shadow:0 0 0 3px rgba(34,197,94,.25);animation:statusPulse 2s infinite;' : ''}"></span>
        ${aberto ? 'Aberto agora' : (proximaAbertura || 'Fechado')}`;

    // Injeta acima do botão "Ver Catálogo de Veículos"
    const catalogBtn = document.querySelector('a[href="#section-catalogo"]');
    if (catalogBtn) {
        catalogBtn.parentElement.insertAdjacentElement('beforebegin', badge);
    } else {
        // fallback: insere no início do <main>
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.prepend(badge);
    }

    // Status no balão flutuante removido (solicitado pelo usuário)
    // if (!aberto && proximaAbertura) { ... }
}

// ============================================
// MÓDULO: PROMOÇÕES + COUNTDOWN (Google Sheets → aba 📢 Promocoes)
// ============================================
async function initPromocoes() {
    const data = await loadSheetTab('📢 Promocoes');
    if (!data) return;

    const ativo = (data['Ativo'] || '').toLowerCase().trim() === 'sim';
    if (!ativo) { console.log('Promoções: inativo'); return; }

    function parseDMY(str) {
        if (!str || !String(str).includes('/')) return null;
        const p = String(str).trim().split('/');
        return new Date(+p[2], +p[1] - 1, +p[0]);
    }

    const inicio = parseDMY(data['Data Inicio'] || data['Data Início']);
    const fim    = parseDMY(data['Data Fim']);
    const now    = new Date();
    now.setHours(0, 0, 0, 0);
    if (inicio && now < inicio) { console.log('Promoções: antes do período'); return; }
    const fimDia = fim ? new Date(fim.getFullYear(), fim.getMonth(), fim.getDate(), 23, 59, 59) : null;
    if (fimDia && new Date() > fimDia) { console.log('Promoções: após período'); return; }

    const titulo    = data['Titulo']    || data['Título']    || '';
    const subtitulo = data['Subtitulo'] || data['Subtítulo'] || '';
    const corBanner = data['Cor do Banner'] || '#e11d48';
    const linkWA    = data['Link WA'] || '';
    const doCountdown = (data['Exibir Countdown'] || '').toLowerCase().trim() === 'sim';
    const waNum     = '5521977342290';
    const waMsg     = linkWA || 'vim através do link da bio e gostaria de saber mais sobre a promoção!';
    const waHref    = `https://wa.me/${waNum}?text=${encodeURIComponent('Olá, ' + waMsg)}`;

    // Remove banner anterior
    const oldBanner = document.getElementById('promocao-banner');
    if (oldBanner) oldBanner.remove();

    const banner = document.createElement('div');
    banner.id = 'promocao-banner';
    banner.style.cssText = `background:${corBanner};color:#fff;padding:14px 16px 12px;
        text-align:center;position:relative;overflow:hidden;
        animation:alertaSlideDown .5s cubic-bezier(.23,1,.32,1);`;
    banner.innerHTML = `
        <div style="position:absolute;inset:0;background:rgba(0,0,0,.1);pointer-events:none;"></div>
        <a href="${waHref}" target="_blank" rel="noopener"
           style="position:relative;z-index:1;text-decoration:none;color:#fff;display:block;">
            ${subtitulo ? `<p style="font-size:10px;font-weight:800;letter-spacing:.25em;text-transform:uppercase;opacity:.85;margin:0 0 2px;">${subtitulo}</p>` : ''}
            <p style="font-size:19px;font-weight:900;text-transform:uppercase;letter-spacing:-.02em;margin:0 0 6px;font-family:'Barlow Condensed',sans-serif;">${titulo}</p>
            ${doCountdown && fimDia ? `
            <div id="promo-countdown" style="display:inline-flex;gap:6px;align-items:center;margin-bottom:6px;">
                <span id="cd-dias"  style="font-size:11px;font-weight:800;background:rgba(255,255,255,.2);padding:3px 8px;border-radius:6px;min-width:32px;">--d</span>
                <span style="font-size:10px;opacity:.5;">:</span>
                <span id="cd-horas" style="font-size:11px;font-weight:800;background:rgba(255,255,255,.2);padding:3px 8px;border-radius:6px;min-width:32px;">--h</span>
                <span style="font-size:10px;opacity:.5;">:</span>
                <span id="cd-min"   style="font-size:11px;font-weight:800;background:rgba(255,255,255,.2);padding:3px 8px;border-radius:6px;min-width:32px;">--m</span>
                <span style="font-size:10px;opacity:.5;">:</span>
                <span id="cd-seg"   style="font-size:11px;font-weight:800;background:rgba(255,255,255,.2);padding:3px 8px;border-radius:6px;min-width:32px;">--s</span>
            </div>` : ''}
            <p style="font-size:9px;font-weight:700;margin:2px 0 0;opacity:.8;letter-spacing:.1em;text-transform:uppercase;">
                Toque para aproveitar &nbsp;<i class="fa-brands fa-whatsapp"></i>
            </p>
        </a>
        <button onclick="this.closest('#promocao-banner').remove()"
            style="position:absolute;top:8px;right:10px;background:rgba(255,255,255,.2);border:none;
                   color:#fff;width:24px;height:24px;border-radius:50%;cursor:pointer;z-index:2;
                   display:flex;align-items:center;justify-content:center;font-size:12px;">
            <i class="fa-solid fa-xmark"></i>
        </button>`;

    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.prepend(banner);

    if (doCountdown && fimDia) {
        const fimMs = fimDia.getTime();
        const timerInterval = setInterval(() => {
            const diff = fimMs - Date.now();
            if (diff <= 0 || !document.getElementById('promocao-banner')) {
                clearInterval(timerInterval);
                return;
            }
            const pad = n => String(n).padStart(2, '0');
            const elD = document.getElementById('cd-dias');
            const elH = document.getElementById('cd-horas');
            const elM = document.getElementById('cd-min');
            const elS = document.getElementById('cd-seg');
            if (!elD) return;
            elD.textContent = `${Math.floor(diff / 86400000)}d`;
            elH.textContent = `${pad(Math.floor((diff % 86400000) / 3600000))}h`;
            elM.textContent = `${pad(Math.floor((diff % 3600000) / 60000))}m`;
            elS.textContent = `${pad(Math.floor((diff % 60000) / 1000))}s`;
        }, 1000);
    }
}

// ============================================
// INICIALIZAÃ‡ÃƒO
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializar alternância de tema (Prioridade)
    initThemeToggle();
    initMusicToggle();

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
    await initCatalog();
    initImpactoAmbiental();

    // Módulos Google Sheets dinâmicos (carregamento em paralelo para evitar bloqueio)
    initAlertas().catch(e => console.error('Erro ao iniciar Alertas:', e));
    initHorariosAoVivo().catch(e => console.error('Erro ao iniciar Horários:', e));
    initPromocoes().catch(e => console.error('Erro ao iniciar Promoções:', e));

    // Console log
    console.log(`%c${CONFIG.projectName}`, 'color: #C9A227; font-size: 20px; font-weight: bold;');
    console.log('%cMotochefe Campo Grande', 'color: #C9A227; font-size: 14px;');
    console.log('%cDesenvolvido por AG5 Agência', 'color: #8B5E1E; font-size: 12px;');
});

// ============================================
// LIGHTBOX SIMPLES PARA IMAGEM DO PRODUTO
// ============================================
(function() {
    var overlay = null;

    function criar() {
        if (overlay) return;
        overlay = document.createElement('div');
        overlay.id = 'lb-produto-overlay';
        overlay.style.cssText = [
            'display:none',
            'position:fixed',
            'inset:0',
            'z-index:2147483647',
            'background:rgba(0,0,0,0.95)',
            'align-items:center',
            'justify-content:center',
            'cursor:zoom-out',
        ].join(';');

        var img = document.createElement('img');
        img.id = 'lb-produto-img';
        img.style.cssText = 'max-width:92vw;max-height:88vh;object-fit:contain;border-radius:12px;box-shadow:0 0 80px rgba(0,0,0,0.9);pointer-events:none;';

        var btnFechar = document.createElement('button');
        btnFechar.innerHTML = '&#10005;';
        btnFechar.style.cssText = 'position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
        btnFechar.onclick = fechar;

        overlay.appendChild(img);
        overlay.appendChild(btnFechar);
        overlay.onclick = function(e) { if (e.target === overlay) fechar(); };
        document.addEventListener('keydown', function(e) { if (e.key === 'Escape') fechar(); });
        document.body.appendChild(overlay);
    }

    function fechar() {
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    window._abrirLightboxProduto = function(src, alt) {
        criar();
        document.body.appendChild(overlay); // garante que é sempre o último no DOM
        var img = document.getElementById('lb-produto-img');
        img.src = src;
        img.alt = alt || '';
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };
})();

// ============================================
// EXPORTS (para uso global)
// ============================================
window.openModal = openModal;
window.closeModal = closeModal;
window.openImageModal = openImageModal;
window.downloadVCard = downloadVCard;
window.scrollGallery = scrollGallery;
window.openProductModal = openProductModal;
window.openCategoriaModal = openCategoriaModal;

// ============================================
// LIGHTBOX COM ZOOM
// ============================================
(function() {
    let scale = 1;
    const MIN = 1, MAX = 4, STEP = 0.5;

    function getEls() {
        return {
            lb:    document.getElementById('lightbox'),
            img:   document.getElementById('lightbox-img'),
            stage: document.getElementById('lightbox-stage'),
            cap:   document.getElementById('lightbox-caption'),
        };
    }

    function applyScale(s) {
        scale = Math.min(MAX, Math.max(MIN, s));
        const { img, stage } = getEls();
        img.style.transition = 'transform 0.2s ease';
        img.style.transform = `scale(${scale})`;
        stage.style.cursor = scale > 1 ? 'zoom-out' : 'grab';
    }

    window.openLightbox = function(src, alt) {
        const { lb, img, cap } = getEls();
        if (!lb) return;
        // Move lightbox para o final do body para escapar de qualquer stacking context
        document.body.appendChild(lb);
        scale = 1;
        img.style.transition = 'none';
        img.style.transform = 'scale(1)';
        img.src = src;
        cap.textContent = alt || '';
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        const { lb } = getEls();
        if (lb) lb.style.display = 'none';
        document.body.style.overflow = '';
        scale = 1;
    };

    document.addEventListener('DOMContentLoaded', function() {
        const { lb, img, stage } = getEls();
        if (!lb) return;

        // Fechar ao clicar no fundo
        lb.addEventListener('click', function(e) {
            if (e.target === lb || e.target === stage) window.closeLightbox();
        });

        // Botões zoom
        document.getElementById('lightbox-close').addEventListener('click', window.closeLightbox);
        document.getElementById('lb-zoom-in').addEventListener('click', function(e) { e.stopPropagation(); applyScale(scale + STEP); });
        document.getElementById('lb-zoom-out').addEventListener('click', function(e) { e.stopPropagation(); applyScale(scale - STEP); });
        document.getElementById('lb-zoom-reset').addEventListener('click', function(e) { e.stopPropagation(); applyScale(1); });

        // Scroll para zoom (desktop)
        lb.addEventListener('wheel', function(e) {
            e.preventDefault();
            applyScale(scale + (e.deltaY < 0 ? STEP : -STEP));
        }, { passive: false });

        // Double-tap / double-click para zoom
        let lastTap = 0;
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const now = Date.now();
            if (now - lastTap < 300) {
                applyScale(scale > 1 ? 1 : 2.5);
            }
            lastTap = now;
        });

        // Teclado
        document.addEventListener('keydown', function(e) {
            if (!lb || lb.style.display === 'none') return;
            if (e.key === 'Escape') window.closeLightbox();
            if (e.key === '+' || e.key === '=') applyScale(scale + STEP);
            if (e.key === '-') applyScale(scale - STEP);
        });
    });
})();

