/* ========================================
   HBPC vs Metz Handball — Event Site JS
   ======================================== */

(function () {
    'use strict';

    // --- Navbar scroll effect ---
    var navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // --- Mobile nav toggle ---
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

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

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // --- Countdown ---
    var targetDate = new Date('2026-05-27T20:00:00+02:00').getTime();
    var daysEl = document.getElementById('countdown-days');
    var hoursEl = document.getElementById('countdown-hours');
    var minutesEl = document.getElementById('countdown-minutes');
    var secondsEl = document.getElementById('countdown-seconds');
    var prevValues = { d: '', h: '', m: '', s: '' };

    function animateFlip(el) {
        el.classList.remove('flip');
        void el.offsetWidth;
        el.classList.add('flip');
    }

    function updateCountdown() {
        var now = Date.now();
        var diff = targetDate - now;
        if (diff <= 0) {
            daysEl.textContent = '00'; hoursEl.textContent = '00';
            minutesEl.textContent = '00'; secondsEl.textContent = '00';
            return;
        }
        var days = String(Math.floor(diff / 86400000)).padStart(2, '0');
        var hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        var minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        var seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

        if (days !== prevValues.d) { daysEl.textContent = days; animateFlip(daysEl); prevValues.d = days; }
        if (hours !== prevValues.h) { hoursEl.textContent = hours; animateFlip(hoursEl); prevValues.h = hours; }
        if (minutes !== prevValues.m) { minutesEl.textContent = minutes; animateFlip(minutesEl); prevValues.m = minutes; }
        if (seconds !== prevValues.s) { secondsEl.textContent = seconds; animateFlip(secondsEl); prevValues.s = seconds; }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Scroll animations ---
    var animSelectors = '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale';
    var animElements = document.querySelectorAll(animSelectors);

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        animElements.forEach(function (el) { observer.observe(el); });
    } else {
        animElements.forEach(function (el) { el.classList.add('visible'); });
    }

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // --- Parallax hero ---
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

    // --- Team card flip ---
    document.querySelectorAll('.team-card[role="button"]').forEach(function (card) {
        card.addEventListener('click', function () {
            var isFlipped = card.classList.toggle('flipped');
            card.setAttribute('aria-expanded', isFlipped);
        });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // --- Video fallback ---
    var heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('error', function () {
            heroVideo.style.display = 'none';
        });
    }

    // =============================================
    //  BILLETTERIE — BOOKING ENGINE
    // =============================================

    var cart = {};
    var cartSummary = document.getElementById('cart-summary');
    var cartItemsEl = document.getElementById('cart-items');
    var cartTotalEl = document.getElementById('cart-total-price');

    var ticketLabels = {
        adulte: 'Billet Adulte',
        enfant: 'Billet Enfant',
        famille: 'Pass Famille',
        saison: 'Abonnement Saison',
        commerce: 'Offre Commerçant'
    };

    // --- Qty buttons ---
    document.querySelectorAll('.ticket-card').forEach(function (card) {
        var ticketType = card.dataset.ticket;
        var price = parseFloat(card.dataset.price);
        var qtyEl = card.querySelector('.qty-value');
        var minusBtn = card.querySelector('.qty-minus');
        var plusBtn = card.querySelector('.qty-plus');

        plusBtn.addEventListener('click', function () {
            var qty = parseInt(qtyEl.dataset.qty) + 1;
            if (qty > 10) return;
            qtyEl.dataset.qty = qty;
            qtyEl.textContent = qty;
            cart[ticketType] = { qty: qty, price: price, label: ticketLabels[ticketType] };
            if (qty === 0) delete cart[ticketType];
            card.classList.toggle('selected', qty > 0);
            updateCart();
        });

        minusBtn.addEventListener('click', function () {
            var qty = parseInt(qtyEl.dataset.qty) - 1;
            if (qty < 0) return;
            qtyEl.dataset.qty = qty;
            qtyEl.textContent = qty;
            if (qty === 0) {
                delete cart[ticketType];
            } else {
                cart[ticketType] = { qty: qty, price: price, label: ticketLabels[ticketType] };
            }
            card.classList.toggle('selected', qty > 0);
            updateCart();
        });
    });

    function getTotal() {
        var total = 0;
        for (var key in cart) {
            total += cart[key].qty * cart[key].price;
        }
        return total;
    }

    function formatPrice(n) {
        return n.toFixed(2).replace('.', ',') + ' €';
    }

    function updateCart() {
        var keys = Object.keys(cart);
        if (keys.length === 0) {
            cartSummary.style.display = 'none';
            return;
        }
        cartSummary.style.display = 'block';

        var html = '';
        keys.forEach(function (key) {
            var item = cart[key];
            var lineTotal = item.qty * item.price;
            html += '<div class="cart-item"><span>' + item.qty + 'x ' + item.label + '</span><span class="cart-item-price">' + (item.price === 0 ? 'Gratuit' : formatPrice(lineTotal)) + '</span></div>';
        });
        cartItemsEl.innerHTML = html;
        cartTotalEl.textContent = formatPrice(getTotal());
    }

    // --- Step navigation ---
    function showStep(n) {
        document.querySelectorAll('.booking-step').forEach(function (step) {
            step.classList.remove('active');
        });
        var target = document.getElementById('booking-step-' + n);
        if (target) {
            target.classList.add('active');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Step 1 -> 2
    var btnToStep2 = document.getElementById('btn-to-step2');
    if (btnToStep2) {
        btnToStep2.addEventListener('click', function () {
            if (Object.keys(cart).length === 0) return;
            // Build recap for form
            var recapHtml = '<strong>Votre sélection :</strong><br>';
            for (var key in cart) {
                var item = cart[key];
                recapHtml += item.qty + 'x ' + item.label;
                recapHtml += item.price === 0 ? ' — Gratuit' : ' — ' + formatPrice(item.qty * item.price);
                recapHtml += '<br>';
            }
            recapHtml += '<br><strong>Total : ' + formatPrice(getTotal()) + '</strong>';
            document.getElementById('form-recap').innerHTML = recapHtml;
            document.getElementById('payment-total-amount').textContent = formatPrice(getTotal());
            showStep(2);
        });
    }

    // Step 2 -> 1
    var btnBackStep1 = document.getElementById('btn-back-step1');
    if (btnBackStep1) {
        btnBackStep1.addEventListener('click', function () { showStep(1); });
    }

    // Step 2 -> 3 (form validation)
    var bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            bookingForm.querySelectorAll('[required]').forEach(function (input) {
                input.classList.remove('invalid');
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    valid = false;
                }
            });
            var emailInput = document.getElementById('book-email');
            if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.classList.add('invalid');
                valid = false;
            }
            if (!valid) return;
            showStep(3);
        });
    }

    // Step 3 -> 2
    var btnBackStep2 = document.getElementById('btn-back-step2');
    if (btnBackStep2) {
        btnBackStep2.addEventListener('click', function () { showStep(2); });
    }

    // Payment method toggle
    document.querySelectorAll('.pay-method').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.pay-method').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var cardFields = document.getElementById('card-fields');
            if (btn.dataset.method === 'card') {
                cardFields.style.display = 'block';
            } else {
                cardFields.style.display = 'none';
            }
        });
    });

    // Card number formatting
    var cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function () {
            var v = this.value.replace(/\D/g, '').substring(0, 16);
            var formatted = v.replace(/(.{4})/g, '$1 ').trim();
            this.value = formatted;
        });
    }

    // Expiry formatting
    var cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function () {
            var v = this.value.replace(/\D/g, '').substring(0, 4);
            if (v.length >= 3) {
                this.value = v.substring(0, 2) + ' / ' + v.substring(2);
            } else {
                this.value = v;
            }
        });
    }

    // Payment form submit
    var paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var activeMethod = document.querySelector('.pay-method.active');
            var method = activeMethod ? activeMethod.dataset.method : 'card';

            if (method === 'card') {
                var cardNum = document.getElementById('card-number');
                var expiry = document.getElementById('card-expiry');
                var cvc = document.getElementById('card-cvc');
                var valid = true;
                [cardNum, expiry, cvc].forEach(function (el) {
                    el.classList.remove('invalid');
                    if (!el.value.trim()) { el.classList.add('invalid'); valid = false; }
                });
                if (cardNum.value.replace(/\s/g, '').length < 16) { cardNum.classList.add('invalid'); valid = false; }
                if (!valid) return;
            }

            // Simulate payment processing
            var btnPayText = document.querySelector('.btn-pay-text');
            var btnPayLoading = document.querySelector('.btn-pay-loading');
            var btnPay = document.getElementById('btn-pay');
            btnPayText.style.display = 'none';
            btnPayLoading.style.display = 'inline-flex';
            btnPay.disabled = true;
            btnPay.style.opacity = '0.7';

            setTimeout(function () {
                btnPayText.style.display = 'inline';
                btnPayLoading.style.display = 'none';
                btnPay.disabled = false;
                btnPay.style.opacity = '1';

                // Build confirmation
                var firstName = document.getElementById('book-firstname').value;
                var lastName = document.getElementById('book-lastname').value;
                var email = document.getElementById('book-email').value;

                document.getElementById('confirm-name').textContent = firstName;
                document.getElementById('confirm-email').textContent = email;

                var recapHtml = '';
                for (var key in cart) {
                    var item = cart[key];
                    recapHtml += item.qty + 'x ' + item.label;
                    recapHtml += item.price === 0 ? ' — Gratuit' : ' — ' + formatPrice(item.qty * item.price);
                    recapHtml += '<br>';
                }
                recapHtml += '<br><strong>Total payé : ' + formatPrice(getTotal()) + '</strong>';
                recapHtml += '<br>Réservé au nom de : <strong>' + firstName + ' ' + lastName + '</strong>';
                document.getElementById('confirm-recap').innerHTML = recapHtml;

                showStep(4);
            }, 2000);
        });
    }

    // New booking
    var btnNewBooking = document.getElementById('btn-new-booking');
    if (btnNewBooking) {
        btnNewBooking.addEventListener('click', function () {
            // Reset everything
            cart = {};
            document.querySelectorAll('.qty-value').forEach(function (el) {
                el.dataset.qty = '0';
                el.textContent = '0';
            });
            document.querySelectorAll('.ticket-card').forEach(function (c) {
                c.classList.remove('selected');
            });
            cartSummary.style.display = 'none';
            bookingForm.reset();
            paymentForm.reset();
            document.getElementById('card-fields').style.display = 'block';
            document.querySelectorAll('.pay-method').forEach(function (b, i) {
                b.classList.toggle('active', i === 0);
            });
            showStep(1);
        });
    }

})();
