/**
 * Digital Plotter - Manipulação e Envio de Contato via WhatsApp
 *
 * Responsável por validar as entradas do formulário de contato, estruturar
 * a mensagem cordial e redirecionar o cliente para a API oficial do WhatsApp.
 *
 * Segue padrões de Clean Code, SRP (Single Responsibility Principle) e
 * compatibilidade retroativa com chamadas legadas e inline handlers.
 */

(function () {
  'use strict';

  /**
   * Configurações da aplicação de contato
   * @readonly
   */
  const CONTACT_CONFIG = Object.freeze({
    whatsappPhone: '5561995052995',
    formSelector: '#contact-form',
    fields: {
      name: '#sendername',
      email: '#to',
      subject: '#subject',
      message: '#message',
    },
  });

  /**
   * Formata os dados de contato em uma mensagem legível para o WhatsApp
   * @param {Object} payload - Dados do formulário
   * @param {string} payload.name - Nome do remetente
   * @param {string} payload.email - E-mail de retorno
   * @param {string} payload.subject - Assunto do contato
   * @param {string} payload.message - Mensagem detalhada
   * @returns {string} Texto formatado com emojis e quebras de linha
   */
  function formatWhatsAppMessage({ name, email, subject, message }) {
    return (
      'Olá, equipe Digital Plotter! Tudo bem? 👋\n\n' +
      'Vim através do site e gostaria de solicitar um atendimento:\n\n' +
      `👤 *Nome:* ${name}\n` +
      `📧 *E-mail:* ${email}\n` +
      `📌 *Assunto:* ${subject}\n\n` +
      `💬 *Mensagem:*\n${message}`
    );
  }

  /**
   * Cria a URL segura para iniciar conversa no WhatsApp Web ou App
   * @param {string} phone - Número com DDI e DDD
   * @param {string} text - Mensagem a ser enviada
   * @returns {string} URL devidamente codificada
   */
  function buildWhatsAppUrl(phone, text) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Obtém os valores sanitizados dos campos do formulário
   * @param {HTMLFormElement} form
   * @returns {{ name: string, email: string, subject: string, message: string }}
   */
  function getFormData(form) {
    const getValue = (selector) => {
      const input = form.querySelector(selector);
      return input ? input.value.trim() : '';
    };

    return {
      name: getValue(CONTACT_CONFIG.fields.name),
      email: getValue(CONTACT_CONFIG.fields.email),
      subject: getValue(CONTACT_CONFIG.fields.subject),
      message: getValue(CONTACT_CONFIG.fields.message),
    };
  }

  /**
   * Processa a submissão do formulário de contato
   * @param {Event} [event] - Evento de submit do formulário
   */
  function sendWhatsAppMessage(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const form = document.querySelector(CONTACT_CONFIG.formSelector);
    if (!form) return;

    // Validação nativa do navegador (HTML5 constraints)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = getFormData(form);

    // Validação de segurança defensiva
    if (!data.name || !data.email || !data.subject || !data.message) {
      form.reportValidity();
      return;
    }

    const formattedMessage = formatWhatsAppMessage(data);
    const whatsappUrl = buildWhatsAppUrl(CONTACT_CONFIG.whatsappPhone, formattedMessage);

    // Abre a conversa com segurança (proteção contra tabnabbing)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Reseta os campos após envio com sucesso
    form.reset();
  }

  // Exportação no escopo global para retrocompatibilidade
  window.sendWhatsAppMessage = sendWhatsAppMessage;
  window.sendMmail = sendWhatsAppMessage;

  // Inicialização no ciclo DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector(CONTACT_CONFIG.formSelector);
    if (contactForm) {
      contactForm.addEventListener('submit', sendWhatsAppMessage);
    }
  });
})();
