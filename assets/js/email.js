function sendMmail(event) {
  if (event) event.preventDefault();

  // Validação simples dos campos
  const sendername = document.querySelector('#sendername').value.trim();
  const to = document.querySelector('#to').value.trim();
  const subject = document.querySelector('#subject').value.trim();
  const message = document.querySelector('#message').value.trim();

  // Regex simples para validar e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!sendername || !to || !subject || !message) {
    showAlert('Por favor, preencha todos os campos.', 'error');
    return;
  }
  if (!emailRegex.test(to)) {
    showAlert('Por favor, insira um e-mail válido.', 'error');
    return;
  }

  emailjs.init('ftR4Xn6aQpYiORW9n');

  var params = {
    sendername: sendername,
    to: to,
    subject: subject,
    replyto: to,
    message: message,
  };

  var service = 'service_escbpxe';
  var template = 'template_0d9pm4m';

  emailjs.send(service, template, params).then(
    function (response) {
      showAlert('Tudo certo! Seu e-mail foi enviado com sucesso.', 'success');
      document.querySelector('#sendername').value = '';
      document.querySelector('#to').value = '';
      document.querySelector('#subject').value = '';
      document.querySelector('#message').value = '';
    },
    function (error) {
      showAlert(
        'Ops! O e-mail não foi enviado. Tente novamente em instantes!',
        'error'
      );
      console.log('Erro ao enviar o email: ', error);
    }
  );
}

// Função para exibir alertas com Bootstrap
function showAlert(message, type) {
  const notificationCol = document.querySelector('.notification-col');
  if (!notificationCol) return;

  // Atualiza mensagem e tipo
  const errorBox = notificationCol.querySelector('.alert-box--error');
  const successBox = notificationCol.querySelector('.alert-box--success');
  errorBox.classList.add('hideit');
  successBox.classList.add('hideit');

  if (type === 'success') {
    successBox.querySelector('p').textContent = message;
    successBox.classList.remove('hideit');
  } else {
    errorBox.querySelector('p').textContent = message;
    errorBox.classList.remove('hideit');
  }

  // Animação de entrada
  notificationCol.style.display = 'block';
  setTimeout(() => notificationCol.classList.add('show'), 10);

  // Fechar ao clicar no X
  notificationCol.querySelectorAll('.alert-box__close').forEach((btn) => {
    btn.onclick = function () {
      notificationCol.classList.remove('show');
      setTimeout(() => (notificationCol.style.display = 'none'), 500);
    };
  });

  // Esconde automaticamente após 6 segundos
  setTimeout(() => {
    notificationCol.classList.remove('show');
    setTimeout(() => (notificationCol.style.display = 'none'), 500);
  }, 6000);
}

document.addEventListener('DOMContentLoaded', function () {
  const notificationCol = document.querySelector('.notification-col');
  if (notificationCol) notificationCol.style.display = 'none';
});
