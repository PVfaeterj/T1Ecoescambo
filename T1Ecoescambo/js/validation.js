function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function updateLoginButton() {
  const email = document.getElementById('loginEmail');
  const button = document.getElementById('loginButton');
  if (email && button) button.disabled = !validEmail(email.value);
}

function passwordIsValid(password) {
  return password.length >= 6 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);
}

function updateRegisterButton() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirm').value;
  const button = document.getElementById('registerButton');
  button.disabled = !(validEmail(email) && passwordIsValid(password) && password === confirm);
}

document.addEventListener('DOMContentLoaded', () => {
  const loginEmail = document.getElementById('loginEmail');
  if (loginEmail) {
    loginEmail.addEventListener('input', updateLoginButton);
    updateLoginButton();
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.querySelectorAll('input').forEach(input => input.addEventListener('input', updateRegisterButton));
    updateRegisterButton();
    registerForm.addEventListener('submit', event => {
      event.preventDefault();
      window.location.href = 'login.html';
    });
  }

  const recoveryEmail = document.getElementById('recoveryEmail');
  const recoveryButton = document.getElementById('recoveryButton');
  if (recoveryEmail && recoveryButton) {
    const update = () => recoveryButton.disabled = !validEmail(recoveryEmail.value);
    recoveryEmail.addEventListener('input', update);
    update();
    document.getElementById('recoveryForm').addEventListener('submit', event => {
      event.preventDefault();
      document.getElementById('recoveryMessage').textContent = 'Um e-mail com o link de recuperação foi enviado.';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      window.location.href = window.location.pathname.endsWith('/pages/login.html') ? 'catalogo.html' : 'pages/catalogo.html';
    });
  }
});
