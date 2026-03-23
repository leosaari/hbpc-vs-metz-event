/* ========================================
   HBPC vs Metz Handball — Event Site JS
   ======================================== */

(function () {
    'use strict';

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Ouvrir le menu');
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // --- Countdown to 27 May 2025 20:00 (Europe/Paris = UTC+2 in summer) ---
    var targetDate = new Date('2026-05-27T20:00:00+02:00').getTime();
    var daysEl = document.getElementById('countdown-days');
    var hoursEl = document.getElementById('countdown-hours');
    var minutesEl = document.getElementById('countdown-minutes');
    var secondsEl = document.getElementById('countdown-seconds');

    var prevValues = { d: '', h: '', m: '', s: '' };

    function animateFlip(el) {
        el.classList.remove('flip');
        void el.offsetWidth; // force reflow
        el.classList.add('flip');
    }

    function updateCountdown() {
        var now = Date.now();
        var diff = targetDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        var days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        var hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        var minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        var seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

        if (days !== prevValues.d) { daysEl.textContent = days; animateFlip(daysEl); prevValues.d = days; }
        if (hours !== prevValues.h) { hoursEl.textContent = hours; animateFlip(hoursEl); prevValues.h = hours; }
        if (minutes !== prevValues.m) { minutesEl.textContent = minutes; animateFlip(minutesEl); prevValues.m = minutes; }
        if (seconds !== prevValues.s) { secondsEl.textContent = seconds; animateFlip(secondsEl); prevValues.s = seconds; }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Scroll animations (IntersectionObserver) ---
    var animSelectors = '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale';
    var animElements = document.querySelectorAll(animSelectors);

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        animElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        animElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = 70;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Parallax on hero ---
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
                heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
            }
        }, { passive: true });
    }

    // --- Video fallback ---
    var heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('error', function () {
            heroVideo.style.display = 'none';
        });
    }
})();
