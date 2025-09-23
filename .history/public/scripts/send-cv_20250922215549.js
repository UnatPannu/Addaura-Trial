
document.addEventListener('DOMContentLoaded', () => {
  // Toggle .active class on the message textarea so CSS expansion is applied consistently
  const messageEl = document.querySelector('#cv-form textarea') || document.querySelector('#message');
  if (messageEl) {
    messageEl.addEventListener('focus', () => messageEl.classList.add('active'));
    messageEl.addEventListener('blur', () => messageEl.classList.remove('active'));
  }
});