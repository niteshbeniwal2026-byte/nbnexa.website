/* ============================================================
   js/admin-auth.js — Simple admin access gate
   NB Nexa | AI Automation Agency
   ============================================================ */

(function() {
  'use strict';

  const ADMIN_AUTH_KEY = 'nbnexa-admin-auth';
  const ADMIN_EMAIL = 'niteshbeniwal@gmail.com';
  const ADMIN_PASSWORD = 'NbnexKL07af8781@239257@';
  const LOGIN_PAGE = 'login.html';
  const DASHBOARD_PAGE = 'dashboard.html';

  function isAuthenticated() {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === '1';
  }

  function setAuthenticated() {
    sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
  }

  function clearAuthentication() {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }

  function redirectToLogin() {
    window.location.href = LOGIN_PAGE;
  }

  function redirectToDashboard() {
    window.location.href = DASHBOARD_PAGE;
  }

  function handleLoginForm() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;

    if (isAuthenticated()) {
      redirectToDashboard();
      return;
    }

    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const message = document.getElementById('admin-login-message');

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = String(emailInput.value || '').trim();
      const password = String(passwordInput.value || '');

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setAuthenticated();
        redirectToDashboard();
        return;
      }

      message.textContent = 'Invalid email or password. Please try again.';
      message.classList.remove('text-slate-400');
      message.classList.add('text-red-400');
    });
  }

  function requireAdminAuth() {
    if (!isAuthenticated()) {
      redirectToLogin();
    }
  }

  function init() {
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('/control-room/login.html') || path.endsWith('/control-room/login') || path.endsWith('/control-room/');

    if (isLoginPage) {
      handleLoginForm();
      return;
    }

    requireAdminAuth();
  }

  window.adminLogout = function() {
    clearAuthentication();
    redirectToLogin();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
