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

    if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        if (typeof gsap !== 'undefined') {
            const setX = gsap.quickSetter(cursorGlow, "x", "px");
            const setY = gsap.quickSetter(cursorGlow, "y", "px");

            window.addEventListener('mousemove', (e) => {
                if (!cursorGlow.classList.contains('active')) {
                    cursorGlow.classList.add('active');
                }
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

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Смена иконки
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

    if (navLinks.length > 0 && nav) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = burger.querySelector('i');
                if(icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

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
    // 4. ГЛАВНЫЕ АНИМАЦИИ (GSAP)
    // ==============================================
    if (typeof gsap !== 'undefined') {
        const heroText = document.querySelector('.hero__text-wrapper');
        const heroBtns = document.querySelectorAll('.hero .btn');
        const heroScroll = document.querySelector('.hero__scroll');

        if (heroText) gsap.set(heroText, { y: 30, opacity: 0 });
        if (heroBtns.length > 0) gsap.set(heroBtns, { y: 20, opacity: 0 });
        if (heroScroll) gsap.set(heroScroll, { opacity: 0 });

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
    // 5. CANVAS: НЕЙРОСЕТЬ
    // ==============================================
    const canvas = document.getElementById('hero-canvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const properties = {
            particleColor: 'rgba(0, 255, 149, 0.8)',
            lineColor: 'rgba(0, 255, 149, 1)',
            particleRadius: 2,
            particleCount: window.innerWidth < 768 ? 35 : 70,
            lineLength: 150,
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
        });
    }

    // ==============================================
    // 6. SCROLL ANIMATIONS
    // ==============================================
    const scrollElements = document.querySelectorAll("[data-scroll]");
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));


    // ==============================================
    // 7. ЛОГИКА ФОРМЫ (ВАЛИДАЦИЯ + CAPTCHA)
    // ==============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        
        // --- ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ) ---
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Удаляем всё, что не является цифрой или плюсом (для кода страны)
                // Если нужно строго БЕЗ плюса, используйте: /[^0-9]/g
                this.value = this.value.replace(/[^0-9+]/g, '');
            });
        }
        // -----------------------------------------

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
                alert('Неверное решение примера! Попробуйте снова.');
                userAnswer.value = '';
                return;
            }

            // Имитация отправки
            const btn = contactForm.querySelector('button[type="submit"]');
            
            btn.textContent = 'Отправка...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            setTimeout(() => {
                contactForm.style.display = 'none';
                const successMsg = document.getElementById('formSuccess');
                if (successMsg) successMsg.style.display = 'block';
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
        if (!localStorage.getItem('phasorCookiesAccepted')) {
            setTimeout(() => {
                cookiePopup.classList.add('active');
            }, 2500);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('phasorCookiesAccepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }
});