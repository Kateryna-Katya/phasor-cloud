document.addEventListener('DOMContentLoaded', () => {
    
    // ==============================================
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE)
    // ==============================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==============================================
    // 2. ИНТЕРАКТИВНЫЙ КУРСОР (NEON GLOW)
    // ==============================================
    const cursorGlow = document.querySelector('.cursor-glow');

    // Включаем только на устройствах с мышью (не тачскрин)
    if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        
        // GSAP QuickSetter для максимальной производительности (без лагов)
        // Если GSAP не подключен, этот блок просто не сработает
        if (typeof gsap !== 'undefined') {
            const setX = gsap.quickSetter(cursorGlow, "x", "px");
            const setY = gsap.quickSetter(cursorGlow, "y", "px");

            window.addEventListener('mousemove', (e) => {
                // Показываем курсор при первом движении
                if (!cursorGlow.classList.contains('active')) {
                    cursorGlow.classList.add('active');
                }
                
                // Перемещаем пятно света
                setX(e.clientX);
                setY(e.clientY);
            });
        }
    }

    // ==============================================
    // 3. UI ЛОГИКА: МЕНЮ И ХЕДЕР
    // ==============================================
    const header = document.querySelector('.header');
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__link');

    // Открытие/закрытие мобильного меню
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Смена иконки бургера (опционально)
            const icon = burger.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    // Закрытие меню при клике на ссылку
    if (navLinks.length > 0 && nav) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                // Возвращаем иконку меню
                const icon = burger.querySelector('i');
                if(icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // Эффект "Стекла" у хедера при скролле
    if (header) {
        const updateHeaderStyle = () => {
            if (window.scrollY > 20) {
                header.style.background = 'rgba(10, 15, 13, 0.95)';
                header.style.borderBottom = '1px solid rgba(0, 255, 149, 0.15)';
                header.style.boxShadow = '0 4px 30px rgba(0, 255, 149, 0.05)';
            } else {
                header.style.background = 'rgba(10, 15, 13, 0.7)';
                header.style.borderBottom = '1px solid rgba(0, 255, 149, 0.05)';
                header.style.boxShadow = 'none';
            }
        };
        window.addEventListener('scroll', updateHeaderStyle);
        updateHeaderStyle();
    }

    // ==============================================
    // 4. ГЛАВНЫЕ АНИМАЦИИ (HERO + GSAP)
    // ==============================================
    if (typeof gsap !== 'undefined') {
        const heroText = document.querySelector('.hero__text-wrapper');
        const heroBtns = document.querySelectorAll('.hero .btn'); // Точечно выбираем кнопки в hero
        const heroScroll = document.querySelector('.hero__scroll');

        // Устанавливаем начальные значения (скрываем), только если JS загрузился
        if (heroText) gsap.set(heroText, { y: 30, opacity: 0 });
        if (heroBtns.length > 0) gsap.set(heroBtns, { y: 20, opacity: 0 });
        if (heroScroll) gsap.set(heroScroll, { opacity: 0 });

        // Таймлайн появления
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (heroText) {
            tl.to(heroText, { y: 0, opacity: 1, duration: 1.2, delay: 0.2 });
        }
        if (heroBtns.length > 0) {
            tl.to(heroBtns, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 }, "-=0.8");
        }
        if (heroScroll) {
            tl.to(heroScroll, { opacity: 1, duration: 1 }, "-=0.5");
        }
    }

    // ==============================================
    // 5. CANVAS: НЕЙРОСЕТЬ (ЧАСТИЦЫ)
    // ==============================================
    const canvas = document.getElementById('hero-canvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Настройки
        const properties = {
            particleColor: 'rgba(0, 255, 149, 0.8)', // Neon Green
            lineColor: 'rgba(0, 255, 149, 1)',
            particleRadius: 2,
            particleCount: window.innerWidth < 768 ? 35 : 70, // Меньше на телефоне
            lineLength: 150, // Дальность соединения
            particleSpeed: 0.4
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.velocityX = (Math.random() - 0.5) * properties.particleSpeed;
                this.velocityY = (Math.random() - 0.5) * properties.particleSpeed;
            }
            position() {
                // Отталкивание от границ
                if (this.x + this.velocityX > width && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0) this.velocityX *= -1;
                if (this.y + this.velocityY > height && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0) this.velocityY *= -1;
                this.x += this.velocityX;
                this.y += this.velocityY;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
                ctx.fillStyle = properties.particleColor;
                ctx.fill();
            }
        }

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < properties.particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawLines() {
            let x1, y1, x2, y2, length, opacity;
            for (let i = 0; i < particles.length; i++) {
                for (let j = 0; j < particles.length; j++) {
                    x1 = particles[i].x;
                    y1 = particles[i].y;
                    x2 = particles[j].x;
                    y2 = particles[j].y;
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    
                    if (length < properties.lineLength) {
                        opacity = 1 - length / properties.lineLength;
                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = `rgba(0, 255, 149, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                }
            }
        }

        function loop() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].position();
                particles[i].draw();
            }
            drawLines();
            requestAnimationFrame(loop);
        }

        initCanvas();
        loop();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Пересоздаем частицы только при сильном изменении, 
            // но для простоты здесь можно просто обновить размеры
        });
    }

    // ==============================================
    // 6. SCROLL ANIMATIONS (ПОЯВЛЕНИЕ БЛОКОВ)
    // ==============================================
    const scrollElements = document.querySelectorAll("[data-scroll]");

    // Используем IntersectionObserver для производительности
    const observerOptions = {
        threshold: 0.1, // Срабатывает, когда 10% элемента видно
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target); // Анимируем только один раз
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));


    // ==============================================
    // 7. ЛОГИКА ФОРМЫ (CAPTCHA + ОТПРАВКА)
    // ==============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Генерация простого примера
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const sum = num1 + num2;
        const captchaQ = document.getElementById('captchaQuestion');
        
        if (captchaQ) {
            captchaQ.textContent = `${num1} + ${num2} = ?`;
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Проверка капчи
            const userAnswer = document.getElementById('captchaAnswer');
            if (userAnswer && parseInt(userAnswer.value) !== sum) {
                alert('Ошибка в вычислении! Попробуйте снова.');
                userAnswer.value = '';
                return;
            }

            // Имитация отправки (AJAX)
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Отправка...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                // Скрываем форму, показываем успех
                contactForm.style.display = 'none';
                const successMsg = document.getElementById('formSuccess');
                if (successMsg) successMsg.style.display = 'block';
                
                // Очистка (для следующего раза, если нужно)
                contactForm.reset();
            }, 1500);
        });
    }


    // ==============================================
    // 8. COOKIE POPUP
    // ==============================================
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');

    if (cookiePopup && acceptBtn) {
        // Проверяем localStorage
        if (!localStorage.getItem('phasorCookiesAccepted')) {
            setTimeout(() => {
                cookiePopup.classList.add('active');
            }, 2500); // Показываем через 2.5 сек после захода
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('phasorCookiesAccepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }
});