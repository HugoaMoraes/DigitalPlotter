/**
 * Digital Plotter - Envio de Contato via WhatsApp
 */

(function () {
  'use strict';

  // Configuração do WhatsApp da Digital Plotter
  const WHATSAPP_PHONE = '5561995052995';

  /**
   * Processa o formulário de contato e abre a conversa no WhatsApp em uma nova aba
   * @param {Event} event - Evento de submit do formulário
   */
  function sendWhatsAppMessage(event) {
    if (event) event.preventDefault();

    const form = document.querySelector('#contact-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const sendername = (document.querySelector('#sendername')?.value || '').trim();
    const to = (document.querySelector('#to')?.value || '').trim();
    const subject = (document.querySelector('#subject')?.value || '').trim();
    const message = (document.querySelector('#message')?.value || '').trim();

    // Validação de segurança dos campos
    if (!sendername || !to || !subject || !message) {
      if (form) form.reportValidity();
      return;
    }

    // Mensagem cordial, amigável e profissional para o cliente enviar
    const textFormatted =
      `Olá, equipe Digital Plotter! Tudo bem? 👋\n\n` +
      `Vim através do site e gostaria de solicitar um atendimento:\n\n` +
      `👤 *Nome:* ${sendername}\n` +
      `📧 *E-mail:* ${to}\n` +
      `📌 *Assunto:* ${subject}\n\n` +
      `💬 *Mensagem:*\n${message}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(textFormatted)}`;

    // Abre a conversa no WhatsApp diretamente em uma nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Limpa o formulário após a abertura
    if (form) {
      form.reset();
    }
  }

  // Exporta globalmente para compatibilidade com onsubmit no HTML e chamadas legadas
  window.sendWhatsAppMessage = sendWhatsAppMessage;
  window.sendMmail = sendWhatsAppMessage;

  document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', sendWhatsAppMessage);
    }
  });
})();
