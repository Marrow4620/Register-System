const body = document.querySelector('body');
const sidebar = document.querySelector('nav');
const toggle = document.querySelector('.toggle');
const searchBtn = document.querySelector('.search-box');
const modeSwitch = document.querySelector('.toggle-switch');
const modeText = document.querySelector('.mode-text');

// Verifique o valor no armazenamento local ao carregar a página
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function toggleSidebar() {
  sidebar.classList.toggle('close');
}

function toggleMode() {
  isDarkMode = !isDarkMode; // Inverta o estado do modo escuro
  localStorage.setItem('darkMode', isDarkMode); // Armazene a preferência do usuário

  body.classList.toggle('dark', isDarkMode);

  if (isDarkMode) {
    modeText.innerText = 'Light mode';
  } else {
    modeText.innerText = 'Dark mode';
  }
}

toggle.addEventListener('click', toggleSidebar);
modeSwitch.addEventListener('click', toggleMode);

// Configure o modo escuro ao carregar a página, se já estiver ativado no localStorage
if (isDarkMode) {
  body.classList.add('dark');
  modeText.innerText = 'Light mode';
}
