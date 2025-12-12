// Simple localStorage-backed auth for Libby

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentUser(id) {
  localStorage.setItem('currentUserId', id);
}

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

function handleLogin(event) {
  event.preventDefault();
  const student = document.getElementById('login-student').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  const users = getUsers();
  if (!users[student]) {
    errorEl.textContent = 'Account not found. Please register first.';
    return;
  }
  if (users[student].password !== password) {
    errorEl.textContent = 'Incorrect password.';
    return;
  }

  setCurrentUser(student);
  localStorage.setItem('onboardingCompleted', 'true');
  window.location.href = 'index.html';
}

function handleRegister(event) {
  event.preventDefault();
  const fullName = document.getElementById('reg-name').value.trim();
  const yearLevel = document.getElementById('reg-year').value.trim();
  const student = document.getElementById('reg-student').value.trim();
  const password = document.getElementById('reg-password').value;
  const errorEl = document.getElementById('register-error');
  errorEl.textContent = '';

  if (!fullName || !yearLevel || !student || !password) {
    errorEl.textContent = 'Please fill out all fields.';
    return;
  }

  const users = getUsers();
  if (users[student]) {
    errorEl.textContent = 'Student number already registered. Please log in.';
    return;
  }

  users[student] = { fullName, yearLevel, studentNumber: student, password };
  saveUsers(users);
  setCurrentUser(student);
  localStorage.setItem('onboardingCompleted', 'true');
  window.location.href = 'index.html';
}

// Initial tab state
document.addEventListener('DOMContentLoaded', () => {
  switchAuthTab('login');
});


