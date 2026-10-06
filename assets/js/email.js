/**
 * Digital Plotter - Envio de Contato via WhatsApp
 * Arquivo mantido para compatibilidade retroativa e cache de navegadores.
 */

(function () {
  'use strict';

  // Se contact.js já tiver sido carregado, reutiliza a implementação existente
  if (typeof window.sendWhatsAppMessage === 'function') {
    return;
  }

  const WHATSAPP_PHONE = '5561995052995';

  /**
   * Processa o envio da mensagem para o WhatsApp
   * @param {Event} [event]
   */
  function sendWhatsAppMessage(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const form = document.querySelector('#contact-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const senderName = (document.querySelector('#sendername')?.value || '').trim();
    const senderEmail = (document.querySelector('#to')?.value || '').trim();
    const subject = (document.querySelector('#subject')?.value || '').trim();
    const message = (document.querySelector('#message')?.value || '').trim();

    if (!senderName || !senderEmail || !subject || !message) {
      if (form) form.reportValidity();
      return;
    }

    const textFormatted =
      'Olá, equipe Digital Plotter! Tudo bem? 👋\n\n' +
      'Vim através do site e gostaria de solicitar um atendimento:\n\n' +
      `👤 *Nome:* ${senderName}\n` +
      `📧 *E-mail:* ${senderEmail}\n` +
      `📌 *Assunto:* ${subject}\n\n` +
      `💬 *Mensagem:*\n${message}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(textFormatted)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (form) {
      form.reset();
    }
  }

  window.sendWhatsAppMessage = sendWhatsAppMessage;
  window.sendMmail = sendWhatsAppMessage;

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', sendWhatsAppMessage);
    }
  });
})();
