// Firebase Auth for Libby - wired to student number UI

function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const studentNumber = document.getElementById('login-student').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  // Use student number as part of the email for Firebase
  const email = `${studentNumber}@ublc-student.local`;
  
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = err?.message || 'Login failed. Check your credentials.';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const fullName = document.getElementById('reg-name').value.trim();
  const yearLevel = document.getElementById('reg-year').value.trim();
  const studentNumber = document.getElementById('reg-student').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('register-error');
  errorEl.textContent = '';

  if (!fullName || !yearLevel || !studentNumber || !password) {
    errorEl.textContent = 'Please fill out all fields.';
    return;
  }

  const email = `${studentNumber}@ublc-student.local`;

  try {
    const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: fullName });
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = err?.message || 'Registration failed.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Hide the email/password overlay form
  const emailForm = document.getElementById('emailAuthForm');
  if (emailForm) emailForm.parentElement.style.display = 'none';
  
  switchAuthTab('login');
});

