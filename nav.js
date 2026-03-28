// ══════════════════════════════════════════
//  Soft Skills — Navigation & Sidebar
// ══════════════════════════════════════════

const siteTree = [
  {
    key: 'section1', href: 'maitrise-de-soi.html', icon: '🧠', iconCls: 's-icon-1', dotColor: 'var(--c1)',
    children: [
      { key: 'sub1_1', href: 'connaissance-de-soi.html' },
      { key: 'sub1_2', href: 'intelligence-personnelle.html' },
      { key: 'sub1_3', href: 'gestion-personnelle.html' },
    ]
  },
  {
    key: 'section2', href: 'communication-relations.html', icon: '🤝', iconCls: 's-icon-2', dotColor: 'var(--c2)',
    children: [
      { key: 'sub2_1', href: 'communication-interpersonnelle.html' },
      { key: 'sub2_2', href: 'relations-professionnelles.html' },
    ]
  },
  {
    key: 'section3', href: 'performance-professionnelle.html', icon: '⚡', iconCls: 's-icon-3', dotColor: 'var(--c3)',
    children: [
      { key: 'sub3_1', href: 'attitudes-valeurs.html' },
      { key: 'sub3_2', href: 'organisation-productivite.html' },
    ]
  },
  {
    key: 'section4', href: 'leadership-influence.html', icon: '🌟', iconCls: 's-icon-4', dotColor: 'var(--c4)',
    children: [
      { key: 'sub4_1', href: 'leadership-management.html' },
      { key: 'sub4_2', href: 'gestion-changement.html' },
    ]
  },
  {
    key: 'section5', href: 'pensee-strategique.html', icon: '🔭', iconCls: 's-icon-5', dotColor: 'var(--c5)',
    children: [
      { key: 'sub5_1', href: 'resolution-problemes.html' },
      { key: 'sub5_2', href: 'gestion-financiere.html' },
    ]
  }
];

function renderSidebar(currentPage) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const lang = currentLang || 'fr';
  const T = translations[lang];

  let html = '<div class="sidebar-inner">';
  html += `<a class="sidebar-home${currentPage === 'index' ? ' active' : ''}" href="index.html">
    <span>🏠</span> <span data-i18n="home">${T.home}</span>
  </a>`;
  html += `<div class="sidebar-section-label" data-i18n="nav_label">${T.nav_label}</div>`;

  siteTree.forEach((section, i) => {
    const sectionActive = currentPage === section.href.replace('.html', '');
    const childActive = section.children.some(c => currentPage === c.href.replace('.html', ''));
    const isOpen = sectionActive || childActive;

    html += `<div class="sidebar-item">
      <button class="sidebar-toggle${sectionActive || childActive ? ' active' : ''}${isOpen ? ' open' : ''}"
        onclick="toggleSection(this)">
        <span class="section-icon ${section.iconCls}">${section.icon}</span>
        <span data-i18n="${section.key}">${T[section.key]}</span>
        <span class="chevron">▶</span>
      </button>
      <div class="sidebar-children${isOpen ? ' open' : ''}">`;

    section.children.forEach(child => {
      const childIsActive = currentPage === child.href.replace('.html', '');
      html += `<a class="sidebar-child${childIsActive ? ' active' : ''}" href="${child.href}">
        <span class="dot" style="background:${section.dotColor}"></span>
        <span data-i18n="${child.key}">${T[child.key]}</span>
      </a>`;
    });

    html += `</div></div>`;
  });

  html += '</div>';
  sidebar.innerHTML = html;
}

function renderBreadcrumb(crumbs) {
  const bc = document.getElementById('breadcrumb');
  if (!bc || !crumbs) return;
  const lang = currentLang || 'fr';
  const T = translations[lang];
  const sep = '<span class="sep">›</span>';

  let html = crumbs.map((crumb, i) => {
    if (i === crumbs.length - 1) {
      return `<span class="current" data-i18n="${crumb.key}">${T[crumb.key] || crumb.label}</span>`;
    }
    return `<a href="${crumb.href}" data-i18n="${crumb.key}">${T[crumb.key] || crumb.label}</a>`;
  }).join(sep);

  bc.innerHTML = html;
}

function toggleSection(btn) {
  btn.classList.toggle('open');
  const children = btn.nextElementSibling;
  if (children) children.classList.toggle('open');
}

function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

function initPage(config) {
  // config = { currentPage, breadcrumbs: [{key, href, label}] }
  window._pageConfig = config;
  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar(config.currentPage);
    if (config.breadcrumbs) renderBreadcrumb(config.breadcrumbs);
    initMobileNav();
    initLanguage();

    // Re-render sidebar + breadcrumb when language changes (override setLanguage)
    const _origSetLang = setLanguage;
    window.setLanguage = function(lang) {
      _origSetLang(lang);
      renderSidebar(config.currentPage);
      if (config.breadcrumbs) renderBreadcrumb(config.breadcrumbs);
    };
  });
}
