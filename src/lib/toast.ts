export function showToast(message: string) {
  const existing = document.getElementById('copy-toast');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'copy-toast';
  div.textContent = message;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    z-index: 99999;
    animation: toastSlideIn 0.25s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes toastFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.animation = 'toastFadeOut 0.2s ease forwards';
    setTimeout(() => {
      div.remove();
      style.remove();
    }, 200);
  }, 2000);
}
