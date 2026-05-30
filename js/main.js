'use strict';

<<<<<<< HEAD
/*
  CONFIGURAÇÃO RÁPIDA
  1) Troque o número abaixo pelo WhatsApp comercial da CRMSPEED.
  2) Use formato internacional, somente números. Ex.: 5521999999999.
  3) Os formulários ainda não enviam para banco. Eles abrem WhatsApp com mensagem pronta
     e guardam uma cópia local no navegador para conferência durante o MVP.
*/
const CRMSPEED_CONFIG = {
  whatsappNumber: '5521999999999',
  platformUrl: 'https://app.crmspeed.online/pt/login',
  partnerPanelUrl: 'https://parceiros.crmspeed.com'
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.MenuController) MenuController.init();
  if (window.AnimationController) AnimationController.init();
  initLeadForms();
  initSmoothAnchors();
});

function initLeadForms() {
  const forms = document.querySelectorAll('[data-lead-form]');
  const toast = document.getElementById('toast');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const type = form.getAttribute('data-lead-form') || 'lead';
      const data = Object.fromEntries(new FormData(form).entries());
      const createdAt = new Date().toISOString();

      const lead = {
        tipo: type,
        criado_em: createdAt,
        ...data
      };

      saveLeadLocally(lead);

      const message = buildWhatsAppMessage(lead);
      const url = `https://wa.me/${CRMSPEED_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

      showToast(toast, 'Cadastro preparado. Abrindo WhatsApp...');
      window.open(url, '_blank', 'noopener,noreferrer');
      form.reset();
    });
  });
}

function buildWhatsAppMessage(lead) {
  const title = lead.tipo === 'revendedor'
    ? 'Novo candidato a revendedor CRMSPEED'
    : 'Novo interessado em contratar CRMSPEED';

  const lines = [
    `*${title}*`,
    '',
    `Nome: ${lead.nome || '-'}`,
    `WhatsApp: ${lead.whatsapp || '-'}`,
  ];

  if (lead.empresa) lines.push(`Empresa/atividade: ${lead.empresa}`);
  if (lead.plano) lines.push(`Plano de interesse: ${lead.plano}`);
  if (lead.cidade) lines.push(`Cidade/Estado: ${lead.cidade}`);
  if (lead.perfil) lines.push(`Perfil comercial: ${lead.perfil}`);
  if (lead.mensagem) lines.push(`Mensagem: ${lead.mensagem}`);

  lines.push('', `Origem: crmspeed.online`, `Data: ${new Date(lead.criado_em).toLocaleString('pt-BR')}`);

  return lines.join('\n');
}

function saveLeadLocally(lead) {
  const key = 'crmspeed_leads_mvp';
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  current.unshift(lead);
  localStorage.setItem(key, JSON.stringify(current.slice(0, 100)));
}

function showToast(toast, message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('toast--visible');
  window.setTimeout(() => toast.classList.remove('toast--visible'), 3500);
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
=======
document.addEventListener('DOMContentLoaded', () => {
  MenuController.init();
  AnimationController.init();
});
>>>>>>> dbbef4fab246dca1802bf42bb06395c51a38381a
