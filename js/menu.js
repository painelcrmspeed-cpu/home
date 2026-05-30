'use strict';

const MenuController = (() => {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('menu-toggle');

  let isOpen = false;
  let lastScroll = 0;

  function openMenu() {
    isOpen = true;
    navbar.classList.add('nav--open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    navbar.classList.remove('nav--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('nav--scrolled');
    } else {
      navbar.classList.remove('nav--scrolled');
    }

    if (currentScroll > lastScroll && currentScroll > 300 && !isOpen) {
      navbar.classList.add('nav--hidden');
    } else {
      navbar.classList.remove('nav--hidden');
    }

    lastScroll = currentScroll;
  }

  function handleNavLinkClick(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    if (isOpen) closeMenu();
  }

  function init() {
    if (!toggle || !navbar) return;

    toggle.addEventListener('click', toggleMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (isOpen && !navbar.contains(e.target)) closeMenu();
    });

    navbar.addEventListener('click', handleNavLinkClick);

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();
  }

  return { init };
})();
