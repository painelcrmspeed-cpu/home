'use strict';

const AnimationController = (() => {
  const ANIMATION_MAP = {
    'fade-up': { from: 'translateY(28px)', opacity: 0 },
    'fade-down': { from: 'translateY(-28px)', opacity: 0 },
    'scale-up': { from: 'scale(0.96)', opacity: 0 },
  };

  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.style.opacity = '1');
      return;
    }

    elements.forEach(el => {
      const type = el.dataset.animate || 'fade-up';
      const delay = el.dataset.delay || 0;
      const anim = ANIMATION_MAP[type] || ANIMATION_MAP['fade-up'];

      el.style.opacity = anim.opacity;
      el.style.transform = anim.from;
      el.style.transition = `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.opacity = '1';
          el.style.transform = 'none';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  function initFaqAccordion() {
    const questions = document.querySelectorAll('.faq__question');

    questions.forEach(btn => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const answerId = btn.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);

        questions.forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const otherId = other.getAttribute('aria-controls');
            const otherAnswer = document.getElementById(otherId);
            if (otherAnswer) {
              otherAnswer.hidden = true;
              otherAnswer.style.maxHeight = '0';
            }
            other.closest('.faq__item').classList.remove('faq__item--open');
          }
        });

        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          answer.hidden = true;
          answer.style.maxHeight = '0';
          btn.closest('.faq__item').classList.remove('faq__item--open');
        } else {
          btn.setAttribute('aria-expanded', 'true');
          answer.hidden = false;
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.closest('.faq__item').classList.add('faq__item--open');
        }
      });
    });
  }

  function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    const amounts = document.querySelectorAll('.pricing__amount');
    const labelMonthly = document.getElementById('toggle-monthly');
    const labelAnnual = document.getElementById('toggle-annual');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isAnnual = toggle.getAttribute('aria-checked') === 'true';

      if (isAnnual) {
        toggle.setAttribute('aria-checked', 'false');
        toggle.classList.remove('pricing__switch--active');
        labelMonthly.classList.add('pricing__toggle-label--active');
        labelAnnual.classList.remove('pricing__toggle-label--active');
        amounts.forEach(el => {
          el.textContent = el.dataset.monthly;
        });
      } else {
        toggle.setAttribute('aria-checked', 'true');
        toggle.classList.add('pricing__switch--active');
        labelAnnual.classList.add('pricing__toggle-label--active');
        labelMonthly.classList.remove('pricing__toggle-label--active');
        amounts.forEach(el => {
          el.textContent = el.dataset.annual;
        });
      }
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  function init() {
    initScrollReveal();
    initFaqAccordion();
    initPricingToggle();
    initSmoothScroll();
  }

  return { init };
})();
