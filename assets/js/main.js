/**
 * Digital Plotter - Scripts Principais da Aplicação
 *
 * Arquitetura modular com princípios de Clean Code:
 * - Funções pequenas com responsabilidade única (SRP)
 * - Nomes claros e autoexplicativos
 * - Programação defensiva (evita exceções em elementos ausentes)
 * - Listeners de scroll otimizados com { passive: true }
 * - Acessibilidade (ARIA e navegação por teclado)
 */

(function () {
  'use strict';

  /**
   * Gerencia a aplicação da classe '.scrolled' ao cabeçalho durante a rolagem
   */
  function initHeaderScrolled() {
    const header = document.querySelector('#header');
    if (!header) return;

    const isSticky =
      header.classList.contains('scroll-up-sticky') ||
      header.classList.contains('sticky-top') ||
      header.classList.contains('fixed-top');

    if (!isSticky) return;

    const handleScroll = () => {
      document.body.classList.toggle('scrolled', window.scrollY > 100);
    };

    window.addEventListener('load', handleScroll);
    document.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Gerencia o menu de navegação em telas mobile
   */
  function initMobileNav() {
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelectorAll('#navmenu a');

    if (!toggleButton) return;

    const toggleMobileNav = () => {
      const isExpanded = document.body.classList.toggle('mobile-nav-active');
      toggleButton.classList.toggle('bi-list', !isExpanded);
      toggleButton.classList.toggle('bi-x', isExpanded);
      toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    };

    toggleButton.addEventListener('click', toggleMobileNav);

    // Fecha o menu mobile ao clicar em qualquer link interno
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          toggleMobileNav();
        }
      });
    });

    // Fecha o menu mobile com a tecla Escape para acessibilidade
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        document.body.classList.contains('mobile-nav-active')
      ) {
        toggleMobileNav();
      }
    });

    // Alias para compatibilidade retroativa
    window.mobileNavToogle = toggleMobileNav;
  }

  /**
   * Gerencia submenus suspensos (dropdowns) na navegação móvel
   */
  function initNavDropdowns() {
    const dropdownToggles = document.querySelectorAll(
      '.navmenu .toggle-dropdown'
    );

    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const parentLi = this.parentNode;
        if (!parentLi) return;

        parentLi.classList.toggle('active');

        const nextSubmenu = parentLi.nextElementSibling;
        if (nextSubmenu) {
          nextSubmenu.classList.toggle('dropdown-active');
        }
      });
    });
  }

  /**
   * Atualiza o link ativo da barra de navegação conforme a posição de scroll (Scrollspy)
   */
  function initScrollSpy() {
    const navLinks = document.querySelectorAll('#navmenu a');
    if (navLinks.length === 0) return;

    const updateActiveNavOnScroll = () => {
      const scrollPosition = window.scrollY + 200;

      navLinks.forEach((navLink) => {
        if (!navLink.hash || navLink.hash === '#') return;

        const section = document.querySelector(navLink.hash);
        if (!section) return;

        const isCurrentSection =
          scrollPosition >= section.offsetTop &&
          scrollPosition <= section.offsetTop + section.offsetHeight;

        if (isCurrentSection) {
          navLinks.forEach((item) => item.classList.remove('active'));
          navLink.classList.add('active');
        }
      });
    };

    window.addEventListener('load', updateActiveNavOnScroll);
    document.addEventListener('scroll', updateActiveNavOnScroll, {
      passive: true,
    });
  }

  /**
   * Gerencia a remoção suave do elemento de pré-carregamento (preloader)
   */
  function initPreloader() {
    const preloader = document.querySelector('#preloader');
    if (!preloader) return;

    const removePreloader = () => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => {
        preloader.remove();
      }, 300);
    };

    if (document.readyState === 'complete') {
      removePreloader();
    } else {
      window.addEventListener('load', removePreloader);
    }
  }

  /**
   * Gerencia o botão flutuante de retorno ao topo
   */
  function initScrollTop() {
    const scrollTopButton = document.querySelector('.scroll-top');
    if (!scrollTopButton) return;

    const toggleButtonVisibility = () => {
      scrollTopButton.classList.toggle('active', window.scrollY > 100);
    };

    scrollTopButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    window.addEventListener('load', toggleButtonVisibility);
    document.addEventListener('scroll', toggleButtonVisibility, {
      passive: true,
    });
  }

  /**
   * Gerencia a troca interativa de imagem nos diferenciais (Features)
   * Garante suporte para dispositivos touch e navegação via teclado
   */
  function initFeatureImageSwitcher() {
    const imageDisplay = document.querySelector('#img-display');
    const featureBoxes = document.querySelectorAll(
      '.feature-box.hover-trigger'
    );

    if (!imageDisplay || featureBoxes.length === 0) return;

    const imageMap = {
      'img-1': 'assets/img/qualidade.png',
      'img-2': 'assets/img/rapido.png',
      'img-3': 'assets/img/atende.png',
      'img-4': 'assets/img/tecnologia.png',
    };

    featureBoxes.forEach((box) => {
      const targetClass = Object.keys(imageMap).find((className) =>
        box.classList.contains(className)
      );

      if (!targetClass) return;

      const applyImage = () => {
        imageDisplay.style.backgroundImage = `url('${imageMap[targetClass]}')`;
      };

      box.addEventListener('mouseenter', applyImage);
      box.addEventListener('focus', applyImage);
      box.addEventListener('click', applyImage);
    });
  }

  /**
   * Inicializa acordeões da seção de FAQ (se existentes)
   */
  function initFaqAccordion() {
    const faqTriggers = document.querySelectorAll(
      '.faq-item h3, .faq-item .faq-toggle'
    );

    faqTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const parentItem = trigger.closest('.faq-item');
        if (parentItem) {
          parentItem.classList.toggle('faq-active');
        }
      });
    });
  }

  /**
   * Inicializa bibliotecas de terceiros (AOS e GLightbox) com proteção defensiva
   */
  function initThirdPartyVendors() {
    // Inicialização da biblioteca de animações AOS
    if (typeof AOS !== 'undefined') {
      window.addEventListener('load', () => {
        AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false,
        });
      });
    }

    // Inicialização da galeria lightbox
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox',
      });
    }
  }

  /**
   * Ponto de entrada (Entrypoint)
   */
  function bootstrap() {
    initHeaderScrolled();
    initMobileNav();
    initNavDropdowns();
    initScrollSpy();
    initPreloader();
    initScrollTop();
    initFeatureImageSwitcher();
    initFaqAccordion();
    initThirdPartyVendors();
  }

  // Executa imediatamente ou quando o DOM estiver pronto
  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }
})();
