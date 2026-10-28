(function () {
    'use strict';

    function getHeaderOffset() {
        const header = document.querySelector('header');
        if (!header) return 20;
        return Math.ceil(header.getBoundingClientRect().height + 20);
    }

    function closeMobileNavigation() {
        document.body.classList.remove('qt-nav-open');
        document.querySelectorAll('.nav-links.active, .nav-menu.active, header nav.active').forEach((menu) => {
            menu.classList.remove('active');
        });

        document.querySelectorAll('.mobile-toggle').forEach((button) => {
            button.setAttribute('aria-expanded', 'false');
        });
    }

    document.addEventListener('click', function (event) {
        const link = event.target.closest('a[href*="#"]');
        if (!link) return;

        const url = new URL(link.href, window.location.href);
        const samePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
        if (!samePage || !url.hash || url.hash === '#') return;

        let target;
        try {
            target = document.querySelector(url.hash);
        } catch (error) {
            return;
        }

        if (!target) return;

        event.preventDefault();
        closeMobileNavigation();

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

        window.scrollTo({
            top: Math.max(0, top),
            behavior: reduceMotion ? 'auto' : 'smooth'
        });

        history.pushState(null, '', url.hash);
    });
})();
